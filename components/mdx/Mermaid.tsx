"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import mermaid from "mermaid";

let counter = 0;

export function Mermaid({ children }: { children?: React.ReactNode }) {
  const code = String(children ?? "").trim();
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

  return (
    <>
      <div
        className="mermaid-wrap mermaid-wrap--zoomable"
        dangerouslySetInnerHTML={{ __html: svg }}
        role="button"
        tabIndex={0}
        aria-label="Diyagramı büyüt"
        onClick={openZoom}
        onKeyDown={onKeyActivate}
      />
      {open && svg
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
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <div className="lightbox__hint">ESC · kapat</div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
