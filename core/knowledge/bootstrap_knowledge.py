import sqlite3
import random

def bootstrap_knowledge():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # 1. Get some Learning Objects
    objects = cursor.execute("SELECT id, subject_id, grade_id, title FROM learning_objects").fetchall()
    
    if len(objects) < 10:
        print("Not enough learning objects to bootstrap graph.")
        return

    print(f"Bootstrapping knowledge graph for {len(objects)} objects...")

    # 2. Create some sample relations
    # Prerequisite: Math Grade 1 -> Math Grade 2
    math_g1 = [obj[0] for obj in objects if obj[1] == 2 and obj[2] == 1] # MAT Grade 1
    math_g2 = [obj[0] for obj in objects if obj[1] == 2 and obj[2] == 2] # MAT Grade 2
    
    if math_g1 and math_g2:
        cursor.execute('''
            INSERT OR IGNORE INTO knowledge_graph (source_lo_id, target_lo_id, relation_type)
            VALUES (?, ?, 'prerequisite')
        ''', (math_g1[0], math_g2[0]))
        print(f"Added prerequisite: {math_g1[0]} -> {math_g2[0]}")

    # Related: English family -> English numbers
    ing_fam = [obj[0] for obj in objects if "familia" in obj[3].lower()]
    ing_num = [obj[0] for obj in objects if "numero" in obj[3].lower()]
    
    if ing_fam and ing_num:
        cursor.execute('''
            INSERT OR IGNORE INTO knowledge_graph (source_lo_id, target_lo_id, relation_type)
            VALUES (?, ?, 'related')
        ''', (ing_fam[0], ing_num[0]))
        print(f"Added related: {ing_fam[0]} <-> {ing_num[0]}")

    # 3. Create a Learning Path
    cursor.execute('''
        INSERT OR IGNORE INTO learning_paths (title, description, subject_id, grade_id)
        VALUES ('Introducción a las Matemáticas', 'Camino básico para primer grado', 2, 1)
    ''')
    path_id = cursor.lastrowid or cursor.execute("SELECT id FROM learning_paths WHERE title='Introducción a las Matemáticas'").fetchone()[0]
    
    # Add steps
    for i, obj_id in enumerate(math_g1[:3]):
        cursor.execute('''
            INSERT OR IGNORE INTO path_steps (path_id, lo_id, step_order)
            VALUES (?, ?, ?)
        ''', (path_id, obj_id, i+1))
    
    conn.commit()
    conn.close()
    print("Bootstrap complete.")

if __name__ == "__main__":
    bootstrap_knowledge()
