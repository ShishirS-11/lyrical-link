from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.ai.question_engine import next_question
from app.ai.mood_engine import decide_mood
from app.database.models import MoodSession, QuestionAnswer
from app.database.database import get_db
from app.database.schemas import QuestionFlowRequest, MoodDecisionRequest

router = APIRouter(prefix="/api/mood", tags=["mood"])

@router.post("/next-question")
def question(req: QuestionFlowRequest):
    return {"question": next_question(req.emotion, req.previous_answers)}

@router.post("/decide")
def decide(req: MoodDecisionRequest, db: Session = Depends(get_db)):
    result = decide_mood(req.emotion, req.confidence, req.answers)
    session = MoodSession(
        detected_emotion=req.emotion,
        confidence=req.confidence,
        final_mood=result["mood"],
        energy=result.get("energy", "balanced"),
        language=result.get("language", "Any"),
    )
    db.add(session)
    db.flush()

    for key, value in req.answers.items():
        db.add(QuestionAnswer(session_id=session.id, question=key, answer=value))

    db.commit()
    result["session_id"] = session.id
    return result
