# Spec: Places Browse & Filter

## Overview
Allow users to browse tourist places in a selected city, filter by category and mark places as visited.

## Goals
- Display all places for a given city in a responsive card grid.
- Filter by 8 categories: Historical, Devotional, Water Parks, Amusement, Food & Dining, Nature, Photography, Adventure.
- Persist visited places in `localStorage`.
- Link each card to the booking page.

## Requirements
- `GET /api/v1/places?city=hyderabad` returns all places.
- `GET /api/v1/places?city=hyderabad&category=historical` filters by category.
- Frontend filter is applied client-side for zero-latency UX.
- Visited toggle is per-browser, no auth required.

## Acceptance Criteria
- All 8 category pills render and filter correctly.
- Clicking "Book Now" navigates to `/booking?place=<id>&city=<city>`.
- Checked place remains checked after page refresh.
- Empty state shows when no places match filters.

## Risks
- localStorage unavailable in SSR — guard with `useEffect`.
