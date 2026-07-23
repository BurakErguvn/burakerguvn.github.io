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
//  ÖZGEÇMİŞ / CV  —  tek dosyadan düzenle.
//  Tüm "TODO: doldur" alanlarını kendi bilgilerinle değiştir.
//  Her metin alanı { tr, en } şeklinde iki dillidir; sayfa dili otomatik seçer.
// =============================================================================

export const cv: Cv = {
  name: "Burak Ergüven",
  title: {
    tr: "Bilgisayar Mühendisliği son sınıf öğrencisi",
    en: "Senior Computer Engineering student",
  },
  location: {
    tr: "Türkiye",
    en: "Türkiye",
  },
  email: "ornek@eposta.com", // TODO: doldur — geçerli e-posta adresin
  links: {
    github: "https://github.com/burakerguvn",
    linkedin: "", // TODO: doldur — https://linkedin.com/in/...
    scholar: "", // TODO: doldur — https://scholar.google.com/...
  },
  avatar: "/avatar.jpg",

  summary: {
    tr: "Veri Bilimi, Makine Öğrenmesi / Derin Öğrenme (ML/DL) ve Kuantum Hata Düzeltme (QEC) / Kuantum ML alanlarında çalışan bilgisayar mühendisliği son sınıf öğrencisiyim. Akademik disiplini mühendislik pratiğiyle birleştirerek karmaşık problemleri matematiksel ve algoritmik derinliğiyle eleitmeyi seviyorum.",
    en: "Senior computer engineering student working in Data Science, Machine Learning / Deep Learning (ML/DL) and Quantum Error Correction (QEC) / Quantum ML. I enjoy merging academic discipline with engineering practice to tackle complex problems with mathematical and algorithmic depth.",
  },

  education: [
    {
      degree: { tr: "Lisans — Bilgisayar Mühendisliği", en: "BSc — Computer Engineering" },
      institution: "Üniversite adı", // TODO: doldur
      start: "2021",
      end: { tr: "2026 (mezun adayı)", en: "2026 (candidate)" },
      note: {
        tr: "İlgili dersler: Olasılık, Lineer Cebir, Algoritmalar, Makine Öğrenmesi, Kuantum Bilgi İşleme.",
        en: "Relevant coursework: Probability, Linear Algebra, Algorithms, Machine Learning, Quantum Information Processing.",
      },
    },
  ],

  researchInterests: [
    { tr: "Veri Bilimi", en: "Data Science" },
    { tr: "Makine Öğrenmesi / Derin Öğrenme (ML/DL)", en: "Machine Learning / Deep Learning (ML/DL)" },
    { tr: "Kuantum Hata Düzeltme (QEC)", en: "Quantum Error Correction (QEC)" },
    { tr: "Kuantum ML", en: "Quantum ML" },
    { tr: "Blokzincir & Akıllı Kontratlar (uzaklaşıldı)", en: "Blockchain & Smart Contracts (moved away)" },
  ],

  skills: [
    {
      category: { tr: "Programlama Dilleri", en: "Programming Languages" },
      items: ["Python", "TypeScript", "JavaScript", "C/C++", "SQL"], // TODO: doldur
    },
    {
      category: { tr: "ML / DL", en: "ML / DL" },
      items: ["PyTorch", "TensorFlow", "scikit-learn", "NumPy", "Pandas"], // TODO: doldur
    },
    {
      category: { tr: "Kuantum & Araçlar", en: "Quantum & Tools" },
      items: ["Qiskit", "LaTeX", "Mermaid"], // TODO: doldur
    },
    {
      category: { tr: "DevOps & Web", en: "DevOps & Web" },
      items: ["Git", "Docker", "Next.js", "GitHub Actions", "Linux"], // TODO: doldur
    },
  ],

  experience: [
    {
      role: { tr: "Araştırma Stajı / Proje", en: "Research Internship / Project" }, // TODO: doldur
      org: "Kurum / Laboratuvar adı",
      start: "2025",
      end: { tr: "2025", en: "2025" },
      description: {
        tr: "Kısa açıklama: üzerinde çalıştığın problem, katkın ve sonuçlar.",
        en: "Short description: the problem you worked on, your contribution, and outcomes.",
      },
    },
  ],

  projects: [
    {
      name: "burakerguvn.github.io",
      description: {
        tr: "Kişisel teknik blog ve araştırma defteri — Next.js statik export, Decap CMS, MDX + KaTeX + Mermaid.",
        en: "Personal technical blog and research notebook — Next.js static export, Decap CMS, MDX + KaTeX + Mermaid.",
      },
      tags: ["Next.js", "MDX", "KaTeX", "Mermaid"],
      link: "https://github.com/burakerguvn/burakerguvn.github.io",
    },
    // TODO: doldur — diğer projelerini ekle
  ],

  publications: [
    // TODO: doldur — varsa yayınlarını ekle
    // { title: "...", venue: "...", year: "2025", link: "https://..." }
  ],

  certifications: [
    // TODO: doldur — varsa sertifikalarını ekle
    // { name: { tr, en }, issuer: "...", year: "2024" }
  ],

  languages: [
    { name: { tr: "Türkçe", en: "Turkish" }, level: { tr: "Anadil", en: "Native" } },
    { name: { tr: "İngilizce", en: "English" }, level: { tr: "İleri (C1)", en: "Advanced (C1)" } }, // TODO: doldur — seviye
  ],
};
