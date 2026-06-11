from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ...core.data_loader import get_place_by_id, get_places_by_category, get_places_by_city

router = APIRouter(prefix="/places", tags=["places"])


@router.get("")
async def list_places(
    city: str = Query(..., description="City slug, e.g. hyderabad"),
    category: str | None = Query(None, description="Category filter"),
    search: str | None = Query(None, description="Name/description search"),
) -> list[dict]:
    places = get_places_by_city(city)
    if not places:
        raise HTTPException(status_code=404, detail=f"No places found for city '{city}'")

    if category and category != "all":
        places = [p for p in places if p["category"] == category]

    if search:
        q = search.lower()
        places = [
            p for p in places
            if q in p["name"].lower() or q in p["description"].lower()
        ]

    return places


@router.get("/{place_id}")
async def get_place(place_id: str) -> dict:
    place = get_place_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail=f"Place '{place_id}' not found")
    return place
