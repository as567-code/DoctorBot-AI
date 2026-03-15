import pytest
import json
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_chat_returns_response_and_mood():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = json.dumps({
        "text": "Allons-y! Great question!",
        "mood": "excited"
    })

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello Doctor",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "Allons-y! Great question!"
    assert data["mood"] == "excited"
    assert "error" not in data

@pytest.mark.asyncio
async def test_chat_handles_non_json_response():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = "Just plain text, no JSON here"

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    data = response.json()
    assert data["response"] == "Just plain text, no JSON here"
    assert data["mood"] == "playful"

@pytest.mark.asyncio
async def test_chat_explain_mode():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = json.dumps({
        "text": "Let me explain...",
        "mood": "excited"
    })

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "explain quantum physics",
                "history": []
            })

    call_args = mock_client.chat.complete_async.call_args
    messages = call_args.kwargs["messages"]
    user_msg = [m for m in messages if m["role"] == "user"][-1]
    assert "Lecture at the Academy" in user_msg["content"]

@pytest.mark.asyncio
async def test_chat_trims_history_to_20():
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = json.dumps({
        "text": "Hello!", "mood": "playful"
    })

    long_history = [
        {"role": "user" if i % 2 == 0 else "doctor", "content": f"msg {i}"}
        for i in range(30)
    ]

    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(return_value=mock_response)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": long_history
            })

    call_args = mock_client.chat.complete_async.call_args
    messages = call_args.kwargs["messages"]
    # system + 20 history + 1 current user = 22
    assert len(messages) == 22

@pytest.mark.asyncio
async def test_chat_handles_api_timeout():
    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        import httpx
        mock_client.chat.complete_async = AsyncMock(side_effect=httpx.TimeoutException("timeout"))
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["error"] == "timeout"
    assert "temporal difficulties" in data["response"]
    assert data["mood"] == "concerned"

@pytest.mark.asyncio
async def test_chat_handles_rate_limit():
    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        from mistralai import models
        error = models.SDKError("rate limit exceeded", status_code=429, body="")
        mock_client.chat.complete_async = AsyncMock(side_effect=error)
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["error"] == "rate_limit"
    assert "timelines" in data["response"]
    assert data["mood"] == "manic"

@pytest.mark.asyncio
async def test_chat_handles_generic_error():
    with patch("routes.chat.get_mistral_client") as mock_client_fn:
        mock_client = AsyncMock()
        mock_client.chat.complete_async = AsyncMock(side_effect=Exception("something broke"))
        mock_client_fn.return_value = mock_client

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/chat", json={
                "message": "Hello",
                "history": []
            })

    assert response.status_code == 200
    data = response.json()
    assert data["error"] == "service_error"
    assert "telepathic circuits" in data["response"]
