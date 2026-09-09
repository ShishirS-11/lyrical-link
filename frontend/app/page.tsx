"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MiniPlayer from "../components/MiniPlayer";
import TrackCard from "../components/TrackCard";
import { recommend, Track, searchMusic } from "../lib/api";
import Link from "next/link";

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [player, setPlayer] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    recommend(["Pop", "Dance"], "Any").then(r => setTracks(r.tracks)).catch(console.error);
  }, []);

  function play(track: Track) {
    audio?.pause();
    if (!track.preview_url) {
      if (track.store_url) window.open(track.store_url, "_blank");
      return;
    }
    const a = new Audio(track.preview_url);
    a.play().catch(console.error);
    setAudio(a);
    setPlayer(track);
    setPlaying(true);
    a.onended = () => setPlaying(false);
  }

  function toggle() {
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(console.error);
    }
  }

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    const r = await searchMusic(search);
    setTracks(r.tracks);
  }

  return (
    <main className="min-h-screen apple-gradient pb-28">
      <Sidebar active="home" />
      <div className="md:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-black/35 px-5 py-4 backdrop-blur-xl md:px-10">
          <div className="font-semibold md:hidden">Lyrical Link</div>
          <form onSubmit={doSearch} className="ml-auto flex w-full max-w-md items-center gap-2 rounded-full bg-white/7 px-4 py-2">
            <Search size={17} className="text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search songs, artists..." className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
          </form>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[.025] p-8 md:p-14">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-2 text-sm text-white/55"><Sparkles size={16} /> AI Mood Discovery</div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Music that understands your moment.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                Take a picture, answer a few questions, and let Lyrical Link build a listening mood around you.
              </p>
              <Link href="/discover" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]">
                Discover My Mood <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Made For You</h2>
                <p className="mt-1 text-sm text-white/40">Real music from the iTunes catalog</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {tracks.slice(0, 12).map(t => <TrackCard key={t.id} track={t} onPlay={play} />)}
            </div>
          </section>
        </div>
      </div>
      <MiniPlayer track={player} playing={playing} onToggle={toggle} />
    </main>
  );
}
