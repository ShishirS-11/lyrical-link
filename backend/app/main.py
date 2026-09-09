from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import init_db
from app.api import emotion, mood, music, auth_routes, library

app = FastAPI(title="Lyrical Link API", version="1.0.0")

origins = [x.strip() for x in settings.cors_origins.split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok", "service": "lyrical-link"}

app.include_router(emotion.router)
app.include_router(mood.router)
app.include_router(music.router)
app.include_router(auth_routes.router)
app.include_router(library.router)
