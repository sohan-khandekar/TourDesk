"use client";

import type { TranslationKey } from "../lib/i18n";
import { useI18n } from "./i18n-root";

type TranslatedTextProps = {
  k: TranslationKey;
  className?: string;
};

export function TranslatedText({ k, className }: TranslatedTextProps) {
  const { t } = useI18n();

  return <span className={className}>{t(k)}</span>;
}
