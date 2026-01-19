import { z } from "zod";

export const createApplicationSchema = z.object({
    content: z.string(),
});

export type CreateApplication = z.infer<typeof createApplicationSchema>;
