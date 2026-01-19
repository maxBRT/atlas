import { test, expect, describe, beforeAll, afterAll, afterEach } from "bun:test";
import { mkdir, rm, readdir } from "node:fs/promises";
import path from "node:path";
import { getSpecs } from "./getSpecs";
import { getSpecByName } from "./getSpecByName";
import { postSpec } from "./postSpec";
import { deleteSpec } from "./deleteSpecs";

const TEST_SPECS_DIR = path.join(process.cwd(), ".atlas", "specs");

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
        const files = await readdir(TEST_SPECS_DIR);
        for (const file of files) {
            if (file.startsWith("test-")) {
                await rm(path.join(TEST_SPECS_DIR, file), { force: true });
            }
        }
    } catch {
        // Directory may not exist
    }
}

beforeAll(async () => {
    // Ensure specs directory exists
    await mkdir(TEST_SPECS_DIR, { recursive: true });
});

afterEach(async () => {
    await cleanupTestFiles();
});

afterAll(async () => {
    await cleanupTestFiles();
});

describe("GET /api/specs - getSpecs", () => {
    test("returns array of spec filenames", async () => {
        // Create a test spec file
        const testFile = path.join(TEST_SPECS_DIR, "test-spec.md");
        await Bun.write(testFile, "# Test Spec");

        const req = createMockRequest("http://localhost/api/specs");
        const response = await getSpecs(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data).toContain("test-spec.md");
    });

    test("returns success response with data array", async () => {
        const req = createMockRequest("http://localhost/api/specs");
        const response = await getSpecs(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Specs retrieved successfully");
        expect(Array.isArray(body.data)).toBe(true);
    });
});

describe("GET /api/specs/:filename - getSpecByName", () => {
    test("returns spec content for existing file", async () => {
        const content = "# Test Spec\n\nThis is test content.";
        await Bun.write(path.join(TEST_SPECS_DIR, "test-get-spec.md"), content);

        const req = createMockRequest("http://localhost/api/specs/test-get-spec.md", {
            params: { filename: "test-get-spec.md" },
        });
        const response = await getSpecByName(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data).toBe(content);
    });

    test("returns 404 for non-existent file", async () => {
        const req = createMockRequest("http://localhost/api/specs/test-nonexistent.md", {
            params: { filename: "test-nonexistent.md" },
        });
        const response = await getSpecByName(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid filename format", async () => {
        const req = createMockRequest("http://localhost/api/specs/invalid", {
            params: { filename: "invalid" }, // Missing .md extension
        });
        const response = await getSpecByName(req);

        expect(response.status).toBe(400);
    });

    test("rejects path traversal attempts with ../", async () => {
        const req = createMockRequest("http://localhost/api/specs/../secret.md", {
            params: { filename: "../secret.md" },
        });
        const response = await getSpecByName(req);

        expect(response.status).toBe(400);
    });

    test("rejects filenames with special characters", async () => {
        const req = createMockRequest("http://localhost/api/specs/test@file.md", {
            params: { filename: "test@file.md" },
        });
        const response = await getSpecByName(req);

        expect(response.status).toBe(400);
    });
});

describe("POST /api/specs - postSpec", () => {
    test("creates new spec file", async () => {
        const payload = {
            filename: "test-new-spec.md",
            content: "# New Spec\n\nContent here.",
        };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data).toBe(payload.content);

        // Verify file was created
        const file = Bun.file(path.join(TEST_SPECS_DIR, "test-new-spec.md"));
        expect(await file.exists()).toBe(true);
        expect(await file.text()).toBe(payload.content);
    });

    test("updates existing spec file", async () => {
        const filename = "test-update-spec.md";
        await Bun.write(path.join(TEST_SPECS_DIR, filename), "Original content");

        const updatedContent = "# Updated Spec\n\nNew content.";
        const payload = { filename, content: updatedContent };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);

        // Verify file was updated
        const file = Bun.file(path.join(TEST_SPECS_DIR, filename));
        expect(await file.text()).toBe(updatedContent);
    });

    test("returns 400 for missing filename", async () => {
        const payload = { content: "Some content" };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for missing content", async () => {
        const payload = { filename: "test-missing-content.md" };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);

        expect(response.status).toBe(400);
    });

    test("returns 400 for invalid filename format", async () => {
        const payload = {
            filename: "invalid-no-extension",
            content: "Some content",
        };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);

        expect(response.status).toBe(400);
    });

    test("rejects path traversal in filename", async () => {
        const payload = {
            filename: "../../../etc/passwd.md",
            content: "malicious content",
        };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);

        expect(response.status).toBe(400);
    });

    test("accepts valid filename with hyphens and underscores", async () => {
        const payload = {
            filename: "test-valid_spec-name.md",
            content: "Valid content",
        };
        const req = createMockRequest("http://localhost/api/specs", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        });
        const response = await postSpec(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
    });
});

describe("DELETE /api/specs/:filename - deleteSpec", () => {
    test("deletes existing spec file", async () => {
        const filename = "test-delete-spec.md";
        const filePath = path.join(TEST_SPECS_DIR, filename);
        await Bun.write(filePath, "Content to delete");

        const req = createMockRequest(`http://localhost/api/specs/${filename}`, {
            method: "DELETE",
            params: { filename },
        });
        const response = await deleteSpec(req);

        expect(response.status).toBe(204);

        // Verify file was deleted
        const file = Bun.file(filePath);
        expect(await file.exists()).toBe(false);
    });

    test("returns 404 for non-existent file", async () => {
        const req = createMockRequest("http://localhost/api/specs/test-nonexistent-delete.md", {
            method: "DELETE",
            params: { filename: "test-nonexistent-delete.md" },
        });
        const response = await deleteSpec(req);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.success).toBe(false);
    });

    test("returns 400 for invalid filename format", async () => {
        const req = createMockRequest("http://localhost/api/specs/invalid", {
            method: "DELETE",
            params: { filename: "invalid" },
        });
        const response = await deleteSpec(req);

        expect(response.status).toBe(400);
    });

    test("rejects path traversal attempts", async () => {
        const req = createMockRequest("http://localhost/api/specs/../secret.md", {
            method: "DELETE",
            params: { filename: "../secret.md" },
        });
        const response = await deleteSpec(req);

        expect(response.status).toBe(400);
    });
});

describe("Security - Path Traversal Prevention", () => {
    test("filename schema rejects double dots", async () => {
        const maliciousFilenames = [
            "../secret.md",
            "..\\secret.md",
            "foo/../bar.md",
            "....//secret.md",
        ];

        for (const filename of maliciousFilenames) {
            const req = createMockRequest(`http://localhost/api/specs/${filename}`, {
                params: { filename },
            });
            const response = await getSpecByName(req);
            expect(response.status).toBe(400);
        }
    });

    test("filename schema rejects absolute paths", async () => {
        const maliciousFilenames = [
            "/etc/passwd.md",
            "C:\\Windows\\secret.md",
        ];

        for (const filename of maliciousFilenames) {
            const req = createMockRequest(`http://localhost/api/specs/${filename}`, {
                params: { filename },
            });
            const response = await getSpecByName(req);
            expect(response.status).toBe(400);
        }
    });

    test("filename schema rejects special characters", async () => {
        const invalidFilenames = [
            "file with spaces.md",
            "file@special.md",
            "file#hash.md",
            "file$dollar.md",
            "file%percent.md",
        ];

        for (const filename of invalidFilenames) {
            const req = createMockRequest(`http://localhost/api/specs/${filename}`, {
                params: { filename },
            });
            const response = await getSpecByName(req);
            expect(response.status).toBe(400);
        }
    });
});
