import { z } from "zod";

export const createApplicationSchema = z.object({
    content: z.string(),
});

export type CreateApplication = z.infer<typeof createApplicationSchema>;


export const fileNameSchema = z.string().regex(/^[a-zA-Z0-9-_]+\.md$/);

export type FileName = z.infer<typeof fileNameSchema>;

export const fileNameParamsSchema = z.object({
    filename: fileNameSchema,
});

export type FileNameParams = z.infer<typeof fileNameParamsSchema>;

export const createFileSchema = z.object({
    filename: fileNameSchema,
    content: z.string(),
});

export type CreateFile = z.infer<typeof createFileSchema>;

