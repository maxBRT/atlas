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

When creating tasks, remember to distinguish between work on the **backend** (API endpoints, file system logic in Bun) and the **frontend** (React components, UI state, user interactions).

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