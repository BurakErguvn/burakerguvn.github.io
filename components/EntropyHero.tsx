"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Deterministic pseudo-random in [0,1) so SSR and client match. */
function rand(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface CharStyle {
  dx: number;
  dy: number;
  rot: number;
  delay: number;
}

function plan(chars: string[]): CharStyle[] {
  return chars.map((_, i) => {
    const r1 = rand(i * 2 + 1);
    const r2 = rand(i * 2 + 2);
    const r3 = rand(i * 2 + 3);
    return {
      dx: (r1 - 0.5) * 18,
      dy: (r2 - 0.5) * 14,
      rot: (r3 - 0.5) * 24,
      delay: i * 22,
    };
  });
}

export function EntropyHero({
  title,
  accent,
  dek,
}: {
  title: string;
  accent?: string;
  dek?: string;
}) {
  const [resolved, setResolved] = useState(false);
  const chars = Array.from(title);
  const plan_ = plan(chars);

  useEffect(() => {
    const id = requestAnimationFrame(() => setResolved(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const accentStart = accent ? title.indexOf(accent) : -1;
  const accentLen = accent ? accent.length : 0;
  const accentEnd = accentStart >= 0 ? accentStart + accentLen : -1;

  // group chars into words (by space) so wrapping happens at word boundaries,
  // while keeping each character its own animated inline-block.
  const words: { ch: string; gi: number }[][] = [];
  let cur: { ch: string; gi: number }[] = [];
  chars.forEach((ch, gi) => {
    if (ch === " ") {
      if (cur.length) {
        words.push(cur);
        cur = [];
      }
    } else {
      cur.push({ ch, gi });
    }
  });
  if (cur.length) words.push(cur);

  const nodes: ReactNode[] = [];
  words.forEach((word, wi) => {
    if (wi > 0) nodes.push(" ");
    const inner: ReactNode[] = word.map(({ ch, gi }) => {
      const isAccent = accent && gi >= accentStart && gi < accentEnd;
      const s = plan_[gi];
      const style = resolved
        ? {
            transform: "translate(0,0) rotate(0deg)",
            opacity: 1,
            color: isAccent ? "var(--signal)" : "var(--ink)",
            transitionDelay: `${s.delay}ms`,
          }
        : {
            transform: `translate(${s.dx}px, ${s.dy}px) rotate(${s.rot}deg)`,
            opacity: 0.12,
            color: "var(--noise)",
            transitionDelay: `${s.delay}ms`,
          };
      return (
        <span key={gi} className="hero__char" style={style}>
          {ch}
        </span>
      );
    });
    nodes.push(
      <span key={`w-${wi}`} className="hero__word">
        {inner}
      </span>
    );
  });

  return (
    <section className="hero">
      <h1 className="hero__title" aria-label={title}>
        {nodes}
      </h1>
      {dek ? <p className="hero__dek">{dek}</p> : null}
      <div className="entropy-divider" aria-hidden="true" />
    </section>
  );
}
