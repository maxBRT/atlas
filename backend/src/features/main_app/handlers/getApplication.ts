import { json } from "../../../utils/json";
import { getApplicationFile } from "../services/getApplicationFile";

export const getApplication = async (req: Request) => {
    try {
        const fileContent = await getApplicationFile();

        if (fileContent === null) {
            return json({ error: "File not found" }, 404);
        }

        return json({ content: fileContent });
    } catch (error) {
        console.error("Error reading application file:", error);
        return json({ error: "Internal Server Error" }, 500);
    }
};
