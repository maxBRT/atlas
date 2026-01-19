# AI Context

This document provides context for the AI developer working on this project. It outlines the planning framework used, which is based on the Atlas application.

## The Atlas Planning Framework

This project uses the Atlas planning framework, which stores all planning and specification data as markdown files with YAML frontmatter within a `.atlas` directory at the root of the project repository.

This approach ensures that the plan is always in sync with the code. It allows both human developers and AI agents to interact with the same, up-to-date planning data.

The core components of the framework are:
- **Application Spec (`application.md`):** A central document that outlines the overall application.
- **Roadmap (`roadmap.md`):** A prioritized implementation order for features.
- **Feature Specifications (`/specs`):** Detailed feature specifications as individual markdown files.
- **Tasks/Tickets (`/tasks`):** Development tasks or tickets as individual markdown files.
- **AI Context (`context.md`):** This file, which is a snapshot of the project's structure and conventions.

## Generic File/Directory Structure

```
.
├── .atlas
│   ├── application.md
│   ├── context.md
│   ├── roadmap.md
│   ├── specs
│   └── tasks
└── ... (your project files)
```

## Technical Architecture Summary

The project is built with Bun and React/TypeScript. It runs as a single server process that:
1.  Serves a REST-like API to manage the planning files.
2.  Serves a React single-page application (SPA) for the user interface.

It also includes a command-line interface (CLI) for project management tasks.

When creating tasks, remember to distinguish between work on the **backend** (API endpoints, file system logic in Bun), the **frontend** (React components, UI state, user interactions), and the **CLI** (commands, arguments, file system operations).

## CLI Architecture

The CLI provides commands for managing the Atlas project.

### Directory Structure

```
src/cli/
├── index.ts              # Main CLI entry point with command routing
└── commands/
    ├── init.ts           # Logic for the 'init' command
    └── web.ts            # Logic for the 'web' command
```

### Entry Point

-   **`src/cli/index.ts`**: This is the executable entry point for the `atlas` command, defined in `package.json`'s `bin` field.
-   It uses `process.argv` to parse commands and arguments.
-   A `switch` statement routes to the appropriate command module.

### Adding a New Command

1.  Create a new file in `src/cli/commands/` (e.g., `my-command.ts`).
2.  Export a handler function from that file.
3.  Import the handler in `src/cli/index.ts` and add a new `case` to the `switch` statement.

### Running CLI commands

To run the CLI, use `bun run` with the path to the entry point:
`bun run src/cli/index.ts <command>`

For example:
`bun run src/cli/index.ts init`

### CLI Commands

#### `init`

-   **Description:** Initializes a new Atlas project in the current directory.
-   **Behavior:**
    -   Creates a `.atlas` directory.
    -   Inside `.atlas`, it creates `specs` and `tasks` subdirectories.
    -   It also creates default `application.md` and `context.md` files.
    -   If an `.atlas` directory already exists, the command will abort to prevent overwriting an existing project.

#### `web`

-   **Description:** Launches the web UI.
-   **Behavior:**
    -   Starts the web server in the background.
    -   The UI is accessible at `http://localhost:6969`.

## API Validation

This project uses **Zod** for validating API endpoints. When implementing API endpoints:

-   **Define Zod schemas** for request bodies, query parameters, and path parameters
-   **Validate incoming data** before processing to ensure type safety and data integrity
-   **Use Zod's type inference** to derive TypeScript types from schemas (e.g., `z.infer<typeof schema>`)
-   **Return clear error messages** when validation fails, using Zod's error handling

Example pattern:
```typescript
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string(),
  priority: z.enum(['low', 'medium', 'high'])
});

// In your endpoint handler
const result = requestSchema.safeParse(await request.json());
if (!result.success) {
  return new Response(JSON.stringify({ error: result.error }), { status: 400 });
}
// Use result.data with full type safety
```

## Testing

This project uses **Bun's built-in test runner** (`bun test`). Tests are colocated with the code they test, using the `.test.ts` suffix.

### Running Tests

```bash
# Run all tests
bun test

# Run tests for a specific file
bun test src/features/tasks/handlers/tasks.test.ts

# Run tests matching a pattern
bun test --filter "tasks"
```

### Test Patterns

-   **Use `bun:test` imports**: `import { test, expect, describe, beforeAll, afterAll, afterEach } from "bun:test"`
-   **Mock requests with params**: Create a helper function to attach params to Request objects
-   **Clean up test files**: Use `afterEach` and `afterAll` hooks to remove test-created files
-   **Test both success and error cases**: Include tests for validation errors (400), not found (404), and happy paths
-   **Test security**: Include tests for path traversal prevention and input validation

Example test file structure:
```typescript
import { test, expect, describe, afterEach } from "bun:test";

function createMockRequest(url: string, options = {}) {
    const { params, ...requestOptions } = options;
    const req = new Request(url, requestOptions);
    if (params) (req as any).params = params;
    return req;
}

describe("GET /api/resource", () => {
    afterEach(async () => { /* cleanup */ });

    test("returns data for valid request", async () => { /* ... */ });
    test("returns 404 for non-existent resource", async () => { /* ... */ });
    test("returns 400 for invalid input", async () => { /* ... */ });
});
```

## Instructions for AI

As a senior engineer AI, your role is to translate feature specifications into actionable development tickets for the team.

-   **Breaking Down a Feature:** When tasked with creating tickets for a feature specification (e.g., from a file in `.atlas/specs/`):
    1.  **Analyze the Specification:** Thoroughly read the spec to understand its requirements, including UI/UX, backend APIs, and file system interactions.
    2.  **Decompose into Tasks:** Break the feature down into smaller, granular tasks. A good practice is to create separate tickets for backend work (like API endpoints) and frontend work (like UI components, state management, and user interactions).
    3.  **Create Detailed Tickets:** For each task, create a new ticket following the "Adding a new task" guide below. Ensure each ticket has a clear title, a descriptive body, and a checklist of sub-tasks to guide the developer.

-   **Adding a new task:** To add a new task, create a file in `.atlas/tasks/` with a filename like `T-101.md`.
    -   The file must contain YAML frontmatter with `id`, `type`, `status`, `priority`, and a `parent_spec`.
    -   The body of the ticket should clearly describe the goal of the task.
    -   Use a markdown checklist (`- [ ] sub-task`) to list the specific implementation steps required to complete the task.

-   **Updating a task:** To update a task, modify the corresponding file in `.atlas/tasks/`.
-   **Adding a new feature spec:** To add a new feature spec, create a file in `.atlas/specs/` with a filename like `001-new-feature.md`.

This `context.md` file can be updated to provide more specific context about the project.