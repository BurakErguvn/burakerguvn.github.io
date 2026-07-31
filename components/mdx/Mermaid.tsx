"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import mermaid from "mermaid";

let counter = 0;

type SvgSize = {
  width: string | null;
  height: string | null;
  style: string | null;
};

export function Mermaid({ children }: { children?: React.ReactNode }) {
  const code = String(children ?? "").trim();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const inlineRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const sizeRef = useRef<SvgSize | null>(null);

  const restoreInline = useCallback(() => {
    const el = svgRef.current;
    const inline = inlineRef.current;
    const saved = sizeRef.current;
    if (el && saved) {
      if (saved.width == null) el.removeAttribute("width");
      else el.setAttribute("width", saved.width);
      if (saved.height == null) el.removeAttribute("height");
      else el.setAttribute("height", saved.height);
      if (saved.style == null || saved.style === "") el.removeAttribute("style");
      else el.setAttribute("style", saved.style);
    }
    if (el && inline && el.parentElement !== inline) {
      inline.appendChild(el);
    }
    if (inline) inline.style.minHeight = "";
  }, []);

  const hostRef = useCallback(
    (node: HTMLDivElement | null) => {
      const el = svgRef.current;
      if (node && el) {
        if (!sizeRef.current) {
          sizeRef.current = {
            width: el.getAttribute("width"),
            height: el.getAttribute("height"),
            style: el.getAttribute("style"),
          };
        }
        // Mermaid often uses width="100%"; that collapses inside an auto-sized host.
        const vb = el.viewBox.baseVal;
        if (vb.width > 0 && vb.height > 0) {
          el.setAttribute("width", String(vb.width));
          el.setAttribute("height", String(vb.height));
        }
        el.style.width = "auto";
        el.style.height = "auto";
        el.style.maxWidth = "min(1100px, 90vw)";
        el.style.maxHeight = "80vh";
        node.appendChild(el);
      } else {
        restoreInline();
      }
    },
    [restoreInline]
  );

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
          if (cancelled) return;
          const shell = document.createElement("div");
          shell.innerHTML = svg;
          const el = shell.querySelector("svg");
          if (!el || !inlineRef.current) {
            setError("Mermaid SVG missing");
            return;
          }
          svgRef.current = el;
          sizeRef.current = null;
          inlineRef.current.replaceChildren(el);
          setReady(true);
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(String(err));
        });
    } catch (err) {
      if (!cancelled) setError(String(err));
    }

    return () => {
      cancelled = true;
      svgRef.current = null;
      sizeRef.current = null;
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

  const openZoom = () => {
    if (!ready || !svgRef.current || !inlineRef.current) return;
    inlineRef.current.style.minHeight = `${inlineRef.current.offsetHeight}px`;
    setOpen(true);
  };

  const onKeyActivate = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openZoom();
    }
  };

  if (error) {
    return (
      <pre className="mermaid-error" aria-label="Mermaid diagram error">
        {code}
      </pre>
    );
  }

  return (
    <>
      <div
        ref={inlineRef}
        className="mermaid-wrap mermaid-wrap--zoomable"
        role="button"
        tabIndex={0}
        aria-label="Diyagramı büyüt"
        aria-expanded={open}
        onClick={openZoom}
        onKeyDown={onKeyActivate}
      />
      {open
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="lightbox__diagram-inner" ref={hostRef} />
              </div>
              <div className="lightbox__hint">ESC · kapat</div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
