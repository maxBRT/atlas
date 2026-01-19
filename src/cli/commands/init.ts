import fs from "node:fs";
import path from "node:path";

export const initCommand = () => {
    const atlasDir = path.join(process.cwd(), ".atlas");

    if (fs.existsSync(atlasDir)) {
        console.error("Error: `.atlas` directory already exists. Initialization aborted.");
        process.exit(1);
    }

    try {
        // Create directories
        fs.mkdirSync(atlasDir);
        fs.mkdirSync(path.join(atlasDir, "specs"));
        fs.mkdirSync(path.join(atlasDir, "tasks"));

        // Get templates path, being careful about how the cli is executed
        const templatesPath = path.resolve(__dirname, '..', 'templates');

        // Create application.md
        const appTemplatePath = path.join(templatesPath, "application.md.template");
        const appTemplateContent = fs.readFileSync(appTemplatePath, "utf-8");
        fs.writeFileSync(path.join(atlasDir, "application.md"), appTemplateContent);

        // Create context.md
        const contextTemplatePath = path.join(templatesPath, "context.md.template");
        const contextTemplateContent = fs.readFileSync(contextTemplatePath, "utf-8");
        fs.writeFileSync(path.join(atlasDir, "context.md"), contextTemplateContent);

        console.log("✨ Atlas initialized successfully!");
    } catch (error) {
        console.error("Error initializing Atlas project:", error);
        process.exit(1);
    }
};
