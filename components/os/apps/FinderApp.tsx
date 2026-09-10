"use client";

import { useState } from "react";
import { formatDate } from "@/lib/content-meta";
import { dict } from "@/lib/i18n";
import type { FinderPlace } from "@/lib/os/types";
import { CvIcon, FinderIcon, FolderIcon, MdxIcon, TagDot, ZipIcon } from "../icons";
import { useOs } from "../WindowManager";

function folderName(place: Exclude<FinderPlace, "desktop" | `tag:${string}`>, t: (typeof dict)[keyof typeof dict]) {
  if (place === "posts") return t.zipWriting;
  if (place === "research") return t.zipResearch;
  return t.zipNotes;
}

const TAG_COLORS = [
  "#e5484d",
  "#3b82f6",
  "#30a46c",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export function FinderApp({ place }: { place: FinderPlace }) {
  const { locale, catalog, openArticle, openFinder, openCv } = useOs();
  const t = dict[locale];
  const [selected, setSelected] = useState<string | null>(null);

  const folders: { place: Exclude<FinderPlace, "desktop" | `tag:${string}`>; label: string }[] = [
    { place: "posts", label: folderName("posts", t) },
    { place: "research", label: folderName("research", t) },
    { place: "notes", label: folderName("notes", t) },
  ];

  const allPosts = Object.values(catalog).flat();
  const tagCounts = new Map<string, number>();
  for (const p of allPosts) {
    for (const tag of p.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const isTag = place.startsWith("tag:");
  const activeTag = isTag ? place.slice(4) : null;
  const posts =
    place === "desktop"
      ? []
      : activeTag
        ? allPosts.filter((p) => p.tags.includes(activeTag))
        : catalog[place as "posts" | "research" | "notes"] ?? [];

  const crumb =
    place === "desktop"
      ? t.desktop
      : activeTag
        ? activeTag
        : folderName(place as Exclude<FinderPlace, "desktop" | `tag:${string}`>, t);

  const desktopRows: {
    id: string;
    name: string;
    kind: string;
    date?: string;
    onOpen: () => void;
    icon: "finder" | "zip" | "cv";
  }[] = [
    {
      id: "app-finder",
      name: t.finder,
      kind: t.kindApp,
      onOpen: () => openFinder("desktop"),
      icon: "finder",
    },
    ...folders.map((f) => ({
      id: `zip-${f.place}`,
      name: `${f.label}.zip`,
      kind: t.kindZip,
      onOpen: () => openFinder(f.place),
      icon: "zip" as const,
    })),
    {
      id: "cv",
      name: t.about,
      kind: t.kindDocument,
      onOpen: openCv,
      icon: "cv",
    },
  ];

  return (
    <div className="os-finder">
      <aside className="os-finder__side">
        <div className="os-finder__side-label">{t.favorites}</div>
        <button
          type="button"
          className={`os-finder__side-item${place === "desktop" ? " is-active" : ""}`}
          onClick={() => openFinder("desktop")}
        >
          <FinderIcon className="os-finder__side-icon" />
          {t.desktop}
        </button>
        <div className="os-finder__side-label">{t.locations}</div>
        {folders.map((f) => (
          <button
            key={f.place}
            type="button"
            className={`os-finder__side-item${place === f.place ? " is-active" : ""}`}
            onClick={() => openFinder(f.place)}
          >
            <FolderIcon className="os-finder__side-icon" />
            {f.label}
          </button>
        ))}
        <div className="os-finder__side-label">{t.tagsSection}</div>
        {tags.length === 0 ? (
          <div className="os-finder__side-item is-static">{t.noTags}</div>
        ) : (
          tags.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              className={`os-finder__side-item${activeTag === tag ? " is-active" : ""}`}
              onClick={() => openFinder(`tag:${tag}`)}
            >
              <TagDot className="os-finder__side-icon" color={tagColor(tag)} />
              <span className="os-finder__side-text">{tag}</span>
              <span className="os-finder__side-count">{count}</span>
            </button>
          ))
        )}
      </aside>
      <div className="os-finder__main">
        <div className="os-finder__toolbar">
          <button
            type="button"
            className="os-finder__nav"
            disabled={place === "desktop"}
            onClick={() => openFinder("desktop")}
            aria-label={t.desktop}
          >
            ◂
          </button>
          <span className="os-finder__crumb">{crumb}</span>
        </div>
        <div className="os-finder__list">
        <table className="os-finder__table">
          <thead>
            <tr>
              <th>{t.nameCol}</th>
              <th>{t.dateCol}</th>
              <th>{t.kindCol}</th>
            </tr>
          </thead>
          <tbody>
            {place === "desktop" ? (
              desktopRows.map((row) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  className={selected === row.id ? "is-selected" : undefined}
                  onClick={() => setSelected(row.id)}
                  onDoubleClick={row.onOpen}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") row.onOpen();
                  }}
                >
                  <td>
                    <span className="os-finder__file">
                      {row.icon === "zip" ? (
                        <ZipIcon className="os-finder__file-icon" />
                      ) : row.icon === "cv" ? (
                        <CvIcon className="os-finder__file-icon" />
                      ) : (
                        <FinderIcon className="os-finder__file-icon" />
                      )}
                      <span className="os-finder__file-name">{row.name}</span>
                    </span>
                  </td>
                  <td>{row.date ?? "—"}</td>
                  <td>{row.kind}</td>
                </tr>
              ))
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={3} className="os-finder__empty">
                  {t.emptyFolder}
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr
                  key={p.slug}
                  tabIndex={0}
                  className={selected === p.slug ? "is-selected" : undefined}
                  onClick={() => setSelected(p.slug)}
                  onDoubleClick={() =>
                    openArticle(p.collection, p.slug, `${p.slug}.mdx`)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      openArticle(p.collection, p.slug, `${p.slug}.mdx`);
                    }
                  }}
                >
                  <td>
                    <span className="os-finder__file">
                      <MdxIcon className="os-finder__file-icon" />
                      <span className="os-finder__file-name">{p.slug}.mdx</span>
                    </span>
                  </td>
                  <td>{formatDate(p.date, locale)}</td>
                  <td>{t.kindMdx}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        <p className="os-finder__hint">
          {place === "desktop"
            ? `${desktopRows.length} ${t.items}`
            : `${posts.length} ${t.items}`}
        </p>
      </div>
    </div>
  );
}
