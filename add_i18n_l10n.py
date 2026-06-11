from pathlib import Path

root = Path(".").resolve()

def write(path, content):
    p = root / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"created/updated {path}")

# 1. Translation dictionary
write("frontend/lib/i18n.ts", r'''
export const supportedLocales = ["en", "hi", "mr"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export const dictionaries = {
  en: {
    appName: "TourDesk",
    tagline: "Discover Hyderabad with official booking links and local food recommendations",
    home: "Home",
    places: "Places",
    restaurants: "Restaurants",
    officialBooking: "Official Booking",
    officialPortal: "Official Portal",
    viewDetails: "View Details",
    bookOnOfficialPortal: "Book on Official Portal",
    checkOfficialInfo: "Check Official Information",
    priceDetails: "Price Details",
    location: "Location",
    timings: "Timings",
    category: "Category",
    famousDishes: "Famous dishes to try",
    dishesToTry: "Dishes to try",
    noDirectBooking: "No direct booking on TourDesk",
    restaurantNote: "Restaurant booking is not available on TourDesk. Explore popular dishes before visiting.",
    selectLanguage: "Select language",
    selectCity: "Select City",
    searchPlaceholder: "Search places, food, or categories",
    historical: "Historical",
    devotional: "Devotional",
    amusement: "Amusement",
    museum: "Museum",
    lake: "Lake",
    garden: "Garden",
    food: "Food",
    allCategories: "All Categories",
    exploreNow: "Explore Now",
    verifyBeforeVisit: "Verify prices and timings on the official portal before visiting.",
    redirectNotice: "You will be redirected to the official website for booking.",
    cityHyderabad: "Hyderabad",
    welcomeTitle: "Plan your Hyderabad trip smarter",
    welcomeSubtitle: "Find tourist places, ticket information, locations, and famous dishes in one place.",
  },
  hi: {
    appName: "टूरडेस्क",
    tagline: "आधिकारिक बुकिंग लिंक और स्थानीय भोजन सुझावों के साथ हैदराबाद खोजें",
    home: "होम",
    places: "पर्यटन स्थल",
    restaurants: "रेस्तरां",
    officialBooking: "आधिकारिक बुकिंग",
    officialPortal: "आधिकारिक पोर्टल",
    viewDetails: "विवरण देखें",
    bookOnOfficialPortal: "आधिकारिक पोर्टल पर बुक करें",
    checkOfficialInfo: "आधिकारिक जानकारी देखें",
    priceDetails: "मूल्य विवरण",
    location: "स्थान",
    timings: "समय",
    category: "श्रेणी",
    famousDishes: "प्रसिद्ध व्यंजन जिन्हें ज़रूर आज़माएँ",
    dishesToTry: "आज़माने योग्य व्यंजन",
    noDirectBooking: "टूरडेस्क पर सीधी बुकिंग उपलब्ध नहीं है",
    restaurantNote: "टूरडेस्क पर रेस्तरां बुकिंग उपलब्ध नहीं है। जाने से पहले लोकप्रिय व्यंजन देखें।",
    selectLanguage: "भाषा चुनें",
    selectCity: "शहर चुनें",
    searchPlaceholder: "स्थल, भोजन या श्रेणी खोजें",
    historical: "ऐतिहासिक",
    devotional: "धार्मिक",
    amusement: "मनोरंजन",
    museum: "संग्रहालय",
    lake: "झील",
    garden: "उद्यान",
    food: "भोजन",
    allCategories: "सभी श्रेणियाँ",
    exploreNow: "अभी देखें",
    verifyBeforeVisit: "जाने से पहले आधिकारिक पोर्टल पर कीमत और समय की पुष्टि करें।",
    redirectNotice: "बुकिंग के लिए आपको आधिकारिक वेबसाइट पर भेजा जाएगा।",
    cityHyderabad: "हैदराबाद",
    welcomeTitle: "अपनी हैदराबाद यात्रा को बेहतर तरीके से प्लान करें",
    welcomeSubtitle: "पर्यटन स्थल, टिकट जानकारी, स्थान और प्रसिद्ध व्यंजन एक ही जगह देखें।",
  },
  mr: {
    appName: "टूरडेस्क",
    tagline: "अधिकृत बुकिंग लिंक आणि स्थानिक खाद्य शिफारसींसह हैदराबाद शोधा",
    home: "मुख्यपृष्ठ",
    places: "पर्यटन स्थळे",
    restaurants: "रेस्टॉरंट्स",
    officialBooking: "अधिकृत बुकिंग",
    officialPortal: "अधिकृत पोर्टल",
    viewDetails: "तपशील पहा",
    bookOnOfficialPortal: "अधिकृत पोर्टलवर बुक करा",
    checkOfficialInfo: "अधिकृत माहिती पहा",
    priceDetails: "किंमत तपशील",
    location: "स्थान",
    timings: "वेळा",
    category: "वर्ग",
    famousDishes: "चाखण्यासारखे प्रसिद्ध पदार्थ",
    dishesToTry: "चाखण्यासारखे पदार्थ",
    noDirectBooking: "टूरडेस्कवर थेट बुकिंग उपलब्ध नाही",
    restaurantNote: "टूरडेस्कवर रेस्टॉरंट बुकिंग उपलब्ध नाही. भेट देण्यापूर्वी लोकप्रिय पदार्थ पहा.",
    selectLanguage: "भाषा निवडा",
    selectCity: "शहर निवडा",
    searchPlaceholder: "स्थळे, खाद्यपदार्थ किंवा वर्ग शोधा",
    historical: "ऐतिहासिक",
    devotional: "धार्मिक",
    amusement: "मनोरंजन",
    museum: "संग्रहालय",
    lake: "तलाव",
    garden: "उद्यान",
    food: "खाद्य",
    allCategories: "सर्व वर्ग",
    exploreNow: "आता पाहा",
    verifyBeforeVisit: "भेट देण्यापूर्वी अधिकृत पोर्टलवर किंमत आणि वेळा तपासा.",
    redirectNotice: "बुकिंगसाठी तुम्हाला अधिकृत वेबसाइटवर पाठवले जाईल.",
    cityHyderabad: "हैदराबाद",
    welcomeTitle: "तुमची हैदराबाद सहल अधिक चांगल्या प्रकारे प्लॅन करा",
    welcomeSubtitle: "पर्यटन स्थळे, तिकीट माहिती, स्थान आणि प्रसिद्ध पदार्थ एकाच ठिकाणी पहा.",
  },
} as const;

export type TranslationKey = keyof typeof dictionaries.en;

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key];
}

export const phraseMap: Record<Locale, Record<string, string>> = {
  en: {
    "Home": "Home",
    "Places": "Places",
    "Restaurants": "Restaurants",
    "Official Booking": "Official Booking",
    "Official Portal": "Official Portal",
    "View Details": "View Details",
    "Book on Official Portal": "Book on Official Portal",
    "Check Official Information": "Check Official Information",
    "Price Details": "Price Details",
    "Location": "Location",
    "Timings": "Timings",
    "Category": "Category",
    "Famous dishes to try": "Famous dishes to try",
    "Dishes to try": "Dishes to try",
    "No direct booking on TourDesk": "No direct booking on TourDesk",
    "Select City": "Select City",
    "All Categories": "All Categories",
    "Explore Now": "Explore Now",
    "Hyderabad": "Hyderabad",
    "Historical": "Historical",
    "Devotional": "Devotional",
    "Amusement": "Amusement",
    "Museum": "Museum",
    "Lake": "Lake",
    "Garden": "Garden",
    "Food": "Food",
  },
  hi: {
    "Home": "होम",
    "Places": "पर्यटन स्थल",
    "Restaurants": "रेस्तरां",
    "Official Booking": "आधिकारिक बुकिंग",
    "Official Portal": "आधिकारिक पोर्टल",
    "View Details": "विवरण देखें",
    "Book on Official Portal": "आधिकारिक पोर्टल पर बुक करें",
    "Check Official Information": "आधिकारिक जानकारी देखें",
    "Price Details": "मूल्य विवरण",
    "Location": "स्थान",
    "Timings": "समय",
    "Category": "श्रेणी",
    "Famous dishes to try": "प्रसिद्ध व्यंजन जिन्हें ज़रूर आज़माएँ",
    "Dishes to try": "आज़माने योग्य व्यंजन",
    "No direct booking on TourDesk": "टूरडेस्क पर सीधी बुकिंग उपलब्ध नहीं है",
    "Select City": "शहर चुनें",
    "All Categories": "सभी श्रेणियाँ",
    "Explore Now": "अभी देखें",
    "Hyderabad": "हैदराबाद",
    "Historical": "ऐतिहासिक",
    "Devotional": "धार्मिक",
    "Amusement": "मनोरंजन",
    "Museum": "संग्रहालय",
    "Lake": "झील",
    "Garden": "उद्यान",
    "Food": "भोजन",
  },
  mr: {
    "Home": "मुख्यपृष्ठ",
    "Places": "पर्यटन स्थळे",
    "Restaurants": "रेस्टॉरंट्स",
    "Official Booking": "अधिकृत बुकिंग",
    "Official Portal": "अधिकृत पोर्टल",
    "View Details": "तपशील पहा",
    "Book on Official Portal": "अधिकृत पोर्टलवर बुक करा",
    "Check Official Information": "अधिकृत माहिती पहा",
    "Price Details": "किंमत तपशील",
    "Location": "स्थान",
    "Timings": "वेळा",
    "Category": "वर्ग",
    "Famous dishes to try": "चाखण्यासारखे प्रसिद्ध पदार्थ",
    "Dishes to try": "चाखण्यासारखे पदार्थ",
    "No direct booking on TourDesk": "टूरडेस्कवर थेट बुकिंग उपलब्ध नाही",
    "Select City": "शहर निवडा",
    "All Categories": "सर्व वर्ग",
    "Explore Now": "आता पाहा",
    "Hyderabad": "हैदराबाद",
    "Historical": "ऐतिहासिक",
    "Devotional": "धार्मिक",
    "Amusement": "मनोरंजन",
    "Museum": "संग्रहालय",
    "Lake": "तलाव",
    "Garden": "उद्यान",
    "Food": "खाद्य",
  },
};
''')

# 2. Provider + language switcher + auto-localization layer
write("frontend/components/i18n-root.tsx", r'''
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  dictionaries,
  isLocale,
  localeLabels,
  phraseMap,
  supportedLocales,
  type Locale,
  type TranslationKey,
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

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("tourdesk-locale", nextLocale);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => dictionaries[locale][key] ?? dictionaries.en[key],
    }),
    [locale]
  );

  return (
    <I18nContext.Provider value={value}>
      <AutoLocalize locale={locale} />
      {children}
      <FloatingLanguageSwitcher />
    </I18nContext.Provider>
  );
}
''')

# 3. Optional component for future translated UI usage
write("frontend/components/translated-text.tsx", r'''
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
''')

# 4. Patch frontend/app/layout.tsx
layout_path = root / "frontend" / "app" / "layout.tsx"

if layout_path.exists():
    layout = layout_path.read_text(encoding="utf-8")

    if "I18nRoot" not in layout:
        lines = layout.splitlines()
        insert_index = 0
        for i, line in enumerate(lines):
            if line.startswith("import "):
                insert_index = i + 1

        lines.insert(insert_index, 'import { I18nRoot } from "../components/i18n-root";')
        layout = "\n".join(lines)

    if '<html lang="en">' in layout:
        layout = layout.replace('<html lang="en">', '<html lang="en" suppressHydrationWarning>')

    if "{children}" in layout and "<I18nRoot>{children}</I18nRoot>" not in layout:
        layout = layout.replace("{children}", "<I18nRoot>{children}</I18nRoot>", 1)

    layout_path.write_text(layout + "\n", encoding="utf-8")
    print("patched frontend/app/layout.tsx")
else:
    print("WARNING: frontend/app/layout.tsx not found. Add I18nRoot manually.")

# 5. Add i18n/l10n documentation
write("I18N_L10N.md", r'''
# TourDesk i18n and l10n Implementation

## Requirement

All projects should be available in at least two Indian languages.

TourDesk supports:

- English
- Hindi
- Marathi

## Concept

Internationalization, also called i18n, means designing the application so that it can support multiple languages and locales.

Localization, also called l10n, means adapting the actual visible content for a specific language, region, or culture.

## Implementation in TourDesk

TourDesk uses:

- `frontend/lib/i18n.ts` for supported locales and dictionaries.
- `frontend/components/i18n-root.tsx` for language state, persistence, and language switching.
- `frontend/components/translated-text.tsx` for reusable translated text.
- A floating language selector visible on every page.
- Browser `localStorage` to remember the selected language.
- HTML `lang` attribute update for accessibility.

## Supported Locales

| Locale | Language |
|---|---|
| en | English |
| hi | Hindi |
| mr | Marathi |

## Testing

Run:

    cd frontend
    npm run dev

Then open:

    http://localhost:3000

Use the bottom-right language selector to switch between English, Hindi, and Marathi.
''')

# 6. Add Spec-Kit feature spec for multilingual requirement
write("specs/i18n-l10n-support/spec.md", r'''
# Feature Specification: i18n and l10n Support

## User Story

As a user, I want TourDesk to be available in Indian languages so that I can understand tourism information in a language I am comfortable with.

## Requirement

The project must support at least two Indian languages.

TourDesk supports Hindi and Marathi, along with English.

## Scope

### In Scope

- Add language switcher.
- Add Hindi translations.
- Add Marathi translations.
- Persist selected language.
- Update HTML lang attribute.
- Translate common UI labels.

### Out of Scope

- Automatic machine translation.
- Right-to-left language support.
- Full route-based language URLs.

## Functional Requirements

- FR-001: User can switch language from the UI.
- FR-002: User can select Hindi.
- FR-003: User can select Marathi.
- FR-004: User language preference is saved.
- FR-005: Common navigation, booking, restaurant, price, and category labels are localized.

## Acceptance Criteria

- AC-001: Language switcher is visible on every page.
- AC-002: Selecting Hindi changes visible UI labels to Hindi.
- AC-003: Selecting Marathi changes visible UI labels to Marathi.
- AC-004: Refreshing the page keeps the selected language.
- AC-005: App builds successfully.
''')

write("specs/i18n-l10n-support/plan.md", r'''
# Implementation Plan: i18n and l10n Support

## Objective

Implement multilingual support for TourDesk using English, Hindi, and Marathi.

## Technical Approach

Use a lightweight client-side i18n system with dictionary files, React context, a language switcher, and localStorage persistence.

## Files Added

- frontend/lib/i18n.ts
- frontend/components/i18n-root.tsx
- frontend/components/translated-text.tsx
- I18N_L10N.md
- specs/i18n-l10n-support/spec.md
- specs/i18n-l10n-support/plan.md
- specs/i18n-l10n-support/tasks.md

## UI Changes

- Add floating language switcher.
- Translate common interface labels.
- Preserve selected language across refreshes.

## Testing Plan

- Run local development server.
- Switch to Hindi.
- Switch to Marathi.
- Refresh page and verify selection persists.
- Run production build.
''')

write("specs/i18n-l10n-support/tasks.md", r'''
# Tasks: i18n and l10n Support

## Setup

- [x] Learn difference between i18n and l10n.
- [x] Choose supported Indian languages.
- [x] Create dictionary structure.

## Implementation

- [x] Add Hindi translations.
- [x] Add Marathi translations.
- [x] Add language switcher.
- [x] Add localStorage persistence.
- [x] Add HTML lang update.
- [x] Add common UI localization.

## Validation

- [ ] Run npm run dev.
- [ ] Test English.
- [ ] Test Hindi.
- [ ] Test Marathi.
- [ ] Run npm run build.

## Documentation

- [x] Add I18N_L10N.md.
- [x] Add Spec-Kit feature spec.
- [x] Add implementation plan.
- [x] Add tasks list.
''')

# 7. Append README note
readme_path = root / "README.md"
if readme_path.exists():
    readme = readme_path.read_text(encoding="utf-8")
    if "Multilingual Support" not in readme:
        readme += """

## Multilingual Support

TourDesk supports internationalization and localization.

Supported languages:

- English
- Hindi
- Marathi

Users can switch languages using the language selector visible in the app. The selected language is saved in the browser and reused on the next visit.

See `I18N_L10N.md` for details.
"""
        readme_path.write_text(readme, encoding="utf-8")
        print("updated README.md")
