import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const repoRoot = resolve(".");
const reviewsPath = resolve(repoRoot, "src/lib/reviews.ts");
const configPath = resolve(repoRoot, "public/admin/config.yml");

const reviewsSource = await readFile(reviewsPath, "utf8");
const configSource = await readFile(configPath, "utf8");

const listMatch = reviewsSource.match(
  /export const REVIEW_MEDIA = \[([\s\S]*?)\] as const;/
);

if (!listMatch) {
  throw new Error("Could not find REVIEW_MEDIA list in src/lib/reviews.ts");
}

const media = Array.from(listMatch[1].matchAll(/"([^"]+)"/g)).map(
  (match) => match[1]
);

if (!media.length) {
  throw new Error("REVIEW_MEDIA list is empty.");
}

const lines = configSource.split(/\r?\n/);
let inMediumBlock = false;
let updated = false;

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (line.includes('name: "medium"')) {
    inMediumBlock = true;
    continue;
  }

  if (inMediumBlock && line.trimStart().startsWith("options:")) {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const options = media.map((value) => `"${value}"`).join(", ");
    lines[i] = `${indent}options: [${options}]`;
    updated = true;
    inMediumBlock = false;
  }
}

if (!updated) {
  throw new Error('Could not update the "medium" options list in config.yml');
}

const nextConfig = lines.join("\n");
if (nextConfig !== configSource) {
  await writeFile(configPath, nextConfig, "utf8");
}

console.log(`Synced Decap medium options (${media.length}).`);
