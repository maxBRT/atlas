import path from 'path';

export function getAtlasPath(): string {
    const atlas = path.join(process.cwd(), ".atlas")
    return atlas
}

