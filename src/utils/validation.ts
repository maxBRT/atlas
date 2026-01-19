/**
 * Validation utilities for API endpoints using Zod schemas.
 *
 * These helpers validate incoming request data and return either:
 * - { data: T } on success, with the validated and typed data
 * - { error: Response } on failure, with a 400 Bad Request response
 *
 * Usage in endpoint handlers:
 * ```ts
 * const validated = await validateBody(mySchema, req);
 * if ('error' in validated) return validated.error;
 * // validated.data is now typed according to the schema
 * ```
 */
import { z, ZodError, ZodType } from "zod";

interface ValidationError {
    success: boolean;
    message: string;
    details: {
        path: string;
        message: string;
    }[];
};

function formatValidationError(error: ZodError): ValidationError {
    return {
        success: false,
        message: error.message,
        details: error.issues.map(e => ({
            path: e.path.join("."),
            message: e.message,
        })),
    };
}

function validationErrorResponse(error: ZodError): Response {
    return new Response(JSON.stringify(formatValidationError(error)), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Validates a JSON request body against a Zod schema.
 * Returns validated data on success, or a 400 error Response on failure.
 */
export const validateBody = async <T extends ZodType>(schema: T, req: Request): Promise<{ error: Response } | { data: z.infer<T> }> => {
    try {
        const body = await req.json();
        const result = schema.safeParse(body);
        if (!result.success) {
            return { error: validationErrorResponse(result.error) };
        }
        return { data: result.data };
    } catch (error: any) {
        if (error instanceof ZodError) {
            return { error: validationErrorResponse(error) };
        }
        return { error: new Response("Internal server error", { status: 500 }) };
    };
}

/**
 * Validates URL query parameters against a Zod schema.
 * Returns validated data on success, or a 400 error Response on failure.
 */
export const validateQuery = async <T extends ZodType>(schema: T, req: Request): Promise<{ error: Response } | { data: z.infer<T> }> => {
    try {
        const url = new URL(req.url);
        const result = schema.safeParse(Object.fromEntries(url.searchParams));
        if (!result.success) {
            return { error: validationErrorResponse(result.error) };
        }
        return { data: result.data };
    } catch (error: any) {
        if (error instanceof ZodError) {
            return { error: validationErrorResponse(error) };
        }
        return { error: new Response("Internal server error", { status: 500 }) };
    };
}

/**
 * Validates URL route params (e.g., /users/:id) against a Zod schema.
 * Returns validated data on success, or a 400 error Response on failure.
 */
export const validateParams = async <T extends ZodType>(schema: T, req: Request): Promise<{ error: Response } | { data: z.infer<T> }> => {
    try {
        const params = (req as any).params;
        const result = schema.safeParse(params);
        if (!result.success) {
            return { error: validationErrorResponse(result.error) };
        }
        return { data: result.data };
    } catch (error: any) {
        if (error instanceof ZodError) {
            return { error: validationErrorResponse(error) };
        }
        return { error: new Response("Internal server error", { status: 500 }) };
    };
}
