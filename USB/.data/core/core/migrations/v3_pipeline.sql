-- GULUGULU V2: PHASE 3 - INGESTION & ANALYSIS
-- Add tables for tracking pipeline progress and storing extracted content.

-- 1. Job Tracking
CREATE TABLE IF NOT EXISTS pipeline_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER NOT NULL,
    job_type TEXT NOT NULL, -- 'metadata', 'text', 'thumbnail', 'indexing'
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- 2. Thumbnails (Decoupled storage for visual previews)
CREATE TABLE IF NOT EXISTS resource_thumbnails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id INTEGER NOT NULL,
    thumbnail_path TEXT NOT NULL,
    size_type TEXT NOT NULL, -- 'small', 'medium', 'large'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- 3. Optimization: Indices for pipeline management
CREATE INDEX IF NOT EXISTS idx_pipeline_status ON pipeline_jobs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_resource ON pipeline_jobs(resource_id);
