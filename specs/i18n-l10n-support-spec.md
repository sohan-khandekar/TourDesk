# Feature Specification: Multilingual i18n and l10n Support

**Feature Branch**: `feature/i18n-l10n-support`

**Created**: 2026-06-11

**Status**: Completed

**Input**: User description: "Implement multilingual support in TourDesk using English, Hindi, and Marathi"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Language Switcher (Priority: P1)

As a user, I want a floating language switcher visible on all pages so that I can easily change the interface language.

**Why this priority**: Core requirement for accessibility and language selection.

**Independent Test**: Verify that clicking the language switcher displays options for English, Hindi, and Marathi, and selecting one changes the language instantly.

**Acceptance Scenarios**:

1. **Given** the user is on the landing page, **When** they click the language switcher and select "Hindi", **Then** the page text translations change to Hindi.
2. **Given** the user is on the places page, **When** they click the language switcher and select "Marathi", **Then** the page text translations change to Marathi.

---

### User Story 2 - Language Persistence (Priority: P2)

As a user, I want my language preference to be saved so that it persists across page refreshes and visits.

**Why this priority**: Avoids forcing the user to re-select their preferred language every time they open the app.

**Independent Test**: Set the language to Hindi, refresh the browser page, and verify the page remains in Hindi.

**Acceptance Scenarios**:

1. **Given** the user has set the language to "Marathi", **When** they refresh the page, **Then** the page is still rendered in Marathi.

### Edge Cases

- What happens when the browser's localStorage is cleared? The app falls back to the default language (English).
- How does system handle unsupported locales? The app ignores them and defaults to English.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a floating language switcher on all pages.
- **FR-002**: System MUST support English (en), Hindi (hi), and Marathi (mr).
- **FR-003**: System MUST persist the selected language in localStorage.
- **FR-004**: System MUST update the HTML lang attribute dynamically.
- **FR-005**: System MUST translate all common navigation and category filter labels.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Language transitions happen in under 100ms client-side.
- **SC-002**: 100% of core interface labels are translated.

## Assumptions

- Users have a modern web browser supporting localStorage.
- Machine translation is out of scope; all translations are curated in pre-defined dictionaries.
