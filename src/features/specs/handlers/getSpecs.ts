import type { ApiResponse } from "@/types/apiContract";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { readdir } from "node:fs/promises";
import path from "node:path";

export const getSpecs = async (req: Request) => {
    try {
        const specs = await readdir(path.join(getAtlasPath(), "specs"), { withFileTypes: true });
        const response: ApiResponse<string[]> = {
            success: true,
            message: "Specs retrieved successfully",
            data: specs.map(spec => spec.name),
        };
        return json(response);
    } catch (e) {
        console.log(e);
        const response: ApiResponse<string[]> = {
            success: false,
            message: "Error retrieving specs",
            data: [],
        };
        return json(response, 500);
    }
}
