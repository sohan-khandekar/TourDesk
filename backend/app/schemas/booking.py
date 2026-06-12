from __future__ import annotations

from datetime import date

from pydantic import BaseModel, EmailStr, Field


class BookingRequest(BaseModel):
    place_id: str
    visit_date: date
    adults: int = Field(ge=1)
    children: int = Field(ge=0, default=0)
    name: str = Field(min_length=2)
    phone: str = Field(min_length=10, max_length=10, pattern=r"^\d{10}$")
    email: EmailStr


class BookingResponse(BaseModel):
    id: str
    place_id: str
    place_name: str
    city: str
    visit_date: str
    adults: int
    children: int
    total: float
    is_free: bool
    name: str
    phone: str
    email: str
    booked_at: str
