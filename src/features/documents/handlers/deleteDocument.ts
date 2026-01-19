import { fileNameParamsSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateParams } from "@/utils/validation";
import { rm } from "node:fs/promises";
import path from "path";

export const deleteDocument = async (req: Request) => {
    try {
        // Validate the filename parameter
        const validated = await validateParams(fileNameParamsSchema, req);
        if ('error' in validated) {
            return validated.error;
        }
        const { filename } = validated.data;

        // Build the file path
        const filePath = path.join(getAtlasPath(), filename);
        const file = Bun.file(filePath);

        // Check if file exists
        if (!(await file.exists())) {
            return json<ApiResponse<null>>({
                success: false,
                message: `Document '${filename}' not found`
            }, 404);
        }

        // Delete the file
        await rm(filePath);

        return new Response(null, { status: 204 });
    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error deleting document"
        }, 500);
    }
};
