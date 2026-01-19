import { validateBody, validateParams } from "@/utils/validation";
import { createTaskSchema, taskIdParamsSchema } from "@/schema/schema";
import { getTasksDir } from "../utils/getTaskDir";
import { json } from "@/utils/json";
import type { ApiResponse } from "@/types/apiContract";
import { generateMetadata } from "../utils/frontmatterUtils";
import { getAtlasPath } from "@/utils/getAtlasPath";
import path from "path";
import type { Task } from "@/types/task";


export const putTask = async (req: Request) => {
    const resultParams = await validateParams(taskIdParamsSchema, req);
    if ('error' in resultParams) return resultParams.error;
    const { id } = resultParams.data;

    const resultBody = await validateBody(createTaskSchema, req);
    if ('error' in resultBody) return resultBody.error;
    const { metadata, content } = resultBody.data;

    try {
        const tasks = await getTasksDir();
        const file = tasks.find(task => task.name === id + ".md");
        if (!file) return json<ApiResponse<null>>({ success: false, message: "Task not found" }, 404);

        Bun.write(path.join(getAtlasPath(), "tasks", id + ".md"), generateMetadata(metadata) + content);
        return json<ApiResponse<Task>>({
            success: true,
            message: "Task updated successfully",
            data: {
                metadata,
                content
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
