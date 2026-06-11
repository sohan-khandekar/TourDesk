"use client";

import { useI18n } from "./i18n-root";
import type { TranslationKey } from "../lib/i18n";

type TranslatedTextProps = {
  k: TranslationKey;
  className?: string;
};

export function TranslatedText({ k, className }: TranslatedTextProps) {
  const { t } = useI18n();

  return <span className={className}>{t(k)}</span>;
}
