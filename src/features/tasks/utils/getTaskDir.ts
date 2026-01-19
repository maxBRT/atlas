import { getAtlasPath } from "@/utils/getAtlasPath";
import { Dirent, existsSync } from "node:fs";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

export function getTasksDir(): Promise<Dirent<string>[]> {
    const tasksDir = path.join(getAtlasPath(), "tasks");

    if (!existsSync(tasksDir)) {
        mkdir(tasksDir, { recursive: true });
    }

    return readdir(path.join(getAtlasPath(), "tasks"), { withFileTypes: true });
}
