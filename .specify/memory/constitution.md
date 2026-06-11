# Constitution (Memory)

This document defines how the repository maintains durable context for Spec-Kit workflows.

## Purpose
- Provide stable reference material for feature specifications.
- Capture architectural intent and compliance expectations.
- Prevent ambiguity during iterative development.

## Principles
- Specifications must be testable and scoped.
- Security and licensing constraints are first-class requirements.
- CI gates are mandatory for merging.

## Scope
Applies to:
- `specs/` feature specifications.
- `.specify/templates/` for consistent structure.

## Architecture

TourDesk is a full-stack tourist ticket booking platform.

### Frontend
- Next.js 13 (App Router) + TypeScript + Tailwind CSS
- Static data in `frontend/data/places.ts`
- Pages: `/` (city select), `/places` (browse + filter), `/booking` (ticket booking)

### Backend
- FastAPI + Python 3.12 + Pydantic v2
- Routes: `/api/v1/places`, `/api/v1/bookings`, `/api/v1/cities`, `/api/v1/meta`
- Data: JSON files in `backend/data/`

## Maintainer Commitments
- Keep templates up to date.
- Ensure `CHANGELOG.md` reflects meaningful changes.
- Maintain `SECURITY.md` and license references.
