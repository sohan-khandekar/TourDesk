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
