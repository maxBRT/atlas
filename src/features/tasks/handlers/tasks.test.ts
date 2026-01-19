import { test, expect, describe, beforeAll, afterAll, afterEach } from "bun:test";
import { mkdir, rm, readdir } from "node:fs/promises";
import path from "node:path";
import { getTasks } from "./getTasks";
import { getTask } from "./getTask";
import { postTask } from "./postTask";
import { putTask } from "./putTask";
import { deleteTask } from "./deleteTask";
import { extractMetadata, generateMetadata } from "../utils/frontmatterUtils";

const TEST_TASKS_DIR = path.join(process.cwd(), ".atlas", "tasks");

// Helper to create a mock request with params
function createMockRequest(
    url: string,
    options: RequestInit & { params?: Record<string, string> } = {}
): Request {
    const { params, ...requestOptions } = options;
    const req = new Request(url, requestOptions);
    if (params) {
        (req as any).params = params;
    }
    return req;
}

// Helper to clean up test files
async function cleanupTestFiles() {
    try {
        const files = await readdir(TEST_TASKS_DIR);
        for (const file of files) {
            if (file.startsWith("T-9")) {
                await rm(path.join(TEST_TASKS_DIR, file), { force: true });
            }
        }
    } catch {
        // Directory may not exist
    }
}

// Helper to create a valid task payload
function createTaskPayload(id: string, overrides: Partial<{
    status: string;
    priority: string;
    parentSpec: string;
    content: string;
}> = {}) {
    return {
        metadata: {
            id,
            status: overrides.status || "todo",
            priority: overrides.priority || "medium",
            ...(overrides.parentSpec && { parentSpec: overrides.parentSpec }),
        },
        content: overrides.content || "# Test Task\n\nThis is test content.",
    };
}

beforeAll(async () => {
    await mkdir(TEST_TASKS_DIR, { recursive: true });
});

afterEach(async () => {
    await cleanupTestFiles();
});

afterAll(async () => {
    await cleanupTestFiles();
});

describe("GET /api/tasks - getTasks", () => {
    test("returns array of task filenames", async () => {
        const testFile = path.join(TEST_TASKS_DIR, "T-901.md");
        const content = generateMetadata({ id: "T-901", status: "todo", priority: "high" }) + "# Test";
        await Bun.write(testFile, content);

        const req = createMockRequest("http://localhost/api/tasks");
        const response = await getTasks(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data).toContain("T-901.md");
    });

    test("returns success response with data array", async () => {
        const req = createMockRequest("http://localhost/api/tasks");
        const response = await getTasks(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Tasks retrieved successfully");
        expect(Array.isArray(body.data)).toBe(true);
    });

    test("returns multiple tasks when multiple exist", async () => {
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-902.md"),
            generateMetadata({ id: "T-902", status: "todo", priority: "low" }) + "# Task 1"
        );
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-903.md"),
            generateMetadata({ id: "T-903", status: "in-progress", priority: "high" }) + "# Task 2"
        );

        const req = createMockRequest("http://localhost/api/tasks");
        const response = await getTasks(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toContain("T-902.md");
        expect(body.data).toContain("T-903.md");
    });
});

describe("GET /api/tasks/:id - getTask", () => {
    test("returns task with parsed metadata and content for existing task", async () => {
        const metadata = { id: "T-904", status: "todo", priority: "high" };
        const content = "# Test Task\n\nThis is the task content.";
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-904.md"),
            generateMetadata(metadata) + content
        );

        const req = createMockRequest("http://localhost/api/tasks/T-904", {
            params: { id: "T-904" },
        });
        const response = await getTask(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.metadata.id).toBe("T-904");
        expect(body.data.metadata.status).toBe("todo");
        expect(body.data.metadata.priority).toBe("high");
        expect(body.data.content).toContain("# Test Task");
    });

    test("returns task with optional parentSpec field", async () => {
        const metadata = { id: "T-905", status: "todo", priority: "medium", parentSpec: "003-feature.md" };
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-905.md"),
            generateMetadata(metadata) + "# Task with parent"
        );

        const req = createMockRequest("http://localhost/api/tasks/T-905", {
            params: { id: "T-905" },
        });
        const response = await getTask(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data.metadata.parentSpec).toBe("003-feature.md");
    });

    test("returns 404 for non-existent task", async () => {
        const req = createMockRequest("http://localhost/api/tasks/T-999", {
            params: { id: "T-999" },
        });
        const response = await getTask(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid task ID format", async () => {
        const req = createMockRequest("http://localhost/api/tasks/invalid-id", {
            params: { id: "invalid-id" },
        });
        const response = await getTask(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for task ID without T- prefix", async () => {
        const req = createMockRequest("http://localhost/api/tasks/123", {
            params: { id: "123" },
        });
        const response = await getTask(req);

        expect(response.status).toBe(400);
    });
});

describe("POST /api/tasks - postTask", () => {
    test("creates new task file with metadata and content", async () => {
        const payload = createTaskPayload("T-906");
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Task created successfully");

        // Verify file was created
        const file = Bun.file(path.join(TEST_TASKS_DIR, "T-906.md"));
        expect(await file.exists()).toBe(true);

        const fileContent = await file.text();
        expect(fileContent).toContain("id: T-906");
        expect(fileContent).toContain("status: todo");
        expect(fileContent).toContain("# Test Task");
    });

    test("creates task with all metadata fields including parentSpec", async () => {
        const payload = createTaskPayload("T-907", {
            status: "in-progress",
            priority: "high",
            parentSpec: "001-feature.md",
        });
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);

        const file = Bun.file(path.join(TEST_TASKS_DIR, "T-907.md"));
        const fileContent = await file.text();
        expect(fileContent).toContain("status: in-progress");
        expect(fileContent).toContain("priority: high");
        expect(fileContent).toContain("parentSpec: 001-feature.md");
    });

    test("returns 400 for missing metadata", async () => {
        const payload = { content: "Some content" };
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for missing content", async () => {
        const payload = {
            metadata: { id: "T-908", status: "todo", priority: "medium" },
        };
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid task ID format in metadata", async () => {
        const payload = {
            metadata: { id: "invalid", status: "todo", priority: "medium" },
            content: "Content",
        };
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid status value", async () => {
        const payload = {
            metadata: { id: "T-909", status: "invalid-status", priority: "medium" },
            content: "Content",
        };
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid priority value", async () => {
        const payload = {
            metadata: { id: "T-910", status: "todo", priority: "critical" },
            content: "Content",
        };
        const req = createMockRequest("http://localhost/api/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postTask(req);

        expect(response.status).toBe(400);
    });
});

describe("PUT /api/tasks/:id - putTask", () => {
    test("updates existing task metadata", async () => {
        // Create initial task
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-911.md"),
            generateMetadata({ id: "T-911", status: "todo", priority: "low" }) + "# Original"
        );

        const payload = createTaskPayload("T-911", {
            status: "in-progress",
            priority: "high",
            content: "# Updated content",
        });
        const req = createMockRequest("http://localhost/api/tasks/T-911", {
            method: "PUT",
            params: { id: "T-911" },
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await putTask(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Task updated successfully");
        expect(body.data.metadata.status).toBe("in-progress");
        expect(body.data.metadata.priority).toBe("high");
    });

    test("updates task content while preserving metadata", async () => {
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-912.md"),
            generateMetadata({ id: "T-912", status: "todo", priority: "medium" }) + "# Original content"
        );

        const payload = createTaskPayload("T-912", {
            status: "todo",
            priority: "medium",
            content: "# Brand new content\n\nWith multiple paragraphs.",
        });
        const req = createMockRequest("http://localhost/api/tasks/T-912", {
            method: "PUT",
            params: { id: "T-912" },
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await putTask(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data.content).toBe("# Brand new content\n\nWith multiple paragraphs.");

        // Verify file was updated
        const file = Bun.file(path.join(TEST_TASKS_DIR, "T-912.md"));
        const fileContent = await file.text();
        expect(fileContent).toContain("# Brand new content");
    });

    test("returns 404 for non-existent task", async () => {
        const payload = createTaskPayload("T-999");
        const req = createMockRequest("http://localhost/api/tasks/T-999", {
            method: "PUT",
            params: { id: "T-999" },
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await putTask(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid task ID in params", async () => {
        const payload = createTaskPayload("T-913");
        const req = createMockRequest("http://localhost/api/tasks/invalid", {
            method: "PUT",
            params: { id: "invalid" },
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await putTask(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid body", async () => {
        await Bun.write(
            path.join(TEST_TASKS_DIR, "T-914.md"),
            generateMetadata({ id: "T-914", status: "todo", priority: "medium" }) + "# Content"
        );

        const req = createMockRequest("http://localhost/api/tasks/T-914", {
            method: "PUT",
            params: { id: "T-914" },
            body: JSON.stringify({ invalid: "data" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await putTask(req);

        expect(response.status).toBe(400);
    });
});

describe("DELETE /api/tasks/:id - deleteTask", () => {
    test("deletes existing task file", async () => {
        const filePath = path.join(TEST_TASKS_DIR, "T-915.md");
        await Bun.write(
            filePath,
            generateMetadata({ id: "T-915", status: "todo", priority: "low" }) + "# To delete"
        );

        const req = createMockRequest("http://localhost/api/tasks/T-915", {
            method: "DELETE",
            params: { id: "T-915" },
        });
        const response = await deleteTask(req);

        expect(response.status).toBe(204);

        // Verify file was deleted
        const file = Bun.file(filePath);
        expect(await file.exists()).toBe(false);
    });

    test("returns 400 for invalid task ID format", async () => {
        const req = createMockRequest("http://localhost/api/tasks/invalid", {
            method: "DELETE",
            params: { id: "invalid" },
        });
        const response = await deleteTask(req);

        expect(response.status).toBe(400);
    });
});

describe("Frontmatter Utilities - extractMetadata", () => {
    test("extracts metadata and content from valid frontmatter", () => {
        const input = `---
id: T-100
status: todo
priority: high
---
# Task Title

Task content here.`;

        const result = extractMetadata(input);

        expect(result).not.toBeNull();
        expect(result!.metadata.id).toBe("T-100");
        expect(result!.metadata.status).toBe("todo");
        expect(result!.metadata.priority).toBe("high");
        expect(result!.taskContent).toContain("# Task Title");
    });

    test("extracts optional parentSpec field", () => {
        const input = `---
id: T-101
status: in-progress
priority: medium
parentSpec: 003-feature.md
---
# Content`;

        const result = extractMetadata(input);

        expect(result).not.toBeNull();
        expect(result!.metadata.parentSpec).toBe("003-feature.md");
    });

    test("returns null for content without frontmatter", () => {
        const input = "# Just a heading\n\nNo frontmatter here.";
        const result = extractMetadata(input);

        expect(result).toBeNull();
    });

    test("returns null for malformed frontmatter (missing closing delimiter)", () => {
        const input = `---
id: T-102
status: todo
priority: high
This line has no closing delimiter and will cause parsing to fail`;

        const result = extractMetadata(input);

        expect(result).toBeNull();
    });

    test("returns null for empty frontmatter", () => {
        const input = `---
---
# Content`;

        const result = extractMetadata(input);

        expect(result).toBeNull();
    });

    test("handles frontmatter with special characters in values", () => {
        const input = `---
id: T-103
status: todo
priority: high
parentSpec: spec-with-dash_and_underscore.md
---
# Content`;

        const result = extractMetadata(input);

        expect(result).not.toBeNull();
        expect(result!.metadata.parentSpec).toBe("spec-with-dash_and_underscore.md");
    });

    test("preserves content after frontmatter including whitespace", () => {
        const input = `---
id: T-104
status: todo
priority: low
---

# Heading

Paragraph with content.

- List item 1
- List item 2`;

        const result = extractMetadata(input);

        expect(result).not.toBeNull();
        expect(result!.taskContent).toContain("# Heading");
        expect(result!.taskContent).toContain("- List item 1");
        expect(result!.taskContent).toContain("- List item 2");
    });
});

describe("Frontmatter Utilities - generateMetadata", () => {
    test("generates valid YAML frontmatter", () => {
        const metadata = { id: "T-100", status: "todo", priority: "high" };
        const result = generateMetadata(metadata);

        expect(result).toContain("---");
        expect(result).toContain("id: T-100");
        expect(result).toContain("status: todo");
        expect(result).toContain("priority: high");
        expect(result.startsWith("---\n")).toBe(true);
        expect(result.endsWith("---\n")).toBe(true);
    });

    test("includes optional fields when provided", () => {
        const metadata = {
            id: "T-101",
            status: "in-progress",
            priority: "medium",
            parentSpec: "001-spec.md",
        };
        const result = generateMetadata(metadata);

        expect(result).toContain("parentSpec: 001-spec.md");
    });

    test("generated frontmatter can be parsed back", () => {
        const original = { id: "T-102", status: "complete", priority: "low" };
        const generated = generateMetadata(original);
        const fullContent = generated + "# Task content";

        const parsed = extractMetadata(fullContent);

        expect(parsed).not.toBeNull();
        expect(parsed!.metadata.id).toBe(original.id);
        expect(parsed!.metadata.status).toBe(original.status);
        expect(parsed!.metadata.priority).toBe(original.priority);
    });
});

describe("Task ID Validation", () => {
    test("accepts valid task IDs", async () => {
        const validIds = ["T-1", "T-12", "T-123", "T-1234", "T-99999"];

        for (const id of validIds) {
            const payload = createTaskPayload(id);
            const req = createMockRequest("http://localhost/api/tasks", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const response = await postTask(req);

            expect(response.status).toBe(200);

            // Cleanup
            await rm(path.join(TEST_TASKS_DIR, `${id}.md`), { force: true });
        }
    });

    test("rejects invalid task ID formats", async () => {
        const invalidIds = [
            "T-",       // Missing number
            "T-abc",    // Letters instead of numbers
            "123",      // Missing T- prefix
            "t-123",    // Lowercase t
            "T123",     // Missing hyphen
            "TASK-123", // Wrong prefix
            "T-12.3",   // Decimal
            "T--123",   // Double hyphen
        ];

        for (const id of invalidIds) {
            const payload = {
                metadata: { id, status: "todo", priority: "medium" },
                content: "Content",
            };
            const req = createMockRequest("http://localhost/api/tasks", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const response = await postTask(req);

            expect(response.status).toBe(400);
        }
    });
});

describe("Security - Path Traversal Prevention", () => {
    test("task ID schema rejects path traversal attempts", async () => {
        const maliciousIds = [
            "../T-123",
            "T-123/../secret",
            "..\\T-123",
            "T-123/../../etc/passwd",
        ];

        for (const id of maliciousIds) {
            const req = createMockRequest(`http://localhost/api/tasks/${id}`, {
                params: { id },
            });
            const response = await getTask(req);

            expect(response.status).toBe(400);
        }
    });

    test("task ID in body cannot contain path characters", async () => {
        const maliciousPayloads = [
            { metadata: { id: "../T-123", status: "todo", priority: "medium" }, content: "x" },
            { metadata: { id: "T-123/x", status: "todo", priority: "medium" }, content: "x" },
            { metadata: { id: "T-123\\x", status: "todo", priority: "medium" }, content: "x" },
        ];

        for (const payload of maliciousPayloads) {
            const req = createMockRequest("http://localhost/api/tasks", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            const response = await postTask(req);

            expect(response.status).toBe(400);
        }
    });
});
