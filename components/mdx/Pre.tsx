"use client";

import { useRef, useState } from "react";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type PreProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;

export function Pre({ children, ...rest }: PreProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.querySelector("code")?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const child: ReactNode = children;
  void rest;

  return (
    <pre ref={ref}>
      <button
        type="button"
        className="code-copy"
        onClick={copy}
        aria-label={copied ? "Kopyalandı" : "Kodu kopyala"}
      >
        {copied ? "kopyalandı" : "kopyala"}
      </button>
      {child}
    </pre>
  );
}
