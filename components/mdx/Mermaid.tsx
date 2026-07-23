"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";

let counter = 0;

export function Mermaid({ children }: { children?: React.ReactNode }) {
  const code = String(children ?? "").trim();
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  if (error) {
    return (
      <pre className="mermaid-error" aria-label="Mermaid diagram error">
        {code}
      </pre>
    );
  }

  return (
    <div
      className="mermaid-wrap"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="Diagram"
    />
  );
}
