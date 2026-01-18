# Init Command Feature Spec

## 1. Description

This feature provides the `atlas init` command, which is the primary entry point for a user to integrate the Atlas planning framework into an existing project. The command scaffolds the necessary directory structure and default files within the project's root, allowing for immediate use of the Atlas system.

## 2. Command-Line Interface

-   **Command:** `atlas init`
-   **Action:** Initializes the Atlas planning framework in the current directory.
-   **Functionality:**
    -   Checks if an `.atlas` directory already exists in the current working directory. If it does, the command should abort with a clear message to the user to prevent overwriting an existing setup.
    -   Creates the main `.atlas` directory.
    -   Creates the `specs` and `tasks` subdirectories inside `.atlas`.
    -   Creates a default `application.md` file with a starter template.
    -   Creates a default `roadmap.md` file with a placeholder item.
    -   Creates a default `context.md` file that explains the framework to human and AI developers.

## 3. Generated File Structure

The command will produce the following directory structure:

```
.
├── .atlas/
│   ├── application.md
│   ├── context.md
│   ├── roadmap.md
│   ├── specs/
│   └── tasks/
└── ... (user's existing project files)
```

## 4. Default File Content

The following files will be created with default content to guide the user.

### 4.1. `application.md`

A starter template to help the user define their application.

```markdown
# Application Specification

## 1. Problem Statement

*(Describe the core problem your application is designed to solve. What are the user's pain points?)*

## 2. Proposed Solution

*(Provide a high-level overview of your application and how it addresses the problem. How will users interact with it?)*

## 3. Core Features

- *(List the main features or components of your application)*
- *Feature A*
- *Feature B*
- *Feature C*

## 4. Technical Stack

*(Describe the technologies, frameworks, and architecture you plan to use.)*

## AI Technical Notes

*(Provide any specific technical notes or instructions for an AI developer here. This content will be automatically included in the `context.md` file.)*
```

### 4.2. `roadmap.md`

An initial roadmap with a single placeholder item.

```markdown
1. Complete project setup and initial planning
```

### 4.3. `context.md`

A default context file to guide AI agents, based on the standard Atlas framework.

```markdown
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
```
