# Atlas Development Roadmap

This roadmap outlines the prioritized implementation order for the Atlas planning framework.

## Phase 1: Foundation (Complete)

1. **Initial Project Scaffolding** - Project structure, build configuration, and basic server setup

## Phase 2: Core API Infrastructure

2. **API Validation with Zod** - Type-safe request validation across all endpoints
3. **Main Application Spec API** - Backend endpoints for reading/writing `application.md`

## Phase 3: Content Management Features

4. **Feature Specifications** - CRUD operations for spec files in `.atlas/specs/`
5. **Tasks/Tickets** - CRUD operations for task files in `.atlas/tasks/` with YAML frontmatter support
6. **Roadmap Management** - API and logic for managing `roadmap.md`

## Phase 4: Web UI

7. **UI Layout & Navigation** - Sidebar navigation, main content area, responsive layout
8. **Application Spec Editor** - Markdown editor with preview for `application.md`
9. **Specs & Tasks UI** - List views, create/edit forms, status management
10. **Roadmap UI** - Visual roadmap display and editing

## Phase 5: AI & Advanced Features

11. **AI Context File** - Auto-generation of `context.md` from project state
12. **Database Schema** - DBML parsing and visualization

## Phase 6: Distribution

13. **Init Command (CLI)** - `atlas init` command to scaffold new projects
14. **Single Executable Build** - Compile to standalone binary with `bun build --compile`
