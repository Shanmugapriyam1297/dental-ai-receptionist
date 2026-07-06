"""Backend tests for Smile Dental Clinic API"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://clinic-smile-preview.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---------- Health ----------
def test_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert "Smile" in r.json().get("message", "")


# ---------- Appointments ----------
class TestAppointments:
    def test_create_and_list(self):
        payload = {
            "full_name": "TEST User",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+1 555 000 1234",
            "service": "General Dentistry",
            "preferred_date": "2026-02-15",
            "message": "TEST appointment",
        }
        r = requests.post(f"{API}/appointments", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and data["id"]
        assert "created_at" in data
        assert data["email"] == payload["email"]
        assert data["full_name"] == "TEST User"
        appt_id = data["id"]

        # GET list should include our appointment
        r2 = requests.get(f"{API}/appointments", timeout=15)
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        assert any(a["id"] == appt_id for a in items)

    def test_invalid_email_rejected(self):
        payload = {
            "full_name": "TEST User",
            "email": "not-an-email",
            "phone": "+1 555 000 1234",
            "service": "General Dentistry",
            "preferred_date": "2026-02-15",
        }
        r = requests.post(f"{API}/appointments", json=payload, timeout=15)
        assert r.status_code == 422

    def test_missing_required_fields(self):
        r = requests.post(f"{API}/appointments", json={"full_name": "x"}, timeout=15)
        assert r.status_code == 422


# ---------- Chat SSE ----------
class TestChatStream:
    def test_stream_returns_data_and_done(self):
        payload = {"session_id": f"test-{uuid.uuid4().hex[:8]}", "message": "What are your hours?"}
        with requests.post(f"{API}/chat/stream", json=payload, stream=True, timeout=30) as r:
            assert r.status_code == 200
            ct = r.headers.get("content-type", "")
            assert "text/event-stream" in ct, f"Unexpected content-type: {ct}"

            got_text = False
            got_done = False
            got_error = False
            start = time.time()
            for raw in r.iter_lines(decode_unicode=True):
                if time.time() - start > 25:
                    break
                if not raw:
                    continue
                if raw.startswith("data:"):
                    data = raw[5:].strip()
                    if data == "[DONE]":
                        got_done = True
                        break
                    if data.startswith("[ERROR]"):
                        got_error = True
                        print("Stream error:", data)
                        break
                    if data:
                        got_text = True
            assert not got_error, "Chat stream returned [ERROR]"
            assert got_text, "No text chunks received"
            assert got_done, "No [DONE] terminator received"
