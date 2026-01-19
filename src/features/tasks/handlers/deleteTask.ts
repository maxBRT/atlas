import { taskIdParamsSchema } from "@/schema/schema";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateParams } from "@/utils/validation";
import path from "path";

export const deleteTask = async (req: Request) => {
    const result = await validateParams(taskIdParamsSchema, req);
    console.log(result);
    if ("error" in result) return result.error;
    const { id } = result.data;

    try {
        const task = Bun.file(path.join(getAtlasPath(), "tasks", `${id}.md`));
        if (!task) return json({ error: "Task not found" }, 404);

        await task.delete();
        return json({ message: "Task deleted" }, 204);
    } catch (e) {
        console.error(e);
        return json({ error: "Error deleting task" }, 500);
    }

}
