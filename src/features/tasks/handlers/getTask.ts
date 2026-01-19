import { taskIdParamsSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import type { Task } from "@/types/task";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateParams } from "@/utils/validation";
import { extractMetadata } from "@/features/tasks/utils/frontmatterUtils";
import path from "path";

export const getTask = async (req: Request) => {
    try {
        const result = await validateParams(taskIdParamsSchema, req);
        if ('error' in result) return result.error;
        const { id } = result.data;

        const filePath = id + ".md";
        const task = Bun.file(path.join(getAtlasPath(), "tasks", filePath));
        if (!(await task.exists())) return json<ApiResponse<null>>({ success: false, message: "Task not found" }, 404);

        const extracted = extractMetadata(await task.text());
        if (!extracted) return json<ApiResponse<null>>({ success: false, message: "Task not found" }, 404);

        const { metadata, taskContent } = extracted;


        return json<ApiResponse<Task>>({
            success: true,
            message: "Tasks retrieved successfully",
            data: {
                metadata,
                content: taskContent
            }
        });

    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error retrieving tasks"
        });
    }

}
