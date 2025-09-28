from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import SessionLocal
from backend.models import DailyLog 
from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from fastapi.responses import StreamingResponse
from backend.chat import stream_gemini 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from datetime import date, timedelta

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(title="Health Tracker + Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB session dependency
async def get_db():
    async with SessionLocal() as session:
        yield session

# Schemas
class DailyLogIn(BaseModel):
    user_id: str
    date: date
    on_period: bool
    mood: str
    symptoms: Optional[List[str]] = []
    notes: Optional[str] = None

# Routes
@app.post("/log/daily")
async def log_daily(entry: DailyLogIn, db: AsyncSession = Depends(get_db)):
    # Check if a log already exists for the user and date
    result = await db.execute(
        select(DailyLog).where(DailyLog.user_id == entry.user_id, DailyLog.date == entry.date)
    )
    existing_log = result.scalars().first()
    if existing_log:
        # Update existing log
        existing_log.on_period = entry.on_period
        existing_log.mood = entry.mood
        existing_log.symptoms = ",".join(entry.symptoms) if entry.symptoms else None
        existing_log.notes = entry.notes
    else:
        # Create new log
        new_log = DailyLog(
            user_id=entry.user_id,
            date=entry.date,
            on_period=entry.on_period,
            mood=entry.mood,
            symptoms=",".join(entry.symptoms) if entry.symptoms else None,
            notes=entry.notes
        )
        db.add(new_log)
    await db.commit()
    return {"message": "Daily log saved"}

@app.get("/logs/daily/{user_id}")
async def get_daily_logs(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DailyLog).where(DailyLog.user_id == user_id))
    logs = result.scalars().all()
    return jsonable_encoder(logs)

# Chat endpoint with latest daily log context
class ChatRequest(BaseModel):
    user_id: str
    message: str


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    # Fetch all daily logs for user, most recent first
    result = await db.execute(
        select(DailyLog)
        .where(DailyLog.user_id == req.user_id)
        .order_by(DailyLog.date.desc())
    )
    logs = result.scalars().all()

    context = ""
    today_str = date.today().isoformat()

    if logs:
        # Last log info
        last_log = logs[0]
        context += f"Date of last log: {last_log.date}\n"
        context += f"User was {'on' if last_log.on_period else 'not on'} their period.\n"
        context += f"Mood: {last_log.mood}\n"
        if last_log.symptoms:
            context += f"Symptoms: {last_log.symptoms}\n"
        if last_log.notes:
            context += f"Notes: {last_log.notes}\n"

        # Find most recent period start
        period_logs = [l for l in logs if l.on_period]
        if period_logs:
            last_period_start = min(period_logs, key=lambda l: l.date).date
            cycle_day = (date.today() - last_period_start).days + 1
            context += f"Last period started on: {last_period_start} (today is cycle day {cycle_day})\n"
        else:
            context += "No period recorded yet.\n"

    context += f"Today's date: {today_str}\n"

    prompt = f"""
    You are a friendly health assistant.
    Here is the user's recent history:
    {context}

    Answer empathetically and give advice or reminders based on their mood, period status, and cycle day.
    User question: {req.message}
    """

    return StreamingResponse(stream_gemini(prompt), media_type="text/plain")
