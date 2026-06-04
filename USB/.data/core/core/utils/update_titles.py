import sqlite3
import os
import sys

# Add project root
sys.path.append(os.getcwd())

from core.utils.text_formatter import prettify_title

def update_db_titles():
    """
    Updates all learning_objects.title using the prettify_title logic
    based on the original filename from the resources table.
    """
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    print("Updating titles for all Learning Objects...")

    # Get LOs and their original resource names
    # Note: an LO might have multiple resources, we'll use the first one found
    rows = cursor.execute('''
        SELECT lo.id, r.original_name, lo.title as current_title
        FROM learning_objects lo
        JOIN resources r ON lo.id = r.lo_id
        GROUP BY lo.id
    ''').fetchall()

    updated_count = 0
    for row in rows:
        new_title = prettify_title(row['original_name'])
        
        if new_title != row['current_title']:
            cursor.execute('''
                UPDATE learning_objects 
                SET title = ? 
                WHERE id = ?
            ''', (new_title, row['id']))
            updated_count += 1
            # print(f"Update: {row['current_title']} -> {new_title}")

    # Also update the search_index FTS5 table to reflect new titles
    if updated_count > 0:
        print("Re-syncing search index...")
        # Simpler for FTS5: update row by row for the title column
        for row in rows:
            new_title = prettify_title(row['original_name'])
            cursor.execute('UPDATE search_index SET title = ? WHERE lo_id = ?', (new_title, row['id']))

    conn.commit()
    conn.close()
    print(f"Finished. Updated {updated_count} titles to child-friendly format.")

if __name__ == "__main__":
    update_db_titles()
