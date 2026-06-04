-- GULUGULU V2: PHASE 5 - KNOWLEDGE GRAPH & LEARNING PATHS

-- 1. Learning Paths (High-level sequences)
CREATE TABLE IF NOT EXISTS learning_paths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    subject_id INTEGER,
    grade_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (grade_id) REFERENCES grades(id)
);

-- 2. Path Steps (Ordered sequences of Learning Objects)
CREATE TABLE IF NOT EXISTS path_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path_id INTEGER NOT NULL,
    lo_id INTEGER NOT NULL,
    step_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (path_id) REFERENCES learning_paths(id) ON DELETE CASCADE,
    FOREIGN KEY (lo_id) REFERENCES learning_objects(id) ON DELETE CASCADE,
    UNIQUE(path_id, step_order)
);

-- 3. Enhance knowledge_graph with metadata
-- Check if we need to add columns. For now, we'll stick to the Phase 1 table 
-- but add an index for traversal.
CREATE INDEX IF NOT EXISTS idx_kg_source ON knowledge_graph(source_lo_id);
CREATE INDEX IF NOT EXISTS idx_kg_target ON knowledge_graph(target_lo_id);
CREATE INDEX IF NOT EXISTS idx_kg_relation ON knowledge_graph(relation_type);
