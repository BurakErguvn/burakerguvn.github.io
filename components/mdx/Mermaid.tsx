"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import mermaid from "mermaid";

let counter = 0;

/** Duplicate Mermaid SVGs share internal ids; remap so the lightbox copy renders. */
function uniquifySvgIds(svg: string, prefix: string): string {
  const ids = new Set<string>();
  for (const match of svg.matchAll(/\bid="([^"]+)"/g)) {
    ids.add(match[1]);
  }
  const sorted = [...ids].sort((a, b) => b.length - a.length);
  let out = svg;
  for (const id of sorted) {
    const next = `${prefix}-${id}`;
    out = out
      .replaceAll(`id="${id}"`, `id="${next}"`)
      .replaceAll(`url(#${id})`, `url(#${next})`)
      .replaceAll(`href="#${id}"`, `href="#${next}"`)
      .replaceAll(`xlink:href="#${id}"`, `xlink:href="#${next}"`);
  }
  return out;
}

/** Drop fixed px size so CSS can scale from viewBox. */
function scalableSvg(svg: string): string {
  return svg.replace(/<svg\b([^>]*)>/i, (_full, attrs: string) => {
    const cleaned = attrs
      .replace(/\swidth="[^"]*"/gi, "")
      .replace(/\sheight="[^"]*"/gi, "")
      .replace(/\sstyle="[^"]*"/gi, "");
    return `<svg${cleaned} style="max-width:100%;height:auto">`;
  });
}

export function Mermaid({ children }: { children?: React.ReactNode }) {
  const code = String(children ?? "").trim();
  const reactId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${++counter}`;
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        fontFamily: "var(--font-ibm-plex-mono), monospace",
      });
      mermaid
        .render(id, code)
        .then(({ svg }) => {
          if (!cancelled) setSvg(svg);
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(String(err));
        });
    } catch (err) {
      if (!cancelled) setError(String(err));
    }
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (error) {
    return (
      <pre className="mermaid-error" aria-label="Mermaid diagram error">
        {code}
      </pre>
    );
  }

  const openZoom = () => {
    if (svg) setOpen(true);
  };

  const onKeyActivate = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openZoom();
    }
  };

  const lightboxSvg = open
    ? scalableSvg(uniquifySvgIds(svg, `lb-${reactId}`))
    : "";

  return (
    <>
      <div
        className="mermaid-wrap mermaid-wrap--zoomable"
        dangerouslySetInnerHTML={{ __html: svg }}
        role="button"
        tabIndex={0}
        aria-label="Diyagramı büyüt"
        aria-expanded={open}
        onClick={openZoom}
        onKeyDown={onKeyActivate}
      />
      {open && lightboxSvg
        ? createPortal(
            <div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Büyütülmüş diyagram"
              onClick={() => setOpen(false)}
            >
              <div
                className="lightbox__diagram"
                dangerouslySetInnerHTML={{ __html: lightboxSvg }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="lightbox__hint">ESC · kapat</div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
