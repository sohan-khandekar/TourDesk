from __future__ import annotations

import json
import uuid
from datetime import UTC, datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query

from ...core.data_loader import load_places
from ...schemas.review import ReviewRequest, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["reviews"])

DATA_DIR = Path(__file__).parent.parent.parent.parent / "data"
REVIEWS_FILE = DATA_DIR / "reviews.json"


def load_reviews_from_file() -> list[dict]:
    if not REVIEWS_FILE.exists():
        return []
    with REVIEWS_FILE.open(encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_reviews_to_file(reviews: list[dict]) -> None:
    with REVIEWS_FILE.open("w", encoding="utf-8") as f:
        json.dump(reviews, f, indent=2, ensure_ascii=False)


@router.get("", response_model=list[ReviewResponse])
async def list_reviews(
    place_id: str | None = Query(None, description="Filter reviews by place ID"),
) -> list[dict]:
    reviews = load_reviews_from_file()
    if place_id:
        reviews = [r for r in reviews if r["place_id"] == place_id.lower()]
    # Sort by creation time descending (newest first)
    reviews.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return reviews


@router.post("", response_model=ReviewResponse, status_code=201)
async def create_review(payload: ReviewRequest) -> dict:
    # Validate that the place exists
    places = load_places()
    valid_place_ids = {p["id"] for p in places}
    if payload.place_id.lower() not in valid_place_ids:
        raise HTTPException(
            status_code=404, detail=f"Place with ID '{payload.place_id}' not found."
        )

    reviews = load_reviews_from_file()

    new_review = {
        "id": f"rev_{uuid.uuid4().hex[:8]}",
        "place_id": payload.place_id.lower(),
        "user_name": payload.user_name,
        "user_occupation": payload.user_occupation,
        "rating": payload.rating,
        "comment": payload.comment,
        "created_at": datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    reviews.append(new_review)
    save_reviews_to_file(reviews)

    return new_review
