import { createTaskSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateBody } from "@/utils/validation";
import { generateMetadata } from "@/features/tasks/utils/frontmatterUtils";
import path from "path";

export const postTask = async (req: Request) => {
    const result = await validateBody(createTaskSchema, req);
    if ('error' in result) return result.error;
    const { metadata, content } = result.data;

    try {
        const filePath = path.join(getAtlasPath(), "tasks", `${metadata.id}.md`);
        await Bun.write(filePath, generateMetadata(metadata) + content);
        const response: ApiResponse<string> = {
            success: true,
            message: "Task created successfully",
            data: content,
        };
        return json(response);
    } catch (e) {
        console.error(e);
        return json({ message: "Error creating task", success: false }, 500);
    }
}
