import os
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./safeplate.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, default="demo_user")
    meal_description = Column(Text)
    mood_rating = Column(Integer)
    energy_level = Column(Integer)
    personal_notes = Column(Text)
    risk_level = Column(String)
    detected_flags = Column(Text)
    ai_explanation = Column(Text)
    support_message = Column(Text)
    created_at = Column(DateTime, default=func.now())


class Settings(Base):
    __tablename__ = "settings"
    user_id = Column(String, primary_key=True, default="demo_user")
    first_name = Column(String)
    trusted_contact_email = Column(String)
    trusted_contact_name = Column(String)
    alerts_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class AlertSent(Base):
    __tablename__ = "alerts_sent"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String)
    trigger_reason = Column(String)
    sent_at = Column(DateTime, default=func.now())


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
