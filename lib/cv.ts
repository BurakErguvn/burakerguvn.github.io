import fs from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n";

/** Localized string: Turkish + English. */
export type L = Record<Locale, string>;

export interface EduItem {
  degree: L;
  institution: string;
  start: string;
  end: L; // "2026" or {tr:"Devam ediyor", en:"Present"}
  note?: L;
}

export interface SkillGroup {
  category: L;
  items: string[];
}

export interface ExpItem {
  role: L;
  org: string;
  start: string;
  end: L;
  description: L;
}

export interface ProjectItem {
  name: string;
  description: L;
  tags: string[];
  link: string;
}

export interface PubItem {
  title: string;
  venue: string;
  year: string;
  link: string;
}

export interface CertItem {
  name: L;
  issuer: string;
  year: string;
}

export interface LangItem {
  name: L;
  level: L;
}

export interface Cv {
  name: string;
  title: L;
  location: L;
  email: string;
  links: { github: string; linkedin: string; scholar: string };
  avatar: string;
  summary: L;
  education: EduItem[];
  researchInterests: L[];
  skills: SkillGroup[];
  experience: ExpItem[];
  projects: ProjectItem[];
  publications: PubItem[];
  certifications: CertItem[];
  languages: LangItem[];
}

// =============================================================================
//  ÖZGEÇMİŞ / CV
//  Veri artık content/cv/cv.json içinde — Decap CMS (/admin) üzerinden
//  "Özgeçmiş / CV" koleksiyonundan güncellenir. Bu dosya sadece build
//  sırasında JSON'u okur ve aynı Cv tipiyle sunar; sayfa hiç değişmez.
// =============================================================================

const CV_FILE = path.join(process.cwd(), "content", "cv", "cv.json");
const parsed = JSON.parse(fs.readFileSync(CV_FILE, "utf8")) as Cv;

// Decap boş opsiyonel listeleri kaydettiğinde anahtarı atlayabilir;
// sayfanın çökmemesi için dizi alanlarını garantiye al.
export const cv: Cv = {
  ...parsed,
  education: parsed.education ?? [],
  researchInterests: parsed.researchInterests ?? [],
  skills: parsed.skills ?? [],
  experience: parsed.experience ?? [],
  projects: parsed.projects ?? [],
  publications: parsed.publications ?? [],
  certifications: parsed.certifications ?? [],
  languages: parsed.languages ?? [],
};
