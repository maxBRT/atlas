import { createFileSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateBody } from "@/utils/validation";
import path from "node:path";

export const postSpec = async (req: Request) => {
    const result = await validateBody(createFileSchema, req);
    if ('error' in result) return result.error;
    const { filename, content } = result.data;

    try {
        const filePath = path.join(getAtlasPath(), "specs", filename);
        await Bun.write(filePath, content);
        const response: ApiResponse<string> = {
            success: true,
            message: "Spec created successfully",
            data: content,
        };
        return json(response);
    } catch (e) {
        console.error(e);
        return json({ message: "Error creating spec", success: false }, 500);
    }
}

