import { test, expect, describe } from "bun:test";
import { z } from "zod";
import { validateBody, validateQuery, validateParams } from "./validation";

const testSchema = z.object({
    name: z.string(),
    age: z.number().min(0),
    email: z.string().email().optional(),
});

describe("validateBody", () => {
    test("returns data for valid payload", async () => {
        const body = { name: "John", age: 25 };
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("data" in result).toBe(true);
        if ("data" in result) {
            expect(result.data).toEqual(body);
        }
    });

    test("returns data for valid payload with optional fields", async () => {
        const body = { name: "Jane", age: 30, email: "jane@example.com" };
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("data" in result).toBe(true);
        if ("data" in result) {
            expect(result.data).toEqual(body);
        }
    });

    test("returns error for missing required field", async () => {
        const body = { name: "John" }; // missing 'age'
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(400);
        }
    });

    test("returns error for invalid field type", async () => {
        const body = { name: "John", age: "not a number" };
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(400);
        }
    });

    test("returns error for invalid email format", async () => {
        const body = { name: "John", age: 25, email: "not-an-email" };
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(400);
        }
    });

    test("returns error for value constraint violation", async () => {
        const body = { name: "John", age: -5 }; // age must be >= 0
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(400);
        }
    });

    test("returns error for invalid JSON", async () => {
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: "not valid json",
        });

        const result = await validateBody(testSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(500);
        }
    });

    test("error response contains structured error details", async () => {
        const body = { name: 123, age: "wrong" }; // both fields have wrong types
        const req = new Request("http://localhost/test", {
            method: "POST",
            body: JSON.stringify(body),
        });

        const result = await validateBody(testSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            const errorBody = await result.error.json();
            expect(errorBody.success).toBe(false);
            expect(Array.isArray(errorBody.details)).toBe(true);
            expect(errorBody.details.length).toBeGreaterThan(0);
            expect(errorBody.details[0]).toHaveProperty("path");
            expect(errorBody.details[0]).toHaveProperty("message");
        }
    });
});

describe("validateQuery", () => {
    const querySchema = z.object({
        page: z.string(),
        limit: z.string(),
    });

    test("returns data for valid query parameters", async () => {
        const req = new Request("http://localhost/test?page=1&limit=10");

        const result = await validateQuery(querySchema, req);

        expect("data" in result).toBe(true);
        if ("data" in result) {
            expect(result.data.page).toBe("1");
            expect(result.data.limit).toBe("10");
        }
    });

    test("returns error for missing query parameter", async () => {
        const req = new Request("http://localhost/test?page=1"); // missing 'limit'

        const result = await validateQuery(querySchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(400);
        }
    });
});

describe("validateParams", () => {
    const paramsSchema = z.object({
        id: z.string(),
    });

    test("returns data for valid params", async () => {
        const req = new Request("http://localhost/test?id=123");

        const result = await validateParams(paramsSchema, req);

        expect("data" in result).toBe(true);
        if ("data" in result) {
            expect(result.data.id).toBe("123");
        }
    });

    test("returns error for missing param", async () => {
        const req = new Request("http://localhost/test");

        const result = await validateParams(paramsSchema, req);

        expect("error" in result).toBe(true);
        if ("error" in result) {
            expect(result.error.status).toBe(400);
        }
    });
});
