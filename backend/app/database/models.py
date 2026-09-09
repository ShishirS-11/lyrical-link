from datetime import datetime
from sqlalchemy import String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(120), default="Listener")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class MoodSession(Base):
    __tablename__ = "mood_sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    detected_emotion: Mapped[str] = mapped_column(String(40))
    confidence: Mapped[float] = mapped_column(Float)
    final_mood: Mapped[str] = mapped_column(String(60))
    energy: Mapped[str] = mapped_column(String(30))
    language: Mapped[str] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    answers = relationship("QuestionAnswer", back_populates="session", cascade="all, delete-orphan")

class QuestionAnswer(Base):
    __tablename__ = "question_answers"
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("mood_sessions.id"), index=True)
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)
    session = relationship("MoodSession", back_populates="answers")

class Favorite(Base):
    __tablename__ = "favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    track_id: Mapped[str] = mapped_column(String(100), index=True)
    track_name: Mapped[str] = mapped_column(String(300))
    artist_name: Mapped[str] = mapped_column(String(300))
    artwork_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    track_url: Mapped[str | None] = mapped_column(Text, nullable=True)

class RecentlyPlayed(Base):
    __tablename__ = "recently_played"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    track_id: Mapped[str] = mapped_column(String(100), index=True)
    track_name: Mapped[str] = mapped_column(String(300))
    artist_name: Mapped[str] = mapped_column(String(300))
    artwork_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    played_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
