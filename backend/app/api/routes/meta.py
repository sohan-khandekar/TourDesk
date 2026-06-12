from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/meta", tags=["meta"])

CATEGORIES = [
    {"id": "all", "label": "All"},
    {"id": "historical", "label": "Historical"},
    {"id": "devotional", "label": "Devotional"},
    {"id": "water_parks", "label": "Water Parks"},
    {"id": "amusement", "label": "Amusement"},
    {"id": "food", "label": "Food & Dining"},
    {"id": "nature", "label": "Nature"},
    {"id": "photography", "label": "Photography"},
    {"id": "adventure", "label": "Adventure"},
]


@router.get("/categories")
async def get_categories() -> list[dict]:
    return CATEGORIES


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
