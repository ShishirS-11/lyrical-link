"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TrackCard from "../../components/TrackCard";
import type { Track } from "../../lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LibraryPage() {
  const [favorites, setFavorites] = useState<Track[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("lyrical_link_token");
    if (!token) return;
    fetch(`${API}/api/library/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setFavorites(data.map((item: any) => ({
        id: item.track_id,
        name: item.track_name,
        artist: item.artist_name,
        artwork_url: item.artwork_url,
        store_url: item.track_url,
      }))))
      .catch(console.error);
  }, []);

  function play(track: Track) {
    if (track.preview_url) {
      const audio = new Audio(track.preview_url);
      audio.play().catch(console.error);
    } else if (track.store_url) {
      window.open(track.store_url, "_blank");
    }
  }

  return (
    <main className="min-h-screen apple-gradient">
      <Sidebar active="library" />
      <div className="md:ml-64 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold">Your Library</h1>
          <p className="mt-2 text-white/40">Favorites saved to your Lyrical Link account.</p>
          {favorites.length ? (
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {favorites.map(track => <TrackCard key={track.id} track={track} onPlay={play} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.04] p-8 text-white/40">
              Log in and save a track to see it here.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
