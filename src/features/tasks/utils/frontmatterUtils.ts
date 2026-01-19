import yaml from "yaml";

export function extractMetadata(content: string) {
    const metadataRegex = /---\n([\s\S]*?)---/g;

    const match = metadataRegex.exec(content);
    if (!match) return null;
    const metadata = match[1];
    if (!metadata) return null;

    const taskContent = content.slice(match.index + match[0].length);

    const parsedMetadata = yaml.parse(metadata);
    if (typeof parsedMetadata !== "object") return null;

    console.log(parsedMetadata);

    return { metadata: parsedMetadata, taskContent };
}

export function generateMetadata(metadata: Record<string, string>) {
    const metadataString = yaml.stringify(metadata);
    return `---\n${metadataString}---\n`;
}
