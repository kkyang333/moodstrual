# schemas.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

class DailyLogBase(BaseModel):
    user_id: str
    date: date
    on_period: bool
    mood: str
    notes: Optional[str] = None

class DailyLogCreate(DailyLogBase):
    pass

class DailyLogResponse(DailyLogBase):
    id: int

    class Config:
        orm_mode = True
