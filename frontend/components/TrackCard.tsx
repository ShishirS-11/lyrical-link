"use client";

import { Play } from "lucide-react";
import type { Track } from "../lib/api";

export default function TrackCard({ track, onPlay }: { track: Track; onPlay: (track: Track) => void }) {
  return (
    <button onClick={() => onPlay(track)} className="group text-left">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
        {track.artwork_url ? (
          <img src={track.artwork_url} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : null}
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
            <Play size={16} fill="currentColor" />
          </span>
        </div>
      </div>
      <p className="mt-3 truncate text-sm font-medium">{track.name}</p>
      <p className="truncate text-xs text-white/45">{track.artist}</p>
    </button>
  );
}
