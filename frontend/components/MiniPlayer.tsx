"use client";

import { Pause, Play } from "lucide-react";
import { Track } from "../lib/api";

export default function MiniPlayer({
  track,
  playing,
  onToggle,
}: {
  track: Track | null;
  playing: boolean;
  onToggle: () => void;
}) {
  if (!track) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 px-5 py-4 backdrop-blur-2xl md:pl-72">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        {track.artwork_url ? (
          <img src={track.artwork_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-white/10" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{track.name}</p>
          <p className="truncate text-xs text-white/45">{track.artist}</p>
        </div>
        <button
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </div>
  );
}
