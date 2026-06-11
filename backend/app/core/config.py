from __future__ import annotations

import os

APP_NAME   = "TourDesk API"
API_PREFIX = "/api/v1"

ALLOWED_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://tourdesk.vercel.app",
]

ALLOW_ORIGIN_REGEX: str = r"https://.*\.vercel\.app"

DATABASE_URL: str = os.getenv("DATABASE_URL", "")
