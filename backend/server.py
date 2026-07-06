from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ Models ============
class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    service: str
    preferred_date: str
    message: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AppointmentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=6, max_length=30)
    service: str
    preferred_date: str
    message: Optional[str] = ""


class ChatRequest(BaseModel):
    session_id: str
    message: str


# ============ Routes ============
@api_router.get("/")
async def root():
    return {"message": "Smile Dental Clinic API"}


@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(payload: AppointmentCreate):
    appt = Appointment(**payload.model_dump())
    doc = appt.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.appointments.insert_one(doc)
    return appt


@api_router.get("/appointments", response_model=List[Appointment])
async def list_appointments():
    docs = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


SYSTEM_PROMPT = (
    "You are Smile Assistant, the friendly AI concierge for Smile Dental Clinic. "
    "You help visitors with questions about services (general dentistry, cosmetic dentistry, "
    "orthodontics, emergency care, teeth whitening, implants), booking appointments, clinic hours "
    "(Mon-Fri 9am-7pm, Sat 9am-2pm), insurance, and dental care tips. "
    "Keep responses warm, concise (2-4 sentences), and reassuring.\n\n"
    "CONVERSATION FLOW:\n"
    "- If the user just greets you (hi, hello, hey) or asks an open question, warmly ask what they need help with. "
    "Do NOT suggest booking on the first turn unless they mention pain, an issue, or explicitly ask to book.\n"
    "- Only direct users to book when they mention pain, a dental problem, want to schedule, or ask about booking. "
    "In that case include the exact phrase: click the 'Book Appointment' button on this page.\n"
    "- If the user asks about reviews, testimonials, or what other patients think, mention 'our patient reviews' or "
    "'our testimonials section' so they can be pointed there.\n"
    "- If the user describes an emergency, severe pain, trauma, bleeding, or asks for the phone number, say: "
    "please call us at +1 (555) 123-4567.\n"
    "- For general questions (services, hours, insurance, tips), just answer helpfully without pushing any CTA.\n\n"
    "Never provide medical diagnosis. Never invent prices."
)


@api_router.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model("gemini", "gemini-3-flash-preview")

    async def event_generator():
        try:
            async for event in chat.stream_message(UserMessage(text=req.message)):
                if isinstance(event, TextDelta):
                    # SSE data frame
                    yield f"data: {event.content}\n\n"
                elif isinstance(event, StreamDone):
                    yield "data: [DONE]\n\n"
                    break
        except Exception as e:
            logger.exception("Chat stream error")
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
