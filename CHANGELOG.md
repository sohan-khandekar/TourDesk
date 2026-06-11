# Changelog

## Official Redirect Version

- Removed direct ticket booking UX from TourDesk.
- Attraction cards now show official ticket/info redirects instead of internal booking.
- Added price structure notes and official links to frontend and backend place data.
- Converted `/booking` page into a details + official portal redirect page.
- Restaurant/food cards now show famous dishes to try and clearly avoid booking.
- Backend `POST /api/v1/bookings` is disabled with `410 Gone` so the system does not create internal bookings.
- Updated landing page, navbar, README and metadata copy to match the new model.
