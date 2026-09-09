from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ai.emotion_model import detect_and_classify

router = APIRouter(prefix="/api/emotion", tags=["emotion"])

@router.post("")
async def emotion(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image.")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image is too large.")
    try:
        return detect_and_classify(data)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=500, detail="Emotion model failed to process the image.")
