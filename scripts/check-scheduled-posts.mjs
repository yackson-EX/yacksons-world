import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_DIRS = ["src/content/blog", "src/content/reviews"];
const CACHE_PATH = path.join(".cache", "scheduled-posts.json");
const FALLBACK_WINDOW_MS = 24 * 60 * 60 * 1000;

const parseFrontmatterDate = (content) => {
  const match = content.match(/^-{3}\s*([\s\S]*?)\s*-{3}/);
  if (!match) return null;
  const frontmatter = match[1];
  const line = frontmatter
    .split("\n")
    .map((value) => value.trim())
    .find((value) => value.startsWith("pubDate:"));
  if (!line) return null;
  const raw = line.replace("pubDate:", "").trim().replace(/^["']|["']$/g, "");
  if (!raw) return null;

  const hasTime = raw.includes("T");
  const hasZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(raw);
  if (!hasTime) {
    return new Date(`${raw}T07:00:00-05:00`);
  }
  if (!hasZone) {
    return new Date(`${raw}-05:00`);
  }
  return new Date(raw);
};

const readCache = async () => {
  try {
    const data = await fs.readFile(CACHE_PATH, "utf8");
    const parsed = JSON.parse(data);
    return parsed?.lastRunIso ? new Date(parsed.lastRunIso) : null;
  } catch (error) {
    return null;
  }
};

const writeCache = async (now) => {
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await fs.writeFile(
    CACHE_PATH,
    JSON.stringify({ lastRunIso: now.toISOString() }, null, 2),
    "utf8"
  );
};

const collectFiles = async (dir, acc = []) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, acc);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".md")) {
      acc.push(fullPath);
    }
  }
  return acc;
};

const run = async () => {
  const now = new Date();
  const lastRun = (await readCache()) ?? new Date(now.valueOf() - FALLBACK_WINDOW_MS);

  const files = [];
  for (const dir of CONTENT_DIRS) {
    try {
      await collectFiles(dir, files);
    } catch (error) {
      // ignore missing directories
    }
  }

  let shouldBuild = false;
  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    const pubDate = parseFrontmatterDate(content);
    if (!pubDate || Number.isNaN(pubDate.valueOf())) continue;
    if (pubDate.valueOf() > lastRun.valueOf() && pubDate.valueOf() <= now.valueOf()) {
      shouldBuild = true;
      break;
    }
  }

  await writeCache(now);
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    await fs.appendFile(outputPath, `should_build=${shouldBuild}\n`, "utf8");
  } else {
    console.log(`should_build=${shouldBuild}`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
