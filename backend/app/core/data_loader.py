from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent.parent / "data"


@lru_cache(maxsize=1)
def load_places() -> list[dict]:
    path = DATA_DIR / "places.json"
    with path.open(encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def load_cities() -> list[dict]:
    path = DATA_DIR / "cities.json"
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def get_places_by_city(city: str) -> list[dict]:
    return [p for p in load_places() if p["city"] == city.lower()]


def get_place_by_id(place_id: str) -> dict | None:
    return next((p for p in load_places() if p["id"] == place_id), None)


def get_places_by_category(city: str, category: str) -> list[dict]:
    return [p for p in get_places_by_city(city) if p["category"] == category]
