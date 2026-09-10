"use client";

import { useState } from "react";
import type { Collection } from "@/lib/content";
import { dict } from "@/lib/i18n";
import { useOs } from "./WindowManager";
import { CvIcon, FinderIcon, ZipIcon } from "./icons";

export function Desktop() {
  const { locale, openFinder, openCv } = useOs();
  const t = dict[locale];
  const [selected, setSelected] = useState<string | null>(null);

  const icons: {
    id: string;
    label: string;
    onOpen: () => void;
    kind: "finder" | "zip" | "cv";
    collection?: Collection;
  }[] = [
    {
      id: "finder",
      label: t.finder,
      onOpen: () => openFinder("desktop"),
      kind: "finder",
    },
    {
      id: "zip-posts",
      label: `${t.zipWriting}.zip`,
      onOpen: () => openFinder("posts"),
      kind: "zip",
      collection: "posts",
    },
    {
      id: "zip-research",
      label: `${t.zipResearch}.zip`,
      onOpen: () => openFinder("research"),
      kind: "zip",
      collection: "research",
    },
    {
      id: "zip-notes",
      label: `${t.zipNotes}.zip`,
      onOpen: () => openFinder("notes"),
      kind: "zip",
      collection: "notes",
    },
    {
      id: "cv",
      label: t.about,
      onOpen: openCv,
      kind: "cv",
    },
  ];

  return (
    <div className="os-desktop" onClick={() => setSelected(null)}>
      <div className="os-desktop__icons">
        {icons.map((icon) => (
          <button
            key={icon.id}
            type="button"
            className={`os-icon${selected === icon.id ? " is-selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(icon.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              icon.onOpen();
            }}
          >
            {icon.kind === "zip" ? (
              <ZipIcon className="os-icon__img" />
            ) : icon.kind === "finder" ? (
              <FinderIcon className="os-icon__img" />
            ) : (
              <CvIcon className="os-icon__img" />
            )}
            <span className="os-icon__label">{icon.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
