# Lyrical Link

AI-powered mood-to-music web application.

## What it does

1. Captures a photo from the browser.
2. Detects a face and estimates facial emotion with a pretrained open-source facial-emotion model.
3. Runs an adaptive question flow based on the detected emotion.
4. Combines facial emotion + confidence + answers into a music mood.
5. Searches the real iTunes Search API for matching songs.
6. Plays the available promotional preview in the web player and provides a direct Apple Music/iTunes link.
7. Stores mood sessions, favorites, and recently played tracks in PostgreSQL/Neon.

> The free version uses Apple's public iTunes Search API. Apple exposes 30-second promotional previews, not unrestricted full-song streaming. Preview content must be used according to Apple's terms and with appropriate attribution/store links.

## Architecture

- `frontend/`: Next.js + TypeScript + Tailwind CSS
- `backend/`: FastAPI + SQLAlchemy + PostgreSQL + OpenCV + Transformers
- Database: Neon PostgreSQL
- Frontend deployment: Vercel
- Backend: deploy as a normal Python web service (do not deploy the ML service as a Vercel serverless function)

## 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Put your Neon connection string in `.env`:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST/DBNAME?sslmode=require
CORS_ORIGINS=http://localhost:3000
MODEL_ID=dima806/facial_emotions_image_detection
```

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

The first emotion request downloads the pretrained model from Hugging Face. You need internet access on the backend host.

## 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # macOS/Linux
npm run dev
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Open http://localhost:3000.

## Deployment

### Frontend — Vercel

Import the GitHub repository, set the project root to `frontend`, and add:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-DOMAIN
```

### Backend

Deploy `backend` to a Python-compatible host. Set:

```env
DATABASE_URL=your_neon_connection_string
CORS_ORIGINS=https://your-vercel-domain.vercel.app
MODEL_ID=dima806/facial_emotions_image_detection
```

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Important free-tier note

The emotion model is real and pretrained; no paid AI API is required. The iTunes Search API is used for real music catalog data and promotional previews. Full commercial-song playback inside Lyrical Link is intentionally not implemented because free unrestricted streaming is not provided by the iTunes Search API.

## Privacy

The backend processes the captured image in memory for emotion detection and does not save the image to the database or filesystem. Only the resulting emotion/confidence and session answers are persisted.

## Production checklist

- Use HTTPS for camera access.
- Set a strict CORS origin.
- Rotate secrets.
- Add rate limiting.
- Add proper authentication before exposing user-specific data.
- Review the current terms of every third-party music/model service before public/commercial launch.
