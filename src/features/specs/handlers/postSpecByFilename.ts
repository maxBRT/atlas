
import { documentContentSchema, fileNameParamsSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateBody, validateParams } from "@/utils/validation";
import path from "path";

interface SpecData {
    filename: string;
    content: string;
}

export const postSpecByFilename = async (req: Request) => {
    try {
        // Validate the filename parameter
        const validatedParams = await validateParams(fileNameParamsSchema, req);
        if ('error' in validatedParams) {
            return validatedParams.error;
        }
        const { filename } = validatedParams.data;

        // Validate the request body
        const validatedBody = await validateBody(documentContentSchema, req);
        if ('error' in validatedBody) {
            return validatedBody.error;
        }
        const { content } = validatedBody.data;

        // Build the file path and write the file
        const filePath = path.join(getAtlasPath(), "specs", filename);
        await Bun.write(filePath, content);

        return json<ApiResponse<SpecData>>({
            success: true,
            message: "Spec saved successfully",
            data: { filename, content }
        });
    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error saving spec"
        }, 500);
    }
};
