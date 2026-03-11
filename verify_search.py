from search_engine import SearchEngine
import os

# Ensure dummy files exist
bd_path = os.path.join(os.getcwd(), 'BD')
if not os.path.exists(bd_path):
    os.makedirs(bd_path)

# Initialize engine
se = SearchEngine(bd_path)

print("--- Test 1: Direct Match ---")
results = se.search("matematicas")
print(f"Query: 'matematicas' -> Found: {[r['name'] for r in results]}")

print("\n--- Test 2: Synonym Expansion ---")
# 'espacio' should trigger 'cohete' and 'astronauta' via synonyms.json
results = se.search("espacio")
print(f"Query: 'espacio' -> Found: {[r['name'] for r in results]}")

print("\n--- Test 3: Partial Match ---")
results = se.search("colombia")
print(f"Query: 'colombia' -> Found: {[r['name'] for r in results]}")
