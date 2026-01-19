import { test, expect, describe, beforeAll, afterAll, afterEach } from "bun:test";
import { mkdir, rm, readdir } from "node:fs/promises";
import path from "node:path";
import { getDocuments } from "./getDocuments";
import { getDocument } from "./getDocument";
import { postDocument } from "./postDocument";
import { deleteDocument } from "./deleteDocument";
import { patchDocument } from "./patchDocument";

const TEST_ATLAS_DIR = path.join(process.cwd(), ".atlas");

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
        const files = await readdir(TEST_ATLAS_DIR);
        for (const file of files) {
            if (file.startsWith("test-doc-")) {
                await rm(path.join(TEST_ATLAS_DIR, file), { force: true });
            }
        }
    } catch {
        // Directory may not exist
    }
}

beforeAll(async () => {
    await mkdir(TEST_ATLAS_DIR, { recursive: true });
});

afterEach(async () => {
    await cleanupTestFiles();
});

afterAll(async () => {
    await cleanupTestFiles();
});

describe("GET /api/documents - getDocuments", () => {
    test("returns array of document filenames", async () => {
        // Create a test file
        const testFile = path.join(TEST_ATLAS_DIR, "test-doc-list.md");
        await Bun.write(testFile, "# Test Document");

        const req = createMockRequest("http://localhost/api/documents");
        const response = await getDocuments(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data).toContain("test-doc-list.md");
    });

    test("excludes subdirectories from the list", async () => {
        const req = createMockRequest("http://localhost/api/documents");
        const response = await getDocuments(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        // specs and tasks are directories, should not be in the list
        expect(body.data).not.toContain("specs");
        expect(body.data).not.toContain("tasks");
    });

    test("returns success response with data array", async () => {
        const req = createMockRequest("http://localhost/api/documents");
        const response = await getDocuments(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Documents retrieved successfully");
        expect(Array.isArray(body.data)).toBe(true);
    });

    test("returns multiple documents when multiple exist", async () => {
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-one.md"), "# Doc 1");
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-two.md"), "# Doc 2");

        const req = createMockRequest("http://localhost/api/documents");
        const response = await getDocuments(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toContain("test-doc-one.md");
        expect(body.data).toContain("test-doc-two.md");
    });
});

describe("GET /api/documents/:filename - getDocument", () => {
    test("returns document content for existing file", async () => {
        const content = "# Test Document\n\nThis is test content.";
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-read.md"), content);

        const req = createMockRequest("http://localhost/api/documents/test-doc-read.md", {
            params: { filename: "test-doc-read.md" },
        });
        const response = await getDocument(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.filename).toBe("test-doc-read.md");
        expect(body.data.content).toBe(content);
    });

    test("returns 404 for non-existent file", async () => {
        const req = createMockRequest("http://localhost/api/documents/nonexistent.md", {
            params: { filename: "nonexistent.md" },
        });
        const response = await getDocument(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid filename format", async () => {
        const req = createMockRequest("http://localhost/api/documents/invalid", {
            params: { filename: "invalid" },
        });
        const response = await getDocument(req);

        expect(response.status).toBe(400);
    });

    test("prevents path traversal - rejects ../", async () => {
        const req = createMockRequest("http://localhost/api/documents/../secret.md", {
            params: { filename: "../secret.md" },
        });
        const response = await getDocument(req);

        expect(response.status).toBe(400);
    });

    test("prevents path traversal - rejects slashes in filename", async () => {
        const req = createMockRequest("http://localhost/api/documents/sub/file.md", {
            params: { filename: "sub/file.md" },
        });
        const response = await getDocument(req);

        expect(response.status).toBe(400);
    });
});

describe("POST /api/documents/:filename - postDocument", () => {
    test("creates new document file", async () => {
        const content = "# New Document\n\nCreated via API.";
        const req = createMockRequest("http://localhost/api/documents/test-doc-create.md", {
            method: "POST",
            params: { filename: "test-doc-create.md" },
            body: JSON.stringify({ content }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postDocument(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Document saved successfully");
        expect(body.data.filename).toBe("test-doc-create.md");

        // Verify file was created
        const file = Bun.file(path.join(TEST_ATLAS_DIR, "test-doc-create.md"));
        expect(await file.exists()).toBe(true);
        expect(await file.text()).toBe(content);
    });

    test("updates existing document file", async () => {
        // Create initial file
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-update.md"), "# Original");

        const newContent = "# Updated Document";
        const req = createMockRequest("http://localhost/api/documents/test-doc-update.md", {
            method: "POST",
            params: { filename: "test-doc-update.md" },
            body: JSON.stringify({ content: newContent }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postDocument(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);

        // Verify file was updated
        const file = Bun.file(path.join(TEST_ATLAS_DIR, "test-doc-update.md"));
        expect(await file.text()).toBe(newContent);
    });

    test("returns 400 for missing content in body", async () => {
        const req = createMockRequest("http://localhost/api/documents/test-doc-bad.md", {
            method: "POST",
            params: { filename: "test-doc-bad.md" },
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postDocument(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid filename", async () => {
        const req = createMockRequest("http://localhost/api/documents/invalid", {
            method: "POST",
            params: { filename: "invalid" },
            body: JSON.stringify({ content: "test" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postDocument(req);

        expect(response.status).toBe(400);
    });
});

describe("DELETE /api/documents/:filename - deleteDocument", () => {
    test("deletes existing document file", async () => {
        const filePath = path.join(TEST_ATLAS_DIR, "test-doc-delete.md");
        await Bun.write(filePath, "# To delete");

        const req = createMockRequest("http://localhost/api/documents/test-doc-delete.md", {
            method: "DELETE",
            params: { filename: "test-doc-delete.md" },
        });
        const response = await deleteDocument(req);

        expect(response.status).toBe(204);

        // Verify file was deleted
        const file = Bun.file(filePath);
        expect(await file.exists()).toBe(false);
    });

    test("returns 404 for non-existent file", async () => {
        const req = createMockRequest("http://localhost/api/documents/nonexistent.md", {
            method: "DELETE",
            params: { filename: "nonexistent.md" },
        });
        const response = await deleteDocument(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid filename", async () => {
        const req = createMockRequest("http://localhost/api/documents/invalid", {
            method: "DELETE",
            params: { filename: "invalid" },
        });
        const response = await deleteDocument(req);

        expect(response.status).toBe(400);
    });

    test("prevents path traversal on delete", async () => {
        const req = createMockRequest("http://localhost/api/documents/../secret.md", {
            method: "DELETE",
            params: { filename: "../secret.md" },
        });
        const response = await deleteDocument(req);

        expect(response.status).toBe(400);
    });
});

describe("PATCH /api/documents/:filename - patchDocument (rename)", () => {
    test("renames document file successfully", async () => {
        const oldPath = path.join(TEST_ATLAS_DIR, "test-doc-old.md");
        const newPath = path.join(TEST_ATLAS_DIR, "test-doc-new.md");
        await Bun.write(oldPath, "# Document to rename");

        const req = createMockRequest("http://localhost/api/documents/test-doc-old.md", {
            method: "PATCH",
            params: { filename: "test-doc-old.md" },
            body: JSON.stringify({ newFilename: "test-doc-new.md" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await patchDocument(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Document renamed successfully");
        expect(body.data.oldFilename).toBe("test-doc-old.md");
        expect(body.data.newFilename).toBe("test-doc-new.md");

        // Verify old file no longer exists
        expect(await Bun.file(oldPath).exists()).toBe(false);
        // Verify new file exists
        expect(await Bun.file(newPath).exists()).toBe(true);
    });

    test("returns 404 when source file does not exist", async () => {
        const req = createMockRequest("http://localhost/api/documents/nonexistent.md", {
            method: "PATCH",
            params: { filename: "nonexistent.md" },
            body: JSON.stringify({ newFilename: "test-doc-renamed.md" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await patchDocument(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 409 when destination file already exists", async () => {
        // Create both files
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-src.md"), "# Source");
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-dest.md"), "# Destination");

        const req = createMockRequest("http://localhost/api/documents/test-doc-src.md", {
            method: "PATCH",
            params: { filename: "test-doc-src.md" },
            body: JSON.stringify({ newFilename: "test-doc-dest.md" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await patchDocument(req);
        const body = await response.json();

        expect(response.status).toBe(409);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid old filename", async () => {
        const req = createMockRequest("http://localhost/api/documents/invalid", {
            method: "PATCH",
            params: { filename: "invalid" },
            body: JSON.stringify({ newFilename: "test-doc-new.md" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await patchDocument(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid new filename", async () => {
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-valid.md"), "# Valid");

        const req = createMockRequest("http://localhost/api/documents/test-doc-valid.md", {
            method: "PATCH",
            params: { filename: "test-doc-valid.md" },
            body: JSON.stringify({ newFilename: "invalid" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await patchDocument(req);

        expect(response.status).toBe(400);
    });

    test("prevents path traversal in new filename", async () => {
        await Bun.write(path.join(TEST_ATLAS_DIR, "test-doc-rename.md"), "# Test");

        const req = createMockRequest("http://localhost/api/documents/test-doc-rename.md", {
            method: "PATCH",
            params: { filename: "test-doc-rename.md" },
            body: JSON.stringify({ newFilename: "../malicious.md" }),
            headers: { "Content-Type": "application/json" },
        });
        const response = await patchDocument(req);

        expect(response.status).toBe(400);
    });
});

describe("Security - Path Traversal Prevention", () => {
    test("filename validation rejects path traversal attempts", async () => {
        const maliciousFilenames = [
            "../secret.md",
            "..\\secret.md",
            "sub/file.md",
            "sub\\file.md",
            "../../etc/passwd.md",
        ];

        for (const filename of maliciousFilenames) {
            const req = createMockRequest(`http://localhost/api/documents/${filename}`, {
                params: { filename },
            });
            const response = await getDocument(req);

            expect(response.status).toBe(400);
        }
    });
});
