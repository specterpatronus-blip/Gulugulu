-- GULUGULU V2: FOUNDATION SCHEMA
-- Philosophy: Knowledge-Centric, Resource-First, Offline-Optimized.

-- 1. CATALOGS
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS file_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    extension TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    category TEXT NOT NULL -- 'document', 'image', 'video', 'audio', 'interactive'
);

-- 2. CORE ENTITIES
CREATE TABLE IF NOT EXISTS learning_objects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,           -- Technical ID (Internal)
    pedagogical_id TEXT UNIQUE NOT NULL,  -- Public ID (LO-MAT-G1-001)
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    subject_id INTEGER,
    grade_id INTEGER,
    curation_score REAL DEFAULT 1.0,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'draft',         -- 'draft', 'published', 'archived'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (grade_id) REFERENCES grades(id)
);

CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lo_id INTEGER NOT NULL,
    uuid TEXT UNIQUE NOT NULL,
    internal_path TEXT UNIQUE NOT NULL,  -- Logical path in storage/resources/
    original_name TEXT NOT NULL,
    file_type_id INTEGER NOT NULL,
    file_size INTEGER NOT NULL,
    checksum_sha256 TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lo_id) REFERENCES learning_objects(id) ON DELETE CASCADE,
    FOREIGN KEY (file_type_id) REFERENCES file_types(id)
);

-- 3. KNOWLEDGE GRAPH
CREATE TABLE IF NOT EXISTS knowledge_graph (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_lo_id INTEGER NOT NULL,
    target_lo_id INTEGER NOT NULL,
    relation_type TEXT NOT NULL, -- 'prerequisite', 'continuation', 'related', 'part_of'
    weight REAL DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_lo_id) REFERENCES learning_objects(id) ON DELETE CASCADE,
    FOREIGN KEY (target_lo_id) REFERENCES learning_objects(id) ON DELETE CASCADE,
    UNIQUE(source_lo_id, target_lo_id, relation_type)
);

-- 4. ANALYSIS & CONTENT (DECOUPLED FROM CORE)
CREATE TABLE IF NOT EXISTS resource_analysis (
    resource_id INTEGER PRIMARY KEY,
    full_text TEXT,
    summary TEXT,
    language_code TEXT DEFAULT 'es',
    auto_tags TEXT, -- JSON array
    metadata_json TEXT, -- Technical metadata (exif, duration, resolution)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- 5. SEARCH & SYNONYMS
CREATE TABLE IF NOT EXISTS search_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    alias_of_id INTEGER, -- Self-reference for synonyms
    context TEXT,        -- 'math', 'science', 'general'
    weight REAL DEFAULT 1.0,
    FOREIGN KEY (alias_of_id) REFERENCES search_tokens(id) ON DELETE SET NULL,
    UNIQUE(token, alias_of_id)
);

-- 6. FTS5 VIRTUAL TABLE (For high-speed offline search)
-- We use a content-less table or external content table strategy for efficiency.
CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
    lo_id UNINDEXED,
    title,
    description,
    subject_name,
    tags,
    content,
    tokenize='unicode61'
);

-- 7. INITIAL DATA (BOOTSTRAP)
INSERT OR IGNORE INTO subjects (name, code) VALUES 
('Ciencias Naturales', 'CNT'),
('Matemáticas', 'MAT'),
('Lenguaje', 'LEN'),
('Ciencias Sociales', 'SOC'),
('Inglés', 'ING'),
('Tecnología', 'TEC'),
('Ética', 'ETI'),
('Religión', 'REL');

INSERT OR IGNORE INTO grades (name, level) VALUES 
('Primero', 1),
('Segundo', 2),
('Tercero', 3),
('Cuarto', 4),
('Quinto', 5);

INSERT OR IGNORE INTO file_types (extension, mime_type, category) VALUES 
('pdf', 'application/pdf', 'document'),
('jpg', 'image/jpeg', 'image'),
('png', 'image/png', 'image'),
('mp4', 'video/mp4', 'video'),
('mp3', 'audio/mpeg', 'audio'),
('docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'document');
