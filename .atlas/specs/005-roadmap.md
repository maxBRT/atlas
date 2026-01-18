# Roadmap Feature Spec

## 1. Description

This feature provides a high-level project roadmap focused on the **sequence of feature implementation**. It acts as a prioritized backlog, managed via a `roadmap.md` file in the `.atlas` directory. The order of items in the file represents the order of implementation.

## 2. UI/UX

-   A "Roadmap" item in the main sidebar.
-   The view will render `roadmap.md` as an ordered, interactive list.
-   Users can **drag and drop** items in the list to change their priority.
-   When the list is re-ordered in the UI, the `roadmap.md` file is automatically updated on the backend.
-   A button to "Add Item" to the roadmap, which appends a new item to the end of the list.
-   Each item in the list is editable.

## 3. Backend API

-   `GET /api/roadmap`: Reads `.atlas/roadmap.md`, parses it into a list of strings (one for each item), and returns it as a JSON array.
-   `POST /api/roadmap`: Receives a JSON array of strings. It will overwrite `roadmap.md` with this list, formatted as a markdown ordered list.

## 4. File System

-   A single file located at `.atlas/roadmap.md`.
-   The content is a markdown ordered list (e.g., `1. First item`, `2. Second item`). Each line is treated as a distinct roadmap item.
