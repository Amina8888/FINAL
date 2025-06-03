import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, ru, kk } from "date-fns/locale";
import { Locale } from "date-fns";


const locales: Record<string, Locale> = {
  "en-US": enUS,
  "ru-RU": ru,
  "kk-KZ": kk,
};

interface FormatOptions {
  absolute?: boolean;
  relative?: boolean;
  pattern?: string; // default = "PPpp"
  withSuffix?: boolean; // for relative
}

/**
 * Returns a combined formatted date string.
 */
export function useFormattedDate({
  absolute = true,
  relative = true,
  pattern = "PPpp",
  withSuffix = true,
}: FormatOptions = {}) {
  const locale = useMemo(() => {
    const lang = navigator.language;
    return locales[lang] || enUS;
  }, []);

  return (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;

    const absoluteText = absolute ? format(d, pattern, { locale }) : "";
    const relativeText = relative ? formatDistanceToNow(d, { addSuffix: withSuffix, locale }) : "";

    if (absolute && relative) return `${absoluteText} (${relativeText})`;
    if (absolute) return absoluteText;
    if (relative) return relativeText;
    return "";
  };
}
