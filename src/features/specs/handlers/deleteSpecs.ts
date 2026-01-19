import { fileNameParamsSchema } from "@/schema/schema"
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateParams } from "@/utils/validation"
import path from "path"

export const deleteSpec = async (req: Request) => {
    const result = await validateParams(fileNameParamsSchema, req)
    if ("error" in result) return result.error;

    try {
        const { filename } = result.data
        const file = Bun.file(path.join(getAtlasPath(), "specs", filename))
        if (!(await file.exists())) return json({ success: false, message: "File not found" }, 404)
        await file.delete()
        return json({ success: true, message: "File deleted" }, 204)
    } catch (error) {
        return json({ success: false, message: error }, 500)
    }
}

