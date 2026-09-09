import httpx

GENRE_TERMS = {
    "Pop": "pop",
    "Dance": "dance pop",
    "Rock": "rock",
    "Alternative": "alternative",
    "Acoustic": "acoustic",
    "Chill": "chill",
    "Instrumental": "instrumental",
}

async def search_itunes(terms: list[str], language: str = "Any", limit: int = 24):
    parts = [GENRE_TERMS.get(t, t) for t in terms]
    query = " ".join(parts) if parts else "music"

    if language == "Hindi":
        query += " hindi"
    elif language == "Kannada":
        query += " kannada"

    url = "https://itunes.apple.com/search"
    params = {
        "term": query,
        "media": "music",
        "entity": "song",
        "limit": min(limit, 50),
        "country": "IN",
        "explicit": "No",
    }

    async with httpx.AsyncClient(timeout=12) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    tracks = []
    for item in data.get("results", []):
        tracks.append({
            "id": str(item.get("trackId")),
            "name": item.get("trackName", "Unknown Track"),
            "artist": item.get("artistName", "Unknown Artist"),
            "album": item.get("collectionName"),
            "artwork_url": item.get("artworkUrl100"),
            "preview_url": item.get("previewUrl"),
            "store_url": item.get("trackViewUrl") or item.get("collectionViewUrl"),
            "duration_ms": item.get("trackTimeMillis"),
            "genre": item.get("primaryGenreName"),
        })

    return tracks
