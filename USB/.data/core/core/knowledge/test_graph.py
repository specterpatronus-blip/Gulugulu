import sys
import os

# Add project root
sys.path.append(os.getcwd())

from core.knowledge.graph_engine import KnowledgeGraphEngine, RecommendationEngine

def test_knowledge_graph():
    print("Testing Knowledge Graph V1...")
    ge = KnowledgeGraphEngine()
    re = RecommendationEngine()
    
    # Test 1: Get neighbors for a known ID (from bootstrap)
    # We added related: 1 <-> 2
    print("\nTesting Related Content for LO 1...")
    related = ge.get_related(1)
    for r in related:
        print(f"- Related: {r['title']} [{r['pedagogical_id']}] (Type: {r['relation_type']})")

    # Test 2: Prerequisites
    # We added 24 -> 4
    print("\nTesting Prerequisites for LO 4...")
    prereqs = ge.get_prerequisites(4)
    for p in prereqs:
        print(f"- Prerequisite: {p['title']} [{p['pedagogical_id']}]")

    # Test 3: Recommendations
    print("\nTesting Recommendations for LO 1...")
    recs = re.recommend_for_lo(1, limit=3)
    for r in recs:
        print(f"- Recommended: {r['title']} (Subject: {r.get('subject_id')}, Grade: {r.get('grade_id')})")

if __name__ == "__main__":
    test_knowledge_graph()
