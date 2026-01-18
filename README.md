# Atlas

A lightweight planning framework for software development that keeps your plans in sync with your code. Atlas stores all planning and specification data as markdown files within your project repository, making it easy for both humans and AI agents to collaborate on the same up-to-date planning data.

## What is Atlas?

Atlas helps you manage:
- **Application Specs** - Central document outlining your overall application
- **Roadmap** - Prioritized implementation order for features
- **Database Schema** - Define and visualize database schema using DBML
- **Feature Specifications** - Detailed specs as individual markdown files
- **Tasks/Tickets** - Development tasks as individual markdown files
- **AI Context** - Snapshot of project structure and conventions for AI collaboration

All data lives in a `.atlas/` directory at the root of your project, keeping everything version-controlled alongside your code.

## Architecture

Atlas is built as a **single-process Bun application** that:
1. Serves a REST-like API for managing `.atlas/` markdown files
2. Serves a React SPA for the web-based UI

### Technology Stack
- **Runtime & Server**: Bun (handles server, bundling, and package management)
- **Frontend**: React with TypeScript
- **Data Storage**: Markdown files with YAML frontmatter in `.atlas/` directory

### Project Structure

```
.
├── .atlas/                 # Planning data
│   ├── application.md      # Main application spec
│   ├── context.md          # AI context and instructions
│   ├── roadmap.md          # Feature roadmap
│   ├── specs/              # Feature specifications
│   └── tasks/              # Development tasks/tickets
├── src/
│   ├── server.ts           # Main Bun server
│   ├── cli/                # CLI commands
│   ├── client/             # React frontend
│   ├── features/           # Backend API features
│   └── types/              # TypeScript types
├── public/                 # Static assets
│   └── index.html          # SPA entry point
└── dist/                   # Built artifacts
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed on your system

### Installation

```bash
bun install
```

### Development

Start the development server with hot reload:

```bash
bun run dev
```

This starts the server on `http://localhost:6969` with automatic reloading on file changes.

### Building

Build the application for production:

```bash
bun run build
```

This compiles the frontend assets and prepares the application for deployment.

## CLI Commands

### `atlas init`

Initialize a new project with the Atlas planning framework:

```bash
atlas init
```

This creates:
- `.atlas/` directory structure
- Default `application.md` template
- `context.md` with AI collaboration instructions
- Empty `roadmap.md`
- `specs/` and `tasks/` subdirectories

## Data Model

Tasks and specs use YAML frontmatter for metadata:

```markdown
---
id: "T-101"
type: "task"
status: "todo"  # todo, in-progress, done
priority: "high"
parent_spec: "001-auth.md"
---

# Task Title

Task description and implementation details...

- [ ] Sub-task 1
- [ ] Sub-task 2
```

## Goals

- **Streamline Software Planning**: Integrate planning and ticketing in the programming workflow
- **Facilitate AI Collaboration**: Make it easy to plan with AI and delegate tasks to AI agents
- **Remove Friction**: Eliminate the overhead of external planning tools

## Future Plans

The application will eventually be compiled into a **single standalone executable** using `bun build --compile`, requiring no external dependencies (not even Node.js or Bun) on the user's machine.

## License

Private project
