# Tasks/Tickets Feature

## 1. Description

This feature provides a system for creating, managing, and tracking development tasks or tickets. Each task is a markdown file with YAML frontmatter for metadata, stored in the `.atlas/tasks/` directory. This allows for granular tracking of work items.

## 2. UI/UX

-   A "Tasks" or "Tickets" section in the sidebar.
-   The UI should display tasks in a structured way as a list or a Kanban-style board (todo, in-progress, done).
-   The display should show key metadata from the frontmatter (ID, priority, status).
-   Clicking a task opens it in the editor.
-   The editor should have two parts:
    1.  A form to edit the YAML frontmatter fields (status, priority, etc.). Changing the status via a dropdown should be possible.
    2.  A markdown editor for the main content/description of the task.
-   A "New Task" button.
    -   This opens a form to create a new task.
    -   The UI will auto-generate a new ID (e.g., `T-103`).
    -   User fills in the metadata and description.
    -   On save, a new file like `.atlas/tasks/T-103.md` is created.

## 3. Backend API

-   `GET /api/tasks`: Reads all files in `.atlas/tasks/`, parses the frontmatter and markdown for each, and returns an array of task objects.
-   `GET /api/tasks/{task_id}`: Gets a single task object by its ID/filename.
-   `POST /api/tasks`: Creates a new task. The request body will contain the metadata and content. The backend is responsible for creating the file with the correct frontmatter and content.
-   `PUT /api/tasks/{task_id}`: Updates an existing task.
-   `DELETE /api/tasks/{task_id}`: Deletes a task file.

## 4. File System & Data Model

-   Tasks are stored in `.atlas/tasks/`.
-   Filename should match the task ID (e.g., `T-101.md`).
-   Each file MUST contain a YAML frontmatter block with the following fields:
    -   `id`: Unique identifier (e.g., "T-101").
    -   `type`: Should always be "task".
    -   `status`: "todo", "in-progress", or "done".
    -   `priority`: e.g., "low", "medium", "high".
    -   `parent_spec`: (Optional) The filename of the parent feature spec (e.g., "001-auth.md").
