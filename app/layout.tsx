import type { Metadata } from "next";
import Script from "next/script";
import { EB_Garamond, IM_Fell_English, IBM_Plex_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import {
  CF_WEB_ANALYTICS_TOKEN,
  GOOGLE_SITE_VERIFICATION,
} from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const fell = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-fell-face",
  display: "swap",
  adjustFontFallback: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Burak Ergüven — düşünen makineler",
    template: "%s — Burak Ergüven",
  },
  description:
    "Kişisel teknik blog ve araştırma defteri: Veri Bilimi, ML/DL, Kuantum Hata Düzeltme ve Kuantum ML üzerine matematiksel ve algoritmik derinlikte yazılar.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${ebGaramond.variable} ${fell.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <svg
          className="plate-hatch-defs"
          aria-hidden="true"
          width="0"
          height="0"
        >
          <defs>
            <pattern
              id="vintage-plate-hatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#faf5e9" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#2b2318"
                strokeWidth="0.55"
                opacity="0.38"
              />
            </pattern>
          </defs>
        </svg>
        {children}
        {CF_WEB_ANALYTICS_TOKEN ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_WEB_ANALYTICS_TOKEN })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
