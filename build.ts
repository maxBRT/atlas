import { build } from "bun";
import { cp, rm, readFile, writeFile, readdir } from "node:fs/promises";

// 1. Clean the output folder
await rm("./dist", { recursive: true, force: true });

// 2. Build the React Bundle
const result = await build({
    entrypoints: ["./src/client/main.tsx"],
    outdir: "./dist/public",
    naming: "[name]-[hash].[ext]",
    minify: true,
});

if (!result.success) {
    console.error("Build failed:", result.logs);
    process.exit(1);
}

// 3. Copy index.html from 'public' to 'dist/public'
await cp("./public/index.html", "./dist/public/index.html");

// 4. Update index.html to reference the built files
const files = await readdir("./dist/public");
const jsFile = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

const htmlPath = "./dist/public/index.html";
let html = await readFile(htmlPath, "utf-8");

// Replace bundle.js reference with actual JS filename
if (jsFile) {
    html = html.replace('./bundle.js', `./${jsFile}`);
}

// Add CSS link if CSS was output
if (cssFile) {
    html = html.replace('</head>', `    <link rel="stylesheet" href="./${cssFile}">\n</head>`);
}

await writeFile(htmlPath, html);

console.log("✅ Build complete! Assets ready in ./dist/public");
