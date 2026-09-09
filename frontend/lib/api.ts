const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Track = {
  id: string;
  name: string;
  artist: string;
  album?: string;
  artwork_url?: string;
  preview_url?: string;
  store_url?: string;
  duration_ms?: number;
  genre?: string;
};

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export async function detectEmotion(blob: Blob) {
  const form = new FormData();
  form.append("file", blob, "mood.jpg");
  return request("/api/emotion", { method: "POST", body: form });
}

export async function getNextQuestion(emotion: string, confidence: number, answers: Record<string, string>) {
  return request("/api/mood/next-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emotion, confidence, previous_answers: answers })
  });
}

export async function decideMood(emotion: string, confidence: number, answers: Record<string, string>) {
  return request("/api/mood/decide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emotion, confidence, answers })
  });
}

export async function recommend(genres: string[], language: string): Promise<{tracks: Track[]}> {
  return request(`/api/music/recommend?genres=${encodeURIComponent(genres.join(","))}&language=${encodeURIComponent(language)}`);
}

export async function searchMusic(q: string, language = "Any"): Promise<{tracks: Track[]}> {
  return request(`/api/music/search?q=${encodeURIComponent(q)}&language=${encodeURIComponent(language)}`);
}

export async function register(name: string, email: string, password: string) {
  return request("/api/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, email, password})
  });
}

export async function login(email: string, password: string) {
  return request("/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
}

export async function saveFavorite(token: string, track: Track) {
  return request("/api/library/favorites", {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify({track})
  });
}

export async function savePlayed(token: string, track: Track) {
  return request("/api/library/recent", {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify({track})
  });
}
