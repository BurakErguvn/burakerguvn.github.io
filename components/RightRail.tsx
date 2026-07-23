import { Toc } from "./Toc";
import { ReadingProgress } from "./ReadingProgress";
import type { TocItem } from "@/lib/toc";
import { type Locale, dict } from "@/lib/i18n";

export function RightRail({ items, locale }: { items: TocItem[]; locale: Locale }) {
  return (
    <aside className="right-rail">
      <ReadingProgress />
      <Toc items={items} title={dict[locale].toc} />
    </aside>
  );
}
