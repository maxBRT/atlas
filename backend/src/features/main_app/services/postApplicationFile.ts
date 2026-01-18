import path from "path";

export const postApplicationFile = async (content: string): Promise<boolean> => {
    try {
        const filePath = path.join(process.cwd(), ".atlas", "application.md");
        await Bun.write(filePath, content);
        return true;
    } catch (error) {
        console.error("Error writing to application.md:", error);
        return false;
    }
};
