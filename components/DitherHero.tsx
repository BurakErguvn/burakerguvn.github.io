"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dither Art Hero
 *
 * Başlığı yuvarlak nokta (round pixel) dither deseni olarak çizer.
 * Yoğunluk her yerde aynı (DENSITY), metin italik.
 * Sürekli kıvılcım (twinkle) animasyonu: açık/kapalı hücreler yer değiştirir,
 * toplam yoğunluk korunur (açıklar kapanır, kapalılar açılır).
 *
 * Erişilebilirlik: düz <h1> fallback (SEO/ekran okuyucu/no-JS), canvas aria-hidden.
 */

/** Dither hücre boyutu (CSS px). Daha büyük = daha iri noktalar. */
const CELL_CSS = 5;
/** Maksimum cihaz piksel oranı (perf için üst sınır). */
const MAX_DPR = 2;
/** Pixel yoğunluğu (0..1) — metin şekli içindeki hücrelerin ne kadarı "açık". */
const DENSITY = 0.91;
/** Nokta yarıçapı / hücre boyutu. <1 → hücreler arası boşluk (grid hissi). */
const DOT_FACTOR = 0.44;
/** Twinkle adımı süresi (ms). */
const SWAP_MS = 110;
/** Mount'ta fade-in süresi (ms). */
const FADE_MS = 500;
/** "İçeride" eşiği: yalnızca metinle yeterince kaplı hücreler sayılır (ince/okunaklı harf). */
const INSIDE_THRESHOLD = 0.45;
/** Nokta merkezi jitter'ı (hücre boyutunun oranı) — kusursuz grid olmayan stipple hissi. */
const JITTER = 0.18;

/** Deterministic [0,1) — SSR/client tutarlılığı için (burada sadece client). */
function rand(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface Geometry {
  cssW: number;
  cssH: number;
  dpr: number;
  cellDev: number;
  cols: number;
  rows: number;
  /** intensity[cell] ∈ [0,1]: hücrenin ne kadarı metin ile kaplı. */
  intensity: Float32Array;
  /** accent[cell]: hücre accent kelime içinde mi. */
  accent: Uint8Array;
  /** Metin şekli içindeki hücre indeksleri. */
  inside: number[];
  /** Hücre açık/kapalı durumu (twinkle ile değişir). */
  state: Uint8Array;
}

export function DitherHero({
  title,
  accent,
  dek,
}: {
  title: string;
  accent?: string;
  dek?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const h1 = h1Ref.current;
    const wrap = wrapRef.current;
    if (!canvas || !h1 || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const rootCs = getComputedStyle(document.documentElement);
    const ink = rootCs.getPropertyValue("--ink").trim() || "#14161b";
    const signal = rootCs.getPropertyValue("--signal").trim() || "#2b4fe6";
    const paper = rootCs.getPropertyValue("--paper").trim() || "#f7f8fa";

    let geo: Geometry | null = null;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    let resizeTimer = 0;

    /** Metni h1 kutusuna sığacak şekilde sar (canvas measureText ile). */
    function wrapLines(
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number
    ): string[] {
      const words = text.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let cur = "";
      for (const w of words) {
        const test = cur ? cur + " " + w : w;
        if (ctx.measureText(test).width > maxWidth && cur) {
          lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      return lines.length ? lines : [text];
    }

    /** Hücre ızgarası yoğunluğunu offscreen metninden hesapla. */
    const computeGeometry = (): Geometry | null => {
      const cs = getComputedStyle(h1);
      const fontSize = parseFloat(cs.fontSize);
      const fontWeight = cs.fontWeight;
      const fontFamily = cs.fontFamily;
      const cssW = h1.clientWidth;
      const cssH = h1.clientHeight;
      if (cssW < 2 || cssH < 2) return null;

      // Canvası h1 kutusuna birebir ört (piksel kusursuz).
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";

      const cellDev = Math.max(2, Math.round(CELL_CSS * dpr));
      const cols = Math.max(1, Math.floor((cssW * dpr) / cellDev));
      const rows = Math.max(1, Math.floor((cssH * dpr) / cellDev));

      // Offscreen: metni tam cihaz çözünürlüğünde çiz.
      const off = document.createElement("canvas");
      off.width = Math.round(cssW * dpr);
      off.height = Math.round(cssH * dpr);
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return null;
      octx.scale(dpr, dpr);
      octx.font = `italic ${fontWeight} ${fontSize}px ${fontFamily}`;
      octx.textBaseline = "middle";
      octx.fillStyle = ink;

      const lines = wrapLines(octx, title, cssW);
      const lineH = fontSize * 1.2;
      const totalH = lines.length * lineH;
      const startY = (cssH - totalH) / 2 + lineH / 2;
      octx.fillStyle = ink;
      for (let i = 0; i < lines.length; i++) {
        octx.fillText(lines[i], 0, startY + i * lineH);
      }

      // Accent maskesi: accent kelime(leri) ayrı offscreen'da (satır kaymasını sağlar).
      let accImg: Uint8ClampedArray | null = null;
      if (accent) {
        const offAcc = document.createElement("canvas");
        offAcc.width = off.width;
        offAcc.height = off.height;
        const actx = offAcc.getContext("2d", { willReadFrequently: true });
        if (actx) {
          actx.scale(dpr, dpr);
          actx.font = `italic ${fontWeight} ${fontSize}px ${fontFamily}`;
          actx.textBaseline = "middle";
          actx.fillStyle = ink;
          const spaceW = octx.measureText(" ").width;
          for (let i = 0; i < lines.length; i++) {
            const y = startY + i * lineH;
            const ws = lines[i].split(/\s+/).filter(Boolean);
            let x = 0;
            for (const w of ws) {
              if (w === accent) actx.fillText(w, x, y);
              x += octx.measureText(w).width + spaceW;
            }
          }
          accImg = actx.getImageData(0, 0, offAcc.width, offAcc.height).data;
        }
      }

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const intensity = new Float32Array(cols * rows);
      const accentArr = new Uint8Array(cols * rows);
      const state = new Uint8Array(cols * rows);
      const inside: number[] = [];

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const x0 = cx * cellDev;
          const y0 = cy * cellDev;
          const x1 = Math.min(x0 + cellDev, off.width);
          const y1 = Math.min(y0 + cellDev, off.height);
          let sum = 0;
          let accSum = 0;
          let cnt = 0;
          for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
              const p = (y * off.width + x) * 4 + 3; // alpha
              sum += img[p];
              if (accImg) accSum += accImg[p];
              cnt++;
            }
          }
          const v = cnt ? sum / cnt / 255 : 0;
          const idx = cy * cols + cx;
          intensity[idx] = v;
          accentArr[idx] = accImg && cnt && accSum / cnt / 255 > 0.04 ? 1 : 0;
          if (v > INSIDE_THRESHOLD) {
            inside.push(idx);
            // Başlangıç durumu: DENSITY kadar hücre açık (deterministik).
            state[idx] = rand(idx * 1.7 + 3) < DENSITY ? 1 : 0;
          }
        }
      }

      return { cssW, cssH, dpr, cellDev, cols, rows, intensity, accent: accentArr, inside, state };
    };

    const render = (appear: number) => {
      if (!geo) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = Math.round(geo.cssW * geo.dpr);
      canvas.height = Math.round(geo.cssH * geo.dpr);
      ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
      ctx.clearRect(0, 0, geo.cssW, geo.cssH);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, geo.cssW, geo.cssH);

      const { cols, rows, state, accent, cellDev, dpr: g } = geo;
      const cellCss = cellDev / g;
      const r = cellCss * DOT_FACTOR;

      ctx.globalAlpha = appear;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const idx = cy * cols + cx;
          if (!state[idx]) continue;
          ctx.fillStyle = accent[idx] ? signal : ink;
          // Kusursuz grid yerine hafif jitter (stipple hissi).
          const jx = (rand(idx * 2.1 + 1) - 0.5) * cellCss * JITTER;
          const jy = (rand(idx * 3.7 + 5) - 0.5) * cellCss * JITTER;
          ctx.beginPath();
          ctx.arc(
            cx * cellCss + cellCss / 2 + jx,
            cy * cellCss + cellCss / 2 + jy,
            r,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    /** Twinkle: açık/kapalı hücre çiftlerini takas et (toplam yoğunluk korunur). */
    const swap = () => {
      if (!geo) return;
      const { inside, state } = geo;
      const n = inside.length;
      if (n < 2) return;
      const attempts = Math.max(12, Math.min(240, Math.floor(n * 0.04)));
      for (let i = 0; i < attempts; i++) {
        const a = inside[(Math.random() * n) | 0];
        const b = inside[(Math.random() * n) | 0];
        if (state[a] !== state[b]) {
          state[a] ^= 1;
          state[b] ^= 1;
        }
      }
    };

    const start = () => {
      geo = computeGeometry();
      if (!geo) return;
      const t0 = performance.now();
      let lastSwap = t0;
      render(0);
      setHidden(true);
      if (reduced) {
        render(1);
        return;
      }
      const tick = (now: number) => {
        const appear = Math.min(1, (now - t0) / FADE_MS);
        if (now - lastSwap >= SWAP_MS) {
          swap();
          lastSwap = now;
        }
        render(appear);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    let cancelled = false;
    (document as any).fonts?.ready?.then(() => {
      if (cancelled) return;
      // Fontlar yüklendikten sonra ölç.
      start();
    }) ?? start();

    ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (cancelled) return;
        start();
      }, 120);
    });
    ro.observe(wrap);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      ro?.disconnect();
    };
  }, [title, accent]);

  return (
    <section className="hero">
      <div className="dither-hero" ref={wrapRef}>
        <h1
          ref={h1Ref}
          className={`hero__title dither-hero__fallback${hidden ? " is-hidden" : ""}`}
          aria-label={title}
        >
          {title}
        </h1>
        <canvas className="hero__dither" aria-hidden="true" ref={canvasRef} />
      </div>
      {dek ? <p className="hero__dek">{dek}</p> : null}
      <div className="entropy-divider" aria-hidden="true" />
    </section>
  );
}
