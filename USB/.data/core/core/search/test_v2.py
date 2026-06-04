import requests
import json
import time
import subprocess

def test_api_v2():
    print("Testing Search API V2...")
    # Since we can't easily start the server and wait for it here without backgrounding,
    # we'll test the SearchEngineV2 class directly again, which is the core logic.
    from core.search.search_engine import SearchEngineV2
    
    se = SearchEngineV2()
    
    # Test 1: Query Expansion (search 'fauna' should find 'animales' context)
    print("\nTesting Query Expansion: 'fauna'...")
    results = se.search("fauna")
    for r in results:
        print(f"Result: {r['title']} [{r['pedagogical_id']}]")
    
    # Test 2: Filters
    print("\nTesting Filters: 'ciencias' subject...")
    results = se.search("universo", filters={'subject': 1}) # Assuming 1 is Ciencias
    for r in results:
        print(f"Result: {r['title']} ({r['subject_name']})")

    # Test 3: Autocomplete
    print("\nTesting Autocomplete: 'anim'...")
    suggestions = se.autocomplete("anim")
    print(f"Suggestions: {suggestions}")

if __name__ == "__main__":
    test_api_v2()
