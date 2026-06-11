"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type Locale,
  type TranslationKey,
  defaultLocale,
  dictionaries,
  isLocale,
  localeLabels,
  phraseMap,
  supportedLocales,
} from "../lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const originalTextStore = new WeakMap<Text, string>();

function shouldSkipNode(node: Node): boolean {
  const parent = node.parentElement;
  if (!parent) return true;

  const blockedTags = new Set([
    "SCRIPT",
    "STYLE",
    "TEXTAREA",
    "INPUT",
    "SELECT",
    "OPTION",
    "CODE",
    "PRE",
  ]);

  return blockedTags.has(parent.tagName);
}

function localizeTextNodes(locale: Locale) {
  if (typeof document === "undefined" || !document.body) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const node of textNodes) {
    if (shouldSkipNode(node)) continue;

    const rawText = node.nodeValue ?? "";
    const trimmedText = rawText.trim();

    if (!trimmedText) continue;

    const originalText = originalTextStore.get(node) ?? trimmedText;
    const translatedText = phraseMap[locale][originalText] ?? originalText;

    if (!originalTextStore.has(node)) {
      originalTextStore.set(node, originalText);
    }

    const nextText = rawText.replace(trimmedText, translatedText);

    if (node.nodeValue !== nextText) {
      node.nodeValue = nextText;
    }
  }
}

function AutoLocalize({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";

    localizeTextNodes(locale);

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => localizeTextNodes(locale));
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}

export function useI18n() {
  const value = useContext(I18nContext);

  if (!value) {
    throw new Error("useI18n must be used inside I18nRoot");
  }

  return value;
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="flex items-center gap-2 rounded-full border bg-white/95 px-3 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur">
      <span>{t("selectLanguage")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="rounded-md border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-400"
        aria-label={t("selectLanguage")}
      >
        {supportedLocales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FloatingLanguageSwitcher() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <LanguageSwitcher />
    </div>
  );
}

export function I18nRoot({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("tourdesk-locale");

    if (isLocale(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("tourdesk-locale", nextLocale);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => dictionaries[locale][key] ?? dictionaries.en[key],
    }),
    [locale, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>
      <AutoLocalize locale={locale} />
      {children}
      <FloatingLanguageSwitcher />
    </I18nContext.Provider>
  );
}
