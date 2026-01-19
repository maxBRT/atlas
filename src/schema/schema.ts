import { z } from "zod";

const FILE_NAME_REGEX = /^[a-zA-Z0-9-_]+\.md$/;
const TASK_ID_REGEX = /^T-[0-9]+$/;

export const createApplicationSchema = z.object({
    content: z.string(),
});

export type CreateApplication = z.infer<typeof createApplicationSchema>;


export const fileNameSchema = z.string().regex(FILE_NAME_REGEX);

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


export const taskIdSchema = z.string().regex(TASK_ID_REGEX);

export type TaskId = z.infer<typeof taskIdSchema>;

export const taskIdParamsSchema = z.object({
    id: taskIdSchema,
});

export type TaskIdParams = z.infer<typeof taskIdParamsSchema>;

export const TaskMetaSchema = z.object({
    id: taskIdSchema,
    status: z.enum(["todo", "in-progress", "complete"]),
    priority: z.enum(["low", "medium", "high"]),
    parentSpec: z.string().optional(),
});

export type TaskMeta = z.infer<typeof TaskMetaSchema>;

export const createTaskSchema = z.object({
    metadata: TaskMetaSchema,
    content: z.string(),
});

export type CreateTask = z.infer<typeof createTaskSchema>;



