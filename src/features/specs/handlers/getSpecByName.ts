import { fileNameParamsSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateParams } from "@/utils/validation";
import path from "node:path";


export const getSpecByName = async (req: Request) => {
    const result = await validateParams(fileNameParamsSchema, req);
    if ('error' in result) return result.error;
    const { filename } = result.data;

    try {
        const file = Bun.file(path.join(getAtlasPath(), "specs", filename));
        if (!(await file.exists())) return json({ message: "Spec not found", success: false }, 404);
        const fileContent = await file.text();
        const response: ApiResponse<string> = {
            success: true,
            message: "Spec retrieved successfully",
            data: fileContent,
        };
        return json(response);
    } catch (e) {
        console.error(e);
        return json({ message: "Error retrieving spec", success: false }, 500);
    }
}
