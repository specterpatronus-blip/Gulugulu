import sqlite3
import os
import json
import re

class QueryExpander:
    def __init__(self, db_path='database.db'):
        self.db_path = db_path

    def expand(self, query):
        """
        Expands the query using synonyms/aliases from search_tokens.
        """
        if not query:
            return []
        
        # Clean and tokenize the query
        tokens = re.findall(r'\w+', query.lower())
        expanded_terms = set(tokens)
        
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            for token in tokens:
                # Find aliases for this token
                rows = conn.execute('''
                    SELECT t2.token 
                    FROM search_tokens t1
                    JOIN search_tokens t2 ON t1.id = t2.alias_of_id
                    WHERE t1.token = ?
                    UNION
                    SELECT t1.token
                    FROM search_tokens t1
                    JOIN search_tokens t2 ON t1.id = t2.alias_of_id
                    WHERE t2.token = ?
                ''', (token, token)).fetchall()
                
                for row in rows:
                    expanded_terms.add(row['token'])
        finally:
            conn.close()
            
        return list(expanded_terms)

class SearchEngineV2:
    def __init__(self, db_path='database.db'):
        self.db_path = db_path
        self.expander = QueryExpander(db_path)

    def search(self, query, filters=None):
        """
        Executes a high-precision search with massive boosting for titles and subjects.
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        
        try:
            query = query.strip() if query else ""
            where_clauses = []
            params = []

            # 1. NORMALIZED FILTERING (Strict matching for UI Compatibility)
            if filters:
                # Subject Filter
                sub = filters.get('subject')
                if sub and sub != 'all':
                    if str(sub).isdigit():
                        where_clauses.append("lo.subject_id = ?")
                        params.append(sub)
                    else:
                        # If UI sends the name 'Matemáticas' instead of ID
                        where_clauses.append("(s.name LIKE ? OR s.code LIKE ?)")
                        params.extend([f"%{sub}%", f"%{sub}%"])
                
                # Grade Filter
                gr = filters.get('grade')
                if gr and gr != 'all':
                    if str(gr).isdigit():
                        where_clauses.append("(lo.grade_id = ? OR g.level = ?)")
                        params.extend([gr, gr])
                    elif '°' in str(gr):
                        level = gr.replace('°', '').strip()
                        where_clauses.append("g.level = ?")
                        params.append(level)
                    else:
                        where_clauses.append("(g.name LIKE ? OR g.level LIKE ?)")
                        params.extend([f"%{gr}%", f"%{gr}%"])

                # Category Filter
                cat = filters.get('category')
                if cat and cat != 'all':
                    where_clauses.append("lo.id IN (SELECT r.lo_id FROM resources r JOIN file_types ft ON r.file_type_id = ft.id WHERE ft.category = ?)")
                    params.append(cat)

            where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"

            # 2. Case: Just Filtering (No query)
            if not query:
                sql = f'''
                    SELECT lo.id, lo.pedagogical_id, lo.title, lo.description, lo.slug,
                           lo.curation_score, lo.is_verified,
                           s.name as subject_name, g.name as grade_name,
                           0 as text_relevance, '' as snippet_text
                    FROM learning_objects lo
                    LEFT JOIN subjects s ON lo.subject_id = s.id
                    LEFT JOIN grades g ON lo.grade_id = g.id
                    WHERE {where_sql}
                    ORDER BY lo.curation_score DESC, lo.title ASC
                    LIMIT 100
                '''
                rows = conn.execute(sql, params).fetchall()
                return self._enrich_results(conn, rows)

            # 3. Case: High-Boosting Search with Synonym Expansion
            search_tokens = self.expander.expand(query)
            search_tokens = [t for t in search_tokens if len(t) > 1 or t.isdigit()]
            
            if not search_tokens:
                return []

            # Create an FTS search string that requires most terms but boosts titles
            # Using prefix * for children compatibility
            fts_query = " OR ".join([f'title:"{t}"* OR subject_name:"{t}"* OR content:"{t}"*' for t in search_tokens])

            # RANKING WEIGHTS: 
            # lo_id (idx 0): 0.0 | title (idx 1): 100.0 | description (idx 2): 10.0 | subject (idx 3): 20.0 | tags (idx 4): 5.0 | content (idx 5): 1.0
            sql = f'''
                SELECT 
                    lo.id, lo.pedagogical_id, lo.title, lo.description, lo.slug,
                    lo.curation_score, lo.is_verified,
                    s.name as subject_name, g.name as grade_name,
                    bm25(search_index, 0.0, 100.0, 10.0, 20.0, 5.0, 1.0) as text_relevance,
                    snippet(search_index, 5, '<b>', '</b>', '...', 20) as snippet_text
                FROM search_index
                JOIN learning_objects lo ON search_index.lo_id = lo.id
                LEFT JOIN subjects s ON lo.subject_id = s.id
                LEFT JOIN grades g ON lo.grade_id = g.id
                WHERE search_index MATCH ? AND {where_sql}
                ORDER BY (bm25(search_index, 0.0, 100.0, 10.0, 20.0, 5.0, 1.0) * -1) + (lo.curation_score * 5) DESC
                LIMIT 50
            '''
            
            try:
                rows = conn.execute(sql, [fts_query] + params).fetchall()
            except sqlite3.OperationalError:
                rows = []

            # 4. Fallback if FTS yields nothing
            if not rows:
                like_pat = f"%{query}%"
                sql_fallback = f'''
                    SELECT lo.id, lo.pedagogical_id, lo.title, lo.description, lo.slug,
                           lo.curation_score, lo.is_verified,
                           s.name as subject_name, g.name as grade_name,
                           1 as text_relevance, '' as snippet_text
                    FROM learning_objects lo
                    LEFT JOIN subjects s ON lo.subject_id = s.id
                    LEFT JOIN grades g ON lo.grade_id = g.id
                    WHERE (lo.title LIKE ? OR s.name LIKE ? OR lo.description LIKE ?) AND {where_sql}
                    ORDER BY lo.curation_score DESC
                    LIMIT 30
                '''
                rows = conn.execute(sql_fallback, [like_pat, like_pat, like_pat] + params).fetchall()
                
            return self._enrich_results(conn, rows)
            
        finally:
            conn.close()

    def _enrich_results(self, conn, rows):
        """Enriches the base rows with resource types, thumbnails, and physical paths."""
        results = []
        for row in rows:
            item = dict(row)
            # Get primary resource details
            res = conn.execute('''
                SELECT r.internal_path, r.original_name, ft.category 
                FROM resources r 
                JOIN file_types ft ON r.file_type_id = ft.id 
                WHERE r.lo_id = ?
                LIMIT 1
            ''', (item['id'],)).fetchone()
            
            if res:
                item['internal_path'] = res['internal_path']
                item['original_name'] = res['original_name']
                item['resource_types'] = [res['category']]
            else:
                item['internal_path'] = None
                item['original_name'] = None
                item['resource_types'] = []
            
            # Get primary thumbnail
            thumb = conn.execute('''
                SELECT rt.thumbnail_path 
                FROM resource_thumbnails rt
                WHERE rt.resource_id IN (SELECT id FROM resources WHERE lo_id = ?)
                LIMIT 1
            ''', (item['id'],)).fetchone()
            item['thumbnail'] = thumb['thumbnail_path'] if thumb else None
            
            # Get related content
            related = conn.execute('''
                SELECT lo2.title, lo2.pedagogical_id, kg.relation_type
                FROM knowledge_graph kg
                JOIN learning_objects lo2 ON kg.target_lo_id = lo2.id
                WHERE kg.source_lo_id = ?
                LIMIT 3
            ''', (item['id'],)).fetchall()
            item['related_content'] = [dict(r) for r in related]
            
            results.append(item)
        return results

    def autocomplete(self, query):
        """
        Provides pedagogical autocomplete suggestions.
        """
        if not query or len(query) < 2:
            return []
            
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            # Search in titles and search_tokens
            sql = '''
                SELECT title as text, 'lo' as type FROM learning_objects WHERE title LIKE ? 
                UNION
                SELECT token as text, 'token' as type FROM search_tokens WHERE token LIKE ?
                LIMIT 8
            '''
            rows = conn.execute(sql, (f'%{query}%', f'%{query}%')).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

if __name__ == "__main__":
    # Test
    se = SearchEngineV2()
    # Boostrap a few synonyms
    conn = sqlite3.connect('database.db')
    try:
        # Create a few tokens if they don't exist
        conn.execute("INSERT OR IGNORE INTO search_tokens (token) VALUES ('animales')")
        conn.execute("INSERT OR IGNORE INTO search_tokens (token) VALUES ('fauna')")
        # Link them
        id1 = conn.execute("SELECT id FROM search_tokens WHERE token='animales'").fetchone()[0]
        id2 = conn.execute("SELECT id FROM search_tokens WHERE token='fauna'").fetchone()[0]
        conn.execute("UPDATE search_tokens SET alias_of_id = ? WHERE id = ?", (id1, id2))
        conn.commit()
    finally:
        conn.close()
        
    print("Search results for 'animales':")
    results = se.search("animales")
    for r in results:
        print(f"- {r['title']} (Verified: {r['is_verified']})")
        print(f"  Snippet: {r['snippet_text']}")
