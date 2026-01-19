import { fileNameParamsSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateParams } from "@/utils/validation";
import path from "path";

interface DocumentData {
    filename: string;
    content: string;
}

export const getDocument = async (req: Request) => {
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

        // Read and return the file content
        const content = await file.text();
        return json<ApiResponse<DocumentData>>({
            success: true,
            message: "Document retrieved successfully",
            data: { filename, content }
        });
    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error retrieving document"
        }, 500);
    }
};
