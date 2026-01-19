import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { readdir } from "node:fs/promises";

export const getDocuments = async (req: Request) => {
    try {
        const atlasPath = getAtlasPath();
        const entries = await readdir(atlasPath, { withFileTypes: true });

        // Filter to only include files (not directories) with .md extension
        const files = entries
            .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
            .map(entry => entry.name);

        return json<ApiResponse<string[]>>({
            success: true,
            message: "Documents retrieved successfully",
            data: files
        });
    } catch (e) {
        console.log(e);
        return json<ApiResponse<null>>({
            success: false,
            message: "Error retrieving documents"
        }, 500);
    }
};
