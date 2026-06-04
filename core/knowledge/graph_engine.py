import sqlite3
import os

class KnowledgeGraphEngine:
    """
    Core engine for navigating the educational knowledge graph.
    Handles relationships, prerequisites, and learning continuations.
    """
    def __init__(self, db_path='database.db'):
        self.db_path = db_path

    def _get_conn(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def add_relation(self, source_id, target_id, rel_type, weight=1.0):
        """Adds a pedagogical relationship between two Learning Objects."""
        conn = self._get_conn()
        try:
            conn.execute('''
                INSERT OR REPLACE INTO knowledge_graph (source_lo_id, target_lo_id, relation_type, weight)
                VALUES (?, ?, ?, ?)
            ''', (source_id, target_id, rel_type, weight))
            conn.commit()
            return True
        finally:
            conn.close()

    def get_neighbors(self, lo_id, rel_type=None, direction='out'):
        """
        Gets connected Learning Objects.
        direction: 'out' (LO -> Target), 'in' (Source -> LO), 'both'
        """
        conn = self._get_conn()
        try:
            results = []
            if direction in ['out', 'both']:
                sql = '''
                    SELECT lo.*, kg.relation_type, kg.weight
                    FROM knowledge_graph kg
                    JOIN learning_objects lo ON kg.target_lo_id = lo.id
                    WHERE kg.source_lo_id = ?
                '''
                if rel_type:
                    sql += " AND kg.relation_type = ?"
                    rows = conn.execute(sql, (lo_id, rel_type)).fetchall()
                else:
                    rows = conn.execute(sql, (lo_id,)).fetchall()
                results.extend([dict(r) for r in rows])

            if direction in ['in', 'both']:
                sql = '''
                    SELECT lo.*, kg.relation_type, kg.weight
                    FROM knowledge_graph kg
                    JOIN learning_objects lo ON kg.source_lo_id = lo.id
                    WHERE kg.target_lo_id = ?
                '''
                if rel_type:
                    sql += " AND kg.relation_type = ?"
                    rows = conn.execute(sql, (lo_id, rel_type)).fetchall()
                else:
                    rows = conn.execute(sql, (lo_id,)).fetchall()
                results.extend([dict(r) for r in rows])
                
            return results
        finally:
            conn.close()

    def get_prerequisites(self, lo_id):
        """Returns Learning Objects that are prerequisites for the given LO."""
        return self.get_neighbors(lo_id, rel_type='prerequisite', direction='in')

    def get_continuations(self, lo_id):
        """Returns Learning Objects that continue the topic after the given LO."""
        return self.get_neighbors(lo_id, rel_type='continuation', direction='out')

    def get_related(self, lo_id):
        """Returns Learning Objects related to the given LO."""
        return self.get_neighbors(lo_id, rel_type='related', direction='both')

class RecommendationEngine:
    """
    Heuristic-based recommendation engine for educational content.
    Combines Graph connections with Subject/Grade proximity.
    """
    def __init__(self, db_path='database.db'):
        self.db_path = db_path
        self.graph = KnowledgeGraphEngine(db_path)

    def recommend_for_lo(self, lo_id, limit=5):
        """
        Returns recommended Learning Objects based on:
        1. Graph Neighbors (Continuation/Related)
        2. Same Subject & Same Grade
        3. Same Subject & Next Grade
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            # Get current LO metadata
            current = conn.execute('SELECT * FROM learning_objects WHERE id = ?', (lo_id,)).fetchone()
            if not current: return []

            # 1. Graph Recommendations (Weight: 10)
            neighbors = self.graph.get_neighbors(lo_id, direction='both')
            recommendations = {}
            for n in neighbors:
                score = 10 * n.get('weight', 1.0)
                if n['relation_type'] == 'continuation': score *= 1.5
                recommendations[n['id']] = {'data': n, 'score': score}

            # 2. Same Subject/Grade (Weight: 5)
            same_sg = conn.execute('''
                SELECT * FROM learning_objects 
                WHERE subject_id = ? AND grade_id = ? AND id != ?
                LIMIT 10
            ''', (current['subject_id'], current['grade_id'], lo_id)).fetchall()
            for r in same_sg:
                if r['id'] not in recommendations:
                    recommendations[r['id']] = {'data': dict(r), 'score': 5}
                else:
                    recommendations[r['id']]['score'] += 3

            # Sort and return
            sorted_recs = sorted(recommendations.values(), key=lambda x: x['score'], reverse=True)
            return [r['data'] for r in sorted_recs[:limit]]
        finally:
            conn.close()

class PathBuilder:
    """Manages Learning Paths (curated sequences of Learning Objects)."""
    def __init__(self, db_path='database.db'):
        self.db_path = db_path

    def get_path(self, path_id):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            path = conn.execute('SELECT * FROM learning_paths WHERE id = ?', (path_id,)).fetchone()
            if not path: return None
            
            steps = conn.execute('''
                SELECT ps.*, lo.title, lo.pedagogical_id, lo.slug
                FROM path_steps ps
                JOIN learning_objects lo ON ps.lo_id = lo.id
                WHERE ps.path_id = ?
                ORDER BY ps.step_order ASC
            ''', (path_id,)).fetchall()
            
            res = dict(path)
            res['steps'] = [dict(s) for s in steps]
            return res
        finally:
            conn.close()

    def list_paths(self, subject_id=None, grade_id=None):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            sql = 'SELECT * FROM learning_paths WHERE 1=1'
            params = []
            if subject_id:
                sql += ' AND subject_id = ?'
                params.append(subject_id)
            if grade_id:
                sql += ' AND grade_id = ?'
                params.append(grade_id)
            
            rows = conn.execute(sql, params).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()
