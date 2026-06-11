from __future__ import annotations

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ── 1. ROOT & META ENDPOINTS ──────────────────────────────────────────────────

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"

def test_health():
    response = client.get("/api/v1/meta/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_categories():
    response = client.get("/api/v1/meta/categories")
    assert response.status_code == 200
    categories = response.json()
    assert isinstance(categories, list)
    assert len(categories) > 0
    assert categories[0]["id"] == "all"

# ── 2. CITIES ENDPOINT ────────────────────────────────────────────────────────

def test_list_cities():
    response = client.get("/api/v1/cities")
    assert response.status_code == 200
    cities = response.json()
    assert isinstance(cities, list)
    assert any(c["id"] == "hyderabad" for c in cities)

# ── 3. PLACES ENDPOINT ────────────────────────────────────────────────────────

def test_list_places():
    # Valid city
    response = client.get("/api/v1/places?city=hyderabad")
    assert response.status_code == 200
    places = response.json()
    assert isinstance(places, list)
    assert len(places) > 0

    # Invalid city
    response = client.get("/api/v1/places?city=nonexistent")
    assert response.status_code == 404

def test_list_places_filters():
    # Category filter
    response = client.get("/api/v1/places?city=hyderabad&category=historical")
    assert response.status_code == 200
    places = response.json()
    assert all(p["category"] == "historical" for p in places)

    # Search filter
    response = client.get("/api/v1/places?city=hyderabad&search=charminar")
    assert response.status_code == 200
    places = response.json()
    assert any("charminar" in p["name"].lower() for p in places)

def test_get_place():
    # Valid place
    response = client.get("/api/v1/places/charminar")
    assert response.status_code == 200
    assert response.json()["name"] == "Charminar"

    # Invalid place
    response = client.get("/api/v1/places/invalidplace123")
    assert response.status_code == 404

# ── 4. BOOKINGS ENDPOINT ──────────────────────────────────────────────────────

def test_list_bookings():
    response = client.get("/api/v1/bookings")
    assert response.status_code == 200
    assert response.json() == []

def test_create_booking():
    # Valid place, but bookings are disabled (returns 410 Gone)
    payload = {
        "place_id": "charminar",
        "visit_date": "2026-06-15",
        "adults": 2,
        "children": 0,
        "name": "John Doe",
        "phone": "9876543210",
        "email": "john@example.com"
    }
    response = client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 410
    detail = response.json()["detail"]
    assert "no longer creates direct bookings" in detail["message"]
    assert detail["place"] == "Charminar"

    # Invalid place (returns 404 Not Found)
    payload["place_id"] = "invalid_id"
    response = client.post("/api/v1/bookings", json=payload)
    assert response.status_code == 404

# ── 5. AI CHAT PROXY ENDPOINT ─────────────────────────────────────────────────

@patch("httpx.AsyncClient.post")
def test_ai_chat_ollama(mock_post):
    # Mock Ollama success response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "message": {"content": "Hello from local Llama!"}
    }
    mock_post.return_value = mock_response

    payload = {
        "provider": "ollama",
        "model": "llama3",
        "endpoint": "http://localhost:11434",
        "messages": [
            {"role": "user", "content": "Hi"}
        ]
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    assert response.json() == {"content": "Hello from local Llama!"}
    mock_post.assert_called_once()

@patch("httpx.AsyncClient.post")
def test_ai_chat_openai(mock_post):
    # Mock OpenAI success response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [{"message": {"content": "Hello from OpenAI!"}}]
    }
    mock_post.return_value = mock_response

    payload = {
        "provider": "openai",
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "user", "content": "Hi"}
        ]
    }
    # Call without API key (Authorization header) -> should fail
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 400
    assert "API key required" in response.json()["detail"]

    # Call with API key -> should succeed
    response = client.post(
        "/api/v1/ai/chat",
        json=payload,
        headers={"Authorization": "Bearer sk-test-key"}
    )
    assert response.status_code == 200
    assert response.json() == {"content": "Hello from OpenAI!"}

@patch("httpx.AsyncClient.post")
def test_ai_chat_gemini(mock_post):
    # Mock Gemini success response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "Hello from Gemini!"}]}}]
    }
    mock_post.return_value = mock_response

    payload = {
        "provider": "gemini",
        "model": "gemini-1.5-flash",
        "messages": [
            {"role": "user", "content": "Hi"}
        ]
    }
    # Call without API key -> should fail
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 400

    # Call with API key -> should succeed
    response = client.post(
        "/api/v1/ai/chat",
        json=payload,
        headers={"Authorization": "Bearer gemini-test-key"}
    )
    assert response.status_code == 200
    assert response.json() == {"content": "Hello from Gemini!"}

def test_ai_chat_unsupported_provider():
    payload = {
        "provider": "unsupported_llm",
        "model": "model-x",
        "messages": [{"role": "user", "content": "Hi"}]
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 400
    assert "Unsupported AI provider" in response.json()["detail"]

@patch("httpx.AsyncClient.post")
def test_ai_chat_error_handling(mock_post):
    # Mock connection failure or HTTP error
    mock_post.side_effect = Exception("Connection refused")

    payload = {
        "provider": "ollama",
        "model": "llama3",
        "messages": [{"role": "user", "content": "Hi"}]
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 500
    assert "Ollama error" in response.json()["detail"]
