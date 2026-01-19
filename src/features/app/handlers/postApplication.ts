import { createApplicationSchema } from "@/schema/schema";
import type { ApiResponse } from "@/types/apiContract";
import type { Application } from "@/types/application";
import { getAtlasPath } from "@/utils/getAtlasPath";
import { json } from "@/utils/json";
import { validateBody } from "@/utils/validation";
import path from "path";

export const postApplication = async (req: Request) => {
    try {
        // Get the request body
        const validated = await validateBody(createApplicationSchema, req)
        if ('error' in validated) {
            return validated.error
        }
        const { content } = validated.data

        // Get the application file
        const filePath = path.join(getAtlasPath(), "application-test.md")
        await Bun.write(filePath, content)

        // Return the response as JSON
        const resp: ApiResponse<Application> = {
            success: true,
            message: "Application content updated successfully",
            data: { content: content }
        }
        return json(resp)
    } catch (e) {
        console.log(e)
        return json({ message: e }, 500)
    }
}
