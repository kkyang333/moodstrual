from sqlalchemy import Column, Integer, String, Boolean, Date
from backend.database import Base

class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    date = Column(Date, index=True)
    on_period = Column(Boolean, default=False)
    mood = Column(String)
    symptoms = Column(String, nullable=True)  # comma-separated
    notes = Column(String, nullable=True)
