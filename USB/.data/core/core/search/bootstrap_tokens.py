import sqlite3

class SearchTokenManager:
    def __init__(self, db_path='database.db'):
        self.db_path = db_path

    def add_synonym(self, word1, word2, context='general'):
        conn = sqlite3.connect(self.db_path)
        try:
            # Insert both tokens
            conn.execute("INSERT OR IGNORE INTO search_tokens (token, context) VALUES (?, ?)", (word1, context))
            conn.execute("INSERT OR IGNORE INTO search_tokens (token, context) VALUES (?, ?)", (word2, context))
            
            # Get IDs
            id1 = conn.execute("SELECT id FROM search_tokens WHERE token=?", (word1,)).fetchone()[0]
            id2 = conn.execute("SELECT id FROM search_tokens WHERE token=?", (word2,)).fetchone()[0]
            
            # Link word2 to word1 as alias (using INSERT OR REPLACE or check)
            try:
                conn.execute("UPDATE search_tokens SET alias_of_id = ? WHERE id = ?", (id1, id2))
                conn.commit()
            except sqlite3.IntegrityError:
                pass
            return True
        finally:
            conn.close()

    def bootstrap_educational_synonyms(self):
        synonyms = [
            ('animales', 'fauna'),
            ('plantas', 'flora'),
            ('plantas', 'vegetación'),
            ('sumas', 'adición'),
            ('restas', 'sustracción'),
            ('multiplicación', 'producto'),
            ('división', 'cociente'),
            ('tierra', 'suelo'),
            ('tierra', 'planeta'),
            ('universo', 'cosmos'),
            ('universo', 'espacio'),
            ('agua', 'h2o'),
            ('agua', 'hidrografía'),
            ('cuerpo', 'anatomía'),
            ('cuerpo', 'organismo')
        ]
        for w1, w2 in synonyms:
            self.add_synonym(w1, w2)
        print(f"Bootstrapped {len(synonyms)} educational synonyms.")

if __name__ == "__main__":
    stm = SearchTokenManager()
    stm.bootstrap_educational_synonyms()
