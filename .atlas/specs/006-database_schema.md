# Database Schema Feature Spec

## 1. Description

This feature allows for the definition and visualization of the application's database schema. It will be managed via a `.atlas/database.dbml` file using the Database Markup Language (DBML), enabling a single source of truth for the data model that is both human-readable and machine-parsable.

## 2. UI/UX

-   A "Database" item in the main sidebar.
-   The main view will be a split-panel interface:
    -   **Text Editor:** On one side, a text editor for the `.atlas/database.dbml` file.
    -   **Visualizer:** On the other side, a panel that renders an interactive Entity-Relationship Diagram (ERD) from the DBML code in the editor.
-   Changes made in the text editor will automatically refresh the visual diagram in real-time.
-   The visualizer may offer features like zooming and panning.

## 3. Backend API

-   `GET /api/database`: Reads the content of `.atlas/database.dbml` and returns it as a plain text or JSON response.
-   `POST /api/database`: Receives new DBML content as plain text or in a JSON object and overwrites the `.atlas/database.dbml` file.

## 4. File System

-   A single file located at `.atlas/database.dbml`.
-   The content of this file will be valid DBML code.

## 5. Proposed Key Technologies

To implement the frontend visualization, the following JavaScript libraries are recommended:

-   `@dbml/core`: For parsing the DBML source code.
-   `@dbml/renderer`: For rendering the parsed schema into a visual diagram.
