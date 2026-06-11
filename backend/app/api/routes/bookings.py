from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ...core.data_loader import get_place_by_id
from ...schemas.booking import BookingRequest

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", status_code=410)
async def create_booking(req: BookingRequest) -> dict:
    """Internal ticket booking is intentionally disabled.

    TourDesk now acts as an information + official-redirect portal. Payments,
    live slots, confirmations and refunds must be handled by the official
    attraction/venue website only.
    """
    place = get_place_by_id(req.place_id)
    if not place:
        raise HTTPException(status_code=404, detail=f"Place '{req.place_id}' not found")

    raise HTTPException(
        status_code=410,
        detail={
            "message": "TourDesk no longer creates direct bookings. Continue on the official destination portal.",
            "place": place["name"],
            "official_link": place.get("bookingLink") or place.get("officialInfoLink"),
        },
    )


@router.get("")
async def list_bookings() -> list[dict]:
    """Legacy endpoint retained for compatibility; direct booking is disabled."""
    return []
