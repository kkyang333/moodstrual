# crud.py
from sqlalchemy.orm import Session
from . import models, schemas

def create_daily_log(db: Session, log: schemas.DailyLogCreate):
    db_log = models.DailyLog(
        user_id=log.user_id,
        date=log.date,
        on_period=log.on_period,
        mood=log.mood,
        notes=log.notes
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_daily_logs(db: Session, user_id: str):
    return db.query(models.DailyLog).filter(models.DailyLog.user_id == user_id).all()

def get_log_by_date(db: Session, user_id: str, date):
    return db.query(models.DailyLog).filter(
        models.DailyLog.user_id == user_id,
        models.DailyLog.date == date
    ).first()
