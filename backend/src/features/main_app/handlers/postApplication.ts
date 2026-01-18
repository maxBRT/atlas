import { json } from "../../../utils/json";
import { postApplicationFile } from "../services/postApplicationFile";

export const postApplication = async (req: Request) => {
    try {
        const body = await req.json();
        const content = body.content;

        if (typeof content !== 'string') {
            return json({ error: "Invalid 'content' field in request body" }, 400);
        }

        const success = await postApplicationFile(content);

        if (success) {
            return json({ message: "File updated successfully" }, 200);
        } else {
            return json({ error: "Internal Server Error" }, 500);
        }
    } catch (error) {
        return json({ error: "Invalid JSON in request body" }, 400);
    }
};
