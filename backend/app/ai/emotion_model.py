import io
import cv2
import numpy as np
from PIL import Image
from transformers import pipeline
from app.config import settings

_classifier = None
_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def _get_classifier():
    global _classifier
    if _classifier is None:
        _classifier = pipeline("image-classification", model=settings.model_id)
    return _classifier


def detect_and_classify(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
    faces = _face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80)
    )
    if len(faces) == 0:
        raise ValueError("No face detected")

    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    face = image.crop((x, y, x + w, y + h))
    results = _get_classifier()(face)
    best = max(results, key=lambda item: item["score"])
    probabilities = {
        str(item["label"]).lower(): float(item["score"])
        for item in results
    }
    return {
        "emotion": str(best["label"]).lower(),
        "confidence": float(best["score"]),
        "probabilities": probabilities,
    }
