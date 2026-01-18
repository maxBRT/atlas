import { build } from "bun";
import { cp, rm } from "node:fs/promises";

// 1. Clean the output folder
await rm("./dist", { recursive: true, force: true });

// 2. Build the React Bundle
await build({
    entrypoints: ["./src/client/main.tsx"],
    outdir: "./dist/public",
    naming: "bundle.js",
    minify: true,
});

// 3. Copy index.html from 'public' to 'dist/public'
await cp("./public/index.html", "./dist/public/index.html");

console.log("✅ Build complete! Assets ready in ./dist/public");
