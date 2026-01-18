# Main Application Spec Feature

## 1. Description

This feature concerns the creation and management of a central `application.md` file (as per the data model, not `main_spec.md` as in the feature list). This file serves as the top-level document outlining the entire application, its purpose, architecture, and core components. It's the starting point for anyone, human or AI, to understand the project.

## 2. UI/UX

-   A dedicated, clearly labeled section in the web UI's main view or sidebar for "Application Spec".
-   Clicking this will open `application.md` in a rich text editor (e.g., a markdown editor with preview).
-   The editor should provide standard text formatting controls (headings, bold, lists, etc.).
-   A "Save" button to write the changes back to the `application.md` file on the filesystem.
-   The UI should handle the case where `application.md` does not exist, prompting the user to create it.

## 3. Backend API

-   `GET /api/application`: Reads the content of `.atlas/application.md` and returns it as JSON.
    -   If the file doesn't exist, it should return a 404 status or a specific error code.
-   `POST /api/application`: Receives JSON data containing the new content for `application.md` and writes it to the file.
    -   If the file doesn't exist, it will be created.

## 4. File System

-   The file will be located at `.atlas/application.md`.
-   The content will be standard markdown.
