from fastapi import APIRouter, Query
from app.services.music_service import search_itunes

router = APIRouter(prefix="/api/music", tags=["music"])

@router.get("/search")
async def search(
    q: str = Query(min_length=1, max_length=100),
    language: str = "Any",
):
    tracks = await search_itunes([q], language=language)
    return {"tracks": tracks}

@router.get("/recommend")
async def recommend(
    genres: str,
    language: str = "Any",
):
    tracks = await search_itunes(genres.split(","), language=language)
    return {"tracks": tracks}
