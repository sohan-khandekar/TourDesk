# TourDesk 🗺️

> Tourist-place discovery portal for Hyderabad. TourDesk shows location, timings, highlights and price structure, then redirects users to the official destination portal for ticket booking. Restaurants are shown as food guides only — no booking or payment is handled by TourDesk.

## What changed in this version

- Removed direct ticket booking from the TourDesk frontend flow.
- Attraction cards now open official/venue ticket or information portals.
- The old booking page has been converted into an official-redirect details page.
- Food/restaurant cards do **not** show booking. They display famous dishes to try.
- Backend booking creation is disabled and returns a clear `410 Gone` response.
- Static frontend and backend place data now include:
  - `priceDetails`
  - `bookingLink`
  - `officialInfoLink`
  - `dishesToTry` for food listings

## Features

| Feature | Description |
|---------|-------------|
| City Selector | Hyderabad is live; more cities can be added later |
| Category Filter | Historical, Devotional, Water Parks, Amusement, Food, Nature, Photography, Adventure |
| Visited Toggle | Mark places as visited; persisted in localStorage |
| Official Redirects | Users continue to official portals for payment and live ticket availability |
| Price Structure | Indicative adult/child pricing and notes before redirecting |
| Restaurant Guides | Famous dishes to try; no table booking or food ordering |
| Place Details | Location, timings, rating, highlights, nearest metro, best time to visit |

## Tech Stack

**Frontend:** Next.js 13 · TypeScript · Tailwind CSS  
**Backend:** FastAPI · Python 3.12 · Pydantic v2  
**Deploy:** Vercel (frontend) · Docker/FastAPI (backend)

## Quick Start

```bash
# From project root
npm install
npm run dev          # http://localhost:3000

# Backend, optional
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload    # http://localhost:8000
```

## Project Structure

```
tourdesk/
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing / city selector
│   │   ├── places/page.tsx      # Browse + filter
│   │   └── booking/page.tsx     # Details + official redirect, not internal booking
│   ├── components/
│   │   ├── navbar.tsx
│   │   └── place-card.tsx
│   └── data/places.ts           # Static Hyderabad data with official links
├── backend/
│   ├── app/
│   │   ├── api/routes/          # places, cities, meta, disabled bookings endpoint
│   │   ├── core/                # config, data_loader
│   │   └── schemas/             # Pydantic models
│   └── data/
│       ├── places.json
│       └── cities.json
├── specs/
└── .specify/
```

## Important booking behavior

TourDesk does **not** process ticket payments, generate ticket IDs, reserve slots, or manage refunds. It only redirects users to official destination portals or official information pages. Always verify live pricing, timings and rules on the official portal before final payment.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/places?city=hyderabad` | List all places |
| GET | `/api/v1/places?city=hyderabad&category=historical` | Filtered places |
| GET | `/api/v1/places/{id}` | Single place detail with official links |
| POST | `/api/v1/bookings` | Disabled; returns `410 Gone` with official link |
| GET | `/api/v1/cities` | List cities |
| GET | `/api/v1/meta/categories` | List categories |

## Adding a New City

1. Add place objects to `frontend/data/places.ts` and `backend/data/places.json`.
2. Include `priceDetails`, `bookingLink` or `officialInfoLink`.
3. For restaurants, add `dishesToTry` and do not add a booking CTA.
4. Add the city to `frontend/app/page.tsx` `CITIES` array.
5. Add the city to `backend/data/cities.json`.

## License

MIT


## Multilingual Support

TourDesk supports internationalization and localization.

Supported languages:

- English
- Hindi
- Marathi

Users can switch languages using the language selector visible in the app. The selected language is saved in the browser and reused on the next visit.

See `I18N_L10N.md` for details.
