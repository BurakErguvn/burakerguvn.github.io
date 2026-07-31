import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Static export burns root layout's lang="tr" into every HTML file.
 * Patch English pages so crawlers see lang="en" without waiting for client JS.
 */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const enDir = path.join(process.cwd(), "out", "en");
const files = await walk(enDir);
let patched = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  if (!html.includes('lang="tr"')) continue;
  const next = html.replace(/<html([^>]*)\slang="tr"/, '<html$1 lang="en"');
  if (next !== html) {
    await writeFile(file, next);
    patched += 1;
  }
}

console.log(`patch-locale-lang: updated lang=en on ${patched}/${files.length} English HTML files`);
