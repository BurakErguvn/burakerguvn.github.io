"use client";

import { useOs } from "./WindowManager";
import { CvIcon, FinderIcon, TextEditIcon } from "./icons";

export function Dock() {
  const { windows, restore } = useOs();
  const minimized = windows.filter((w) => w.minimized);
  if (minimized.length === 0) return null;

  return (
    <nav className="os-dock" aria-label="Dock">
      {minimized.map((w) => (
        <button
          key={w.id}
          type="button"
          className="os-dock__item os-dock__item--min"
          title={w.title}
          onClick={() => restore(w.id)}
        >
          {w.appId === "cv" ? (
            <CvIcon className="os-dock__icon" />
          ) : w.appId === "textedit" ? (
            <TextEditIcon className="os-dock__icon" />
          ) : (
            <FinderIcon className="os-dock__icon" />
          )}
        </button>
      ))}
    </nav>
  );
}
