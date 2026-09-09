EMOTION_BASE = {
    "happy": "uplifting",
    "joy": "uplifting",
    "sad": "melancholic",
    "angry": "intense",
    "fear": "calm",
    "surprise": "energetic",
    "neutral": "balanced",
    "disgust": "grounded",
}


def decide_mood(emotion: str, confidence: float, answers: dict[str, str]):
    mood = EMOTION_BASE.get(emotion.lower(), "balanced")
    values = " ".join(str(v).lower() for v in answers.values())

    if any(word in values for word in ["calm", "peaceful", "relax", "slow"]):
        mood = "calm"
    elif any(word in values for word in ["energy", "hype", "dance", "workout", "excited"]):
        mood = "energetic"
    elif any(word in values for word in ["focus", "study", "work"]):
        mood = "focused"
    elif any(word in values for word in ["happy", "good", "great", "positive"]):
        mood = "uplifting"
    elif any(word in values for word in ["sad", "down", "lonely", "emotional"]):
        mood = "melancholic"

    return {
        "mood": mood,
        "confidence": round(float(confidence), 4),
        "explanation": f"The mood engine combined the detected emotion ({emotion}) with your answers.",
    }
