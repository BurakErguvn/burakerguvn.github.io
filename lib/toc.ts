import GithubSlugger from "github-slugger";

export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

/**
 * Extract H2/H3 headings from raw markdown and produce slugs that match
 * rehype-slug (which uses github-slugger under the hood).
 */
export function buildToc(raw: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = raw.split("\n");
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/`/g, "").trim();
    items.push({ level, text, slug: slugger.slug(text) });
  }
  return items;
}
