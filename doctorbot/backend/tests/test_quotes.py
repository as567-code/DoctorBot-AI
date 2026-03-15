import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_quote_returns_quote_and_doctor():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/quote")
    assert response.status_code == 200
    data = response.json()
    assert "quote" in data
    assert "doctor" in data
    assert len(data["quote"]) > 0
    assert len(data["doctor"]) > 0

@pytest.mark.asyncio
async def test_quote_randomness():
    transport = ASGITransport(app=app)
    quotes = set()
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        for _ in range(20):
            response = await client.get("/api/quote")
            quotes.add(response.json()["quote"])
    assert len(quotes) >= 2
