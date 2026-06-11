from __future__ import annotations

from fastapi import APIRouter

from ...core.data_loader import load_cities

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("")
async def list_cities() -> list[dict]:
    return load_cities()
