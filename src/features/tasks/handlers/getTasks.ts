import type { ApiResponse } from "@/types/apiContract";
import { json } from "@/utils/json";
import { getTasksDir } from "../utils/getTaskDir";

export const getTasks = async (req: Request) => {
    try {
        const tasks = await getTasksDir();
        return json<ApiResponse<string[]>>({
            success: true,
            message: "Tasks retrieved successfully",
            data: tasks.map(task => task.name)
        });
    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error retrieving tasks"
        });
    }

}
