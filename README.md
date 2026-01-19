# Atlas

A simple planning framework for software development projects.

## What is Atlas?

Atlas is a way for me to:
- Centralise planning document
- Detail specs as individual Markdown files
- Create development tasks as individual Markdown files in my editor
- Facilitate collaboration with AI agents

All data lives in a `.atlas/` directory at the root of the project, keeping everything version-controlled alongside your code.

## Architecture

Atlas is built as a **single-process Bun cli** that:
1. Serves a REST-like API for managing `.atlas/` markdown files
2. Serves a React SPA for the web-based UI (Mainly for fun I personally use my editor)

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

This starts the server with automatic reloading on file changes. The web UI will be available at `http://localhost:6969`.

### Building the Frontend

Build the frontend assets for production:

```bash
bun run build
```
This will create a production-ready build of the React SPA in the `dist/public` directory.

## Usage

### Using the CLI

The project includes a command-line interface (CLI) for managing your Atlas project. You can run the CLI directly or install it globally.

**Running directly:**
```bash
bun run src/cli/index.ts <command>
```

**Installing the CLI Globally:**

To use the `atlas` command directly from anywhere in your system, you can link the package globally. `bun link` is the recommended way to create a global symlink for a local package.

```bash
bun link
```
This will make the `atlas` command available system-wide. After running this, you can execute commands like `atlas <command>`.

### Compiling a Standalone Binary

For a zero-dependency option, you can compile the CLI into a single, standalone executable.

```bash
bun build ./src/cli/index.ts --compile --outfile atlas
```

This creates a binary named `atlas` in your current directory. You can move this file to a directory in your system's `$PATH` (e.g., `/usr/local/bin`) to make it globally available.

### CLI Commands

#### `atlas init`

Initialize a new project with the Atlas planning framework:

```bash
atlas init
```

This creates:
- `.atlas/` directory with `specs/` and `tasks/` subdirectories.
- A default `application.md` file.
- A `context.md` file with instructions for AI collaboration.

#### `atlas web`

Launches the web UI.

```bash
atlas web
```

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

## License

MIT License
