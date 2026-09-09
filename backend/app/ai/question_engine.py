QUESTION_BANK = {
    "happy": [
        {"id": "energy", "question": "What kind of energy do you want right now?", "options": ["Calm", "Balanced", "High energy"]},
        {"id": "setting", "question": "Where are you listening?", "options": ["Alone", "With friends", "On the move"]},
    ],
    "sad": [
        {"id": "intent", "question": "Do you want music that matches your mood or lifts you up?", "options": ["Match it", "Lift me up"]},
        {"id": "setting", "question": "What fits your moment?", "options": ["Quiet", "Late night", "Reflective"]},
    ],
    "angry": [
        {"id": "release", "question": "What do you need from music?", "options": ["Release", "Focus", "Cool down"]},
        {"id": "energy", "question": "How intense should it feel?", "options": ["Low", "Medium", "Extreme"]},
    ],
    "neutral": [
        {"id": "goal", "question": "What are you doing right now?", "options": ["Relaxing", "Working", "Going out"]},
        {"id": "energy", "question": "How much energy do you want?", "options": ["Calm", "Balanced", "High energy"]},
    ],
}

DEFAULT_QUESTIONS = [
    {"id": "goal", "question": "What do you want the music to do for you?", "options": ["Calm me", "Keep me focused", "Energize me"]},
    {"id": "setting", "question": "What kind of moment is this?", "options": ["Solo", "Social", "On the move"]},
]


def next_question(emotion: str, previous_answers: dict[str, str]):
    questions = QUESTION_BANK.get(emotion.lower(), DEFAULT_QUESTIONS)
    for question in questions:
        if question["id"] not in previous_answers:
            return question
    return None
