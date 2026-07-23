"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

export function Toc({ items, title }: { items: TocItem[]; title: string }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((i) => i.slug);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label={title}>
      <p className="toc__title">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.slug} className={item.level === 3 ? "toc__sub" : undefined}>
            <a
              href={`#${item.slug}`}
              className={active === item.slug ? "active" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
