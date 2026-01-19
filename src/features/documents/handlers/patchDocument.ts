import { documentRenameSchema, fileNameParamsSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateBody, validateParams } from "@/utils/validation";
import { rename } from "node:fs/promises";
import path from "path";

interface RenameData {
    oldFilename: string;
    newFilename: string;
}

export const patchDocument = async (req: Request) => {
    try {
        // Validate the filename parameter (old filename)
        const validatedParams = await validateParams(fileNameParamsSchema, req);
        if ('error' in validatedParams) {
            return validatedParams.error;
        }
        const { filename: oldFilename } = validatedParams.data;

        // Validate the request body (new filename)
        const validatedBody = await validateBody(documentRenameSchema, req);
        if ('error' in validatedBody) {
            return validatedBody.error;
        }
        const { newFilename } = validatedBody.data;

        const atlasPath = getAtlasPath();
        const oldPath = path.join(atlasPath, oldFilename);
        const newPath = path.join(atlasPath, newFilename);

        // Check if source file exists
        const oldFile = Bun.file(oldPath);
        if (!(await oldFile.exists())) {
            return json<ApiResponse<null>>({
                success: false,
                message: `Document '${oldFilename}' not found`
            }, 404);
        }

        // Check if destination file already exists
        const newFile = Bun.file(newPath);
        if (await newFile.exists()) {
            return json<ApiResponse<null>>({
                success: false,
                message: `Document '${newFilename}' already exists`
            }, 409);
        }

        // Rename the file
        await rename(oldPath, newPath);

        return json<ApiResponse<RenameData>>({
            success: true,
            message: "Document renamed successfully",
            data: { oldFilename, newFilename }
        });
    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error renaming document"
        }, 500);
    }
};
