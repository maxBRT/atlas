import { spawn } from "child_process";
import path from "node:path";

export const webCommand = () => {
    const serverPath = path.resolve(process.cwd(), "src/server.ts");

    console.log("Starting web server...");

    const subprocess = spawn("bun", [serverPath], {
        detached: true,
        stdio: "ignore",
    });

    subprocess.unref();

    console.log("Web server started successfully. You can now close this terminal.");
    console.log("You can access the UI at http://localhost:5107");
    process.exit(0);
};
