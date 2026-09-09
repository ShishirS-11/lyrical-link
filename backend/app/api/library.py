from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.database.database import get_db
from app.database.models import Favorite, RecentlyPlayed, User
from app.database.schemas import FavoriteRequest, PlayedRequest

router = APIRouter(prefix="/api/library", tags=["library"])

@router.get("/favorites")
def favorites(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Favorite).filter(Favorite.user_id == user.id).all()

@router.post("/favorites")
def add_favorite(req: FavoriteRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exists = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.track_id == req.track.id
    ).first()
    if not exists:
        item = Favorite(
            user_id=user.id,
            track_id=req.track.id,
            track_name=req.track.name,
            artist_name=req.track.artist,
            artwork_url=req.track.artwork_url,
            track_url=req.track.store_url,
        )
        db.add(item)
        db.commit()
    return {"ok": True}

@router.delete("/favorites/{track_id}")
def remove_favorite(track_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Favorite).filter(Favorite.user_id == user.id, Favorite.track_id == track_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"ok": True}

@router.get("/recent")
def recent(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(RecentlyPlayed).filter(
        RecentlyPlayed.user_id == user.id
    ).order_by(RecentlyPlayed.played_at.desc()).limit(30).all()

@router.post("/recent")
def played(req: PlayedRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.add(RecentlyPlayed(
        user_id=user.id,
        track_id=req.track.id,
        track_name=req.track.name,
        artist_name=req.track.artist,
        artwork_url=req.track.artwork_url,
    ))
    db.commit()
    return {"ok": True}
