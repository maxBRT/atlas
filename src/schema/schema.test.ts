import { test, expect, describe } from "bun:test";
import { createApplicationSchema } from "./schema";

describe("createApplicationSchema", () => {
    test("accepts valid payload with content string", () => {
        const payload = { content: "# My Application\n\nThis is the content." };
        const result = createApplicationSchema.safeParse(payload);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.content).toBe(payload.content);
        }
    });

    test("accepts empty string content", () => {
        const payload = { content: "" };
        const result = createApplicationSchema.safeParse(payload);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.content).toBe("");
        }
    });

    test("rejects payload with missing content field", () => {
        const payload = {};
        const result = createApplicationSchema.safeParse(payload);

        expect(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map(i => i.path.join("."));
            expect(paths).toContain("content");
        }
    });

    test("rejects payload with non-string content", () => {
        const payload = { content: 123 };
        const result = createApplicationSchema.safeParse(payload);

        expect(result.success).toBe(false);
    });

    test("rejects payload with null content", () => {
        const payload = { content: null };
        const result = createApplicationSchema.safeParse(payload);

        expect(result.success).toBe(false);
    });

    test("strips extra fields from payload", () => {
        const payload = { content: "test", extraField: "should be stripped" };
        const result = createApplicationSchema.safeParse(payload);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).not.toHaveProperty("extraField");
        }
    });
});
