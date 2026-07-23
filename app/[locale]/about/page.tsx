import { cv } from "@/lib/cv";
import type { Locale } from "@/lib/i18n";
import { dict } from "@/lib/i18n";
import { CvSection } from "@/components/CvSection";
import { PrintButton } from "@/components/PrintButton";
import { EntropyDivider } from "@/components/EntropyDivider";
import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return {
    title: dict[params.locale].about,
    description: params.locale === "tr" ? cv.summary.tr : cv.summary.en,
    alternates: { canonical: `/${params.locale}/about/` },
  };
}

const labels = {
  tr: {
    summary: "Özet",
    education: "Eğitim",
    research: "Araştırma İlgi Alanları",
    skills: "Yetenekler",
    experience: "Deneyim",
    projects: "Projeler",
    publications: "Yayınlar",
    certifications: "Sertifikalar",
    languages: "Diller",
    print: "PDF indir",
    present: "Devam ediyor",
  },
  en: {
    summary: "Profile",
    education: "Education",
    research: "Research Interests",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    publications: "Publications",
    certifications: "Certifications",
    languages: "Languages",
    print: "Download PDF",
    present: "Present",
  },
} as const;

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const t = labels[l];
  const pick = (x: Record<Locale, string>) => x[l];

  return (
    <div className="main-col cv">
      <header className="cv-header">
        <img
          className="cv-avatar"
          src={cv.avatar}
          alt={cv.name}
          width={96}
          height={96}
        />
        <div className="cv-header__info">
          <h1 className="cv-name">{cv.name}</h1>
          <p className="cv-title">{pick(cv.title)}</p>
          <ul className="cv-contact">
            <li>{pick(cv.location)}</li>
            {cv.email ? (
              <li>
                <a href={`mailto:${cv.email}`}>{cv.email}</a>
              </li>
            ) : null}
            {cv.links.github ? (
              <li>
                <a href={cv.links.github}>GitHub</a>
              </li>
            ) : null}
            {cv.links.linkedin ? (
              <li>
                <a href={cv.links.linkedin}>LinkedIn</a>
              </li>
            ) : null}
            {cv.links.scholar ? (
              <li>
                <a href={cv.links.scholar}>Scholar</a>
              </li>
            ) : null}
          </ul>
        </div>
        <PrintButton label={t.print} />
      </header>

      <EntropyDivider />

      <CvSection label={t.summary}>
        <p className="cv-summary">{pick(cv.summary)}</p>
      </CvSection>

      <CvSection label={t.education}>
        <ul className="cv-timeline">
          {cv.education.map((e, i) => (
            <li key={i} className="cv-timeline__item">
              <div className="cv-timeline__head">
                <span className="cv-timeline__title">{pick(e.degree)}</span>
                <span className="cv-timeline__date">
                  {e.start} — {pick(e.end) || t.present}
                </span>
              </div>
              <div className="cv-timeline__org">{e.institution}</div>
              {e.note ? <div className="cv-timeline__note">{pick(e.note)}</div> : null}
            </li>
          ))}
        </ul>
      </CvSection>

      <CvSection label={t.research}>
        <ul className="cv-list">
          {cv.researchInterests.map((r, i) => (
            <li key={i}>{pick(r)}</li>
          ))}
        </ul>
      </CvSection>

      <CvSection label={t.skills}>
        <div className="cv-skills">
          {cv.skills.map((s, i) => (
            <div key={i} className="cv-skills__group">
              <span className="cv-skills__cat">{pick(s.category)}</span>
              <span className="cv-skills__items">{s.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </CvSection>

      <CvSection label={t.experience}>
        <ul className="cv-timeline">
          {cv.experience.map((e, i) => (
            <li key={i} className="cv-timeline__item">
              <div className="cv-timeline__head">
                <span className="cv-timeline__title">{pick(e.role)}</span>
                <span className="cv-timeline__date">
                  {e.start} — {pick(e.end) || t.present}
                </span>
              </div>
              <div className="cv-timeline__org">{e.org}</div>
              <p className="cv-timeline__desc">{pick(e.description)}</p>
            </li>
          ))}
        </ul>
      </CvSection>

      <CvSection label={t.projects}>
        <ul className="cv-projects">
          {cv.projects.map((p, i) => (
            <li key={i} className="cv-projects__item">
              <div className="cv-projects__head">
                {p.link ? (
                  <a href={p.link} className="cv-projects__name">
                    {p.name}
                  </a>
                ) : (
                  <span className="cv-projects__name">{p.name}</span>
                )}
              </div>
              <p className="cv-projects__desc">{pick(p.description)}</p>
              {p.tags.length > 0 ? (
                <div className="cv-projects__tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </CvSection>

      {cv.publications.length > 0 ? (
        <CvSection label={t.publications}>
          <ul className="cv-pubs">
            {cv.publications.map((p, i) => (
              <li key={i}>
                {p.link ? (
                  <a href={p.link}>{p.title}</a>
                ) : (
                  <span>{p.title}</span>
                )}{" "}
                <span className="cv-pubs__venue">
                  — {p.venue}, {p.year}
                </span>
              </li>
            ))}
          </ul>
        </CvSection>
      ) : null}

      {cv.certifications.length > 0 ? (
        <CvSection label={t.certifications}>
          <ul className="cv-timeline">
            {cv.certifications.map((c, i) => (
              <li key={i} className="cv-timeline__item">
                <div className="cv-timeline__head">
                  <span className="cv-timeline__title">{pick(c.name)}</span>
                  <span className="cv-timeline__date">{c.year}</span>
                </div>
                <div className="cv-timeline__org">{c.issuer}</div>
              </li>
            ))}
          </ul>
        </CvSection>
      ) : null}

      <CvSection label={t.languages}>
        <ul className="cv-langs">
          {cv.languages.map((lang, i) => (
            <li key={i}>
              <span className="cv-langs__name">{pick(lang.name)}</span>
              <span className="cv-langs__level">{pick(lang.level)}</span>
            </li>
          ))}
        </ul>
      </CvSection>

      <p className="cv-footnote">{dict[l].about}</p>
    </div>
  );
}
