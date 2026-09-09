from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.database.schemas import RegisterRequest, LoginRequest, AuthResponse
from app.auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=req.email, password_hash=hash_password(req.password), name=req.name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_token(user.id), "user_id": user.id, "name": user.name}

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"token": create_token(user.id), "user_id": user.id, "name": user.name}
