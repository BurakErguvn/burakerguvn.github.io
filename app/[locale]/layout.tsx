import { notFound } from "next/navigation";
import { LeftRail } from "@/components/LeftRail";
import { SiteFooter } from "@/components/SiteFooter";
import { LangSync } from "@/components/LangSync";
import { locales, isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <div className="shell" key={locale}>
      <LangSync />
      <LeftRail />
      <div className="shell__main">
        {children}
        <div className="footer-cell">
          <SiteFooter locale={locale} />
        </div>
      </div>
    </div>
  );
}
