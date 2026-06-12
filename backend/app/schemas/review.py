from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class ReviewRequest(BaseModel):
    place_id: str
    user_name: str = Field(..., min_length=2, max_length=50)
    user_occupation: str = Field(..., min_length=2, max_length=50)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=500)
    email: EmailStr


class ReviewResponse(BaseModel):
    id: str
    place_id: str
    user_name: str
    user_occupation: str
    rating: int
    comment: str
    created_at: str
