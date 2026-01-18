# Atlas Application Specification

## 1. Problem Statement

Tracking and managing software development plans, especially when collaborating with AI agents, presents several challenges:

-   Plans and specifications often live outside the project repository, leading to synchronization issues.
-   Misalignment between human developers and AI agents on the current plan is common.
-   The process of updating and maintaining the plan is cumbersome and involves significant friction.

## 2. Proposed Solution

To address these problems, we will create a "Atlas" application that stores all planning and specification data as markdown files with YAML frontmatter within a `.atlas` directory at the root of the project repository.

This approach ensures that the plan is always in sync with the code. It allows both human developers and AI agents to interact with the same, up-to-date planning data.

A local web-based UI will provide a user-friendly interface for viewing and managing these markdown files.

## 3. Core Features

The Atlas application will provide the following features through its web UI, with all data stored as markdown files in the `.atlas` directory:

-   **Main Application Spec:** Create and manage a central `main_spec.md` file that outlines the overall application.
-   **Roadmap:** Create and manage a prioritized implementation order for features in a `roadmap.md` file.
-   **Database Schema:** Define and visualize the database schema using DBML in a `database.dbml` file.
-   **Feature Specifications:** Create and manage detailed feature specifications as individual markdown files within a `.atlas/specs/` directory.
-   **Tasks/Tickets:** Create and manage development tasks or tickets as individual markdown files within a `.atlas/tasks/` directory.
-   **AI Context File:** A `context.md` file will be maintained to provide a snapshot of the project's structure and conventions, guiding AI agents on how to interact with the planner system.
-   **Project Initialization:** A command-line interface (CLI) command to scaffold a new project with the `.atlas` directory and a default `context.md` file.

## 4. Goals and Objectives

- **Streamline Software planning**: Integrate the planning and ticketing in the programming workflow 
- **Facilitate AI**: Make it easier to plan with AI as well as delegate to AI
- **Remove friction**: Remove the friction of using an ouside tool.

## 5. Technical Stack and Architecture

The Atlas application will be built as a single, self-contained command-line tool using a modern, all-in-one JavaScript toolkit.

-   **Core Technology:** **Bun**
    -   **Why:** Bun is chosen for its exceptional performance and its all-in-one nature. It functions as the JavaScript runtime, package manager, server, and bundler, drastically simplifying the project's dependencies and build process.

-   **Architecture:** The tool consists of two main parts packaged together:
    1.  **Backend Server:** A lightweight backend will be built using the native `Bun.serve` API. Its responsibilities are:
        -   Routing will be handled directly via `Bun.serve` APIs for maximum minimalism.
        -   To serve the static frontend UI files.
        -   To provide a simple REST-like API for file operations (listing, reading, writing, deleting) within the `.atlas` directory of the project where the tool is run.
    2.  **Frontend UI:** A clean, single-page application (SPA) will be built using **React** and **TypeScript**. This will provide the user-friendly web interface for managing the planning files.

-   **Build & Distribution:**
    -   **Why:** To make installation and usage as frictionless as possible, the entire application (Bun runtime, backend server, and the pre-built React UI) will be compiled into a **single, standalone executable** using `bun build --compile`.
    -   This means no external dependencies are needed on the user's machine (not even Node.js or Bun). The user can simply download the executable, place it in their PATH, and run it in any project directory.

## 6. Data Model

**Repo as a database** 

.atlas/
├── application.md
├── specs/              # High-level feature designs 
│   ├── 001-auth.md
│   └── 002-forum.md
├── tasks/              # Granular actionable items 
│   ├── T-101.md
│   └── T-102.md
└── context.md          # AUTO-GENERATED snapshot for the AI

Tasks should have this metadata.

---
id: "T-101"
type: "task"
status: "todo"  # todo, in-progress, done
priority: "high"
parent_spec: "001-auth.md"
---

## 7. User Interface (UI) / User Experience (UX)

- As a user I want a single page with a everything I need to plan accessible on a sidebar to make planning as simple as possible
- As a user I want to create specs and tasks in an intuitive and SIMPLE UI to move as fast as possilbe
- As a user I want to update the status of tasks in the editor and have that change reflected in the markdown files

## 8. Command-Line Interface (CLI)

The Atlas tool will also provide a command-line interface for project management tasks.

### `atlas init`

-   **Action:** Initializes a new project with the Atlas planning framework.
-   **Functionality:**
    -   Creates the `.atlas` directory in the current project's root.
    -   Creates the `specs` and `tasks` subdirectories inside `.atlas`.
    -   Creates a default `context.md` file inside `.atlas` that explains the planning framework and how to work with it. This file serves as an initial guide for AI agents.
    -   Creates a default `application.md` with a basic template.
    -   Creates an empty `roadmap.md` file.
-   **Usage:**
    ```bash
    atlas init
    ```
