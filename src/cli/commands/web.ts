import { spawn } from "child_process";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

export const webCommand = () => {
    // Resolve server path relative to where the CLI is installed, not the user's cwd
    const cliDir = import.meta.dir;
    const serverPath = path.resolve(cliDir, "../../server.ts");
    const userCwd = process.cwd();

    // Check if .atlas directory exists in the user's current directory
    const atlasPath = path.join(userCwd, ".atlas");
    if (!existsSync(atlasPath) || !statSync(atlasPath).isDirectory()) {
        console.error("Error: No .atlas directory found in the current directory.");
        console.error("Run 'atlas init' to initialize a new Atlas project, or navigate to a directory with an existing .atlas folder.");
        process.exit(1);
    }

    console.log("Starting web server...");

    const subprocess = spawn("bun", [serverPath], {
        detached: true,
        stdio: "ignore",
        cwd: userCwd, // Run the server with the user's working directory
    });

    subprocess.unref();

    console.log("Web server started successfully. You can now close this terminal.");
    console.log("You can access the UI at http://localhost:5107");
    process.exit(0);
};
