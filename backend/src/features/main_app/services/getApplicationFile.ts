import path from "path";

export const getApplicationFile = async () => {
    const filePath = path.join(process.cwd(), ".atlas", "application.md");
    const file = Bun.file(filePath);

    if (!(await file.exists())) {
        return null;
    }

    return file.text();
}
