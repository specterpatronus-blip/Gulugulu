# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Explorador Escolar** - An educational platform for the University of Cundinamarca (UDEC). It's a Flask web application that provides:
- File search and management for educational content
- Mini-games for students (minijuegos)
- Admin dashboard for content and user management

## Commands

### Run the Application
```bash
python app.py
```
The server runs on `http://localhost:5000` with debug mode enabled.

### Initialize/Reset Database
```bash
python init_db.py
```
Creates a fresh SQLite database with default admin user (credentials: username=`admin`, password=`admon123*`).

### Test Search Engine
```bash
python search_engine.py
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Architecture

### Tech Stack
- **Backend**: Flask with SQLite database
- **Frontend**: HTML/CSS/Vanilla JS with Vue.js for some components
- **Search**: Custom in-memory search engine with synonym support

### Key Files
- `app.py` - Main Flask application with all routes and endpoints
- `search_engine.py` - Search engine class for indexing and searching files in BD directory
- `init_db.py` - Database initialization script

### Directory Structure
```
├── app.py              # Main Flask app (routes, authentication, file handling)
├── search_engine.py    # SearchEngine class for file indexing
├── init_db.py          # DB setup (users, roles)
├── database.db         # SQLite database (auto-created)
├── requirements.txt   # Dependencies (Flask, werkzeug)
├── BD/                # Directory for uploaded educational content (PDFs, images, etc.)
├── ELEMENTOS_VISUALES/ # Visual assets (backgrounds, videos)
├── templates/          # HTML templates (Jinja2)
│   ├── index.html      # Home page
│   ├── results.html   # Search results page
│   ├── minijuegos.html # Games landing page
│   ├── juegos/        # Game templates
│   ├── admin_login.html
│   └── admin_dashboard.html
└── static/             # CSS, JS, images, fonts
```

### Database Schema
- **roles**: `id`, `name` (admin, maestro)
- **users**: `cedula` (ID), `name`, `username`, `password` (hashed), `role_id`

### Routes
| Endpoint | Description |
|----------|-------------|
| `/` | Home page |
| `/search?q=<query>` | JSON API for search |
| `/autocomplete?q=<query>` | Autocomplete suggestions |
| `/files/<filename>` | Serve files from BD directory |
| `/admin` | Admin login page |
| `/admin/dashboard` | Admin dashboard (requires auth) |
| `/admin/upload` | File upload (POST, requires admin) |
| `/admin/delete` | File delete (POST, requires admin) |
| `/admin/create_user` | Create maestro user (POST, requires admin) |
| `/admin/update_user` | Update user (POST, requires admin) |
| `/admin/delete_user` | Delete user (POST, requires admin) |
| `/minijuegos` | Mini games page |
| `/juego/<grado>/<nivel>` | Game page by grade and level |

### Authentication
- Session-based authentication with `werkzeug.security` for password hashing
- Two roles: `admin` (full access) and `maestro` (limited access)
- Default admin credentials: username=`admin`, password=`admon123*`

### Search Engine
- Indexes files in the `BD/` directory
- Supports file type filtering (image, video, audio, document)
- Uses synonyms from `synonyms.json` to expand search queries
- Scoring algorithm prioritizes exact matches and prefix matches

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update "tasks/lessons.md" with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to 'tasks/todo.md' with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to 'tasks/todo.md'
6. **Capture Lessons**: Update "tasks/lessons.md" after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.