# atlas

This is the foundational project structure for the Atlas CLI tool, which includes a local web-based UI. The project is built using Bun, React, and TypeScript.

## Getting Started

To set up the project, navigate to the `backend` and `frontend` directories and install the dependencies:

```bash
cd backend
bun install
cd ../frontend
bun install
cd ..
```

### Running the Backend

The backend typically serves as the API for the frontend and/or the CLI logic.

-   **Development Mode**:
    ```bash
    cd backend
    bun run dev
    ```
-   **Production Build**:
    ```bash
    cd backend
    bun run build
    ```
-   **Start Production Server**:
    ```bash
    cd backend
    bun run start
    ```
-   **Linting**:
    ```bash
    cd backend
    bun run lint
    ```

### Running the Frontend

The frontend is the web-based user interface.

-   **Development Mode**:
    ```bash
    cd frontend
    bun run dev
    ```
-   **Production Build**:
    ```bash
    cd frontend
    bun run build
    ```
-   **Start Production Server**: (Note: A production server for the frontend usually means serving the built static assets. This command might vary based on how the built assets are served.)
    ```bash
    cd frontend
    bun run start
    ```
-   **Linting**:
    ```
    cd frontend
    bun run lint
    ```

### Running Both Frontend and Backend

To start both the frontend and backend in development mode concurrently, use the provided `Makefile`:

```bash
make dev
```

