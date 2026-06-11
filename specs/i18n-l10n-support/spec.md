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
