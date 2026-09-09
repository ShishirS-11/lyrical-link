"use client";

import { useRef, useState } from "react";
import { Camera, Check, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import TrackCard from "../../components/TrackCard";
import MiniPlayer from "../../components/MiniPlayer";
import { decideMood, detectEmotion, getNextQuestion, recommend, Track } from "../../lib/api";

export default function DiscoverPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mood, setMood] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [player, setPlayer] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    setCameraOn(true);
    requestAnimationFrame(() => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }

  async function capture() {
    if (!videoRef.current) return;
    setLoading(true);
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not capture image")), "image/jpeg", .9));

    try {
      const result = await detectEmotion(blob);
      setEmotion(result.emotion);
      setConfidence(result.confidence);
      const next = await getNextQuestion(result.emotion, result.confidence, {});
      setQuestion(next.question);
    } finally {
      setLoading(false);
    }
  }

  async function answer(value: string) {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    const next = await getNextQuestion(emotion, confidence, nextAnswers);
    if (next.question) setQuestion(next.question);
    else {
      const result = await decideMood(emotion, confidence, nextAnswers);
      setMood(result);
      const music = await recommend(result.genres?.length ? result.genres : ["Pop"], result.language || "Any");
      setTracks(music.tracks);
    }
  }

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

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  return (
    <main className="min-h-screen apple-gradient pb-28">
      <Sidebar active="discover" />
      <div className="md:ml-64 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-sm text-white/50"><Sparkles size={16}/> AI Mood Discovery</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Let your face start the conversation.</h1>
            <p className="mt-3 text-white/45">Capture a moment, answer a few adaptive questions, and get music for the mood you actually want.</p>
          </div>

          {!emotion && (
            <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6 md:p-8">
              <div className="overflow-hidden rounded-2xl bg-black">
                <video ref={videoRef} autoPlay playsInline muted className={`aspect-video w-full object-cover ${cameraOn ? "" : "hidden"}`} />
                {!cameraOn && <div className="flex aspect-video items-center justify-center text-white/30"><Camera size={42}/></div>}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {!cameraOn ? (
                  <button onClick={startCamera} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Enable Camera</button>
                ) : (
                  <>
                    <button onClick={capture} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">
                      {loading ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16}/>} Capture Mood
                    </button>
                    <button onClick={stopCamera} className="rounded-full border border-white/10 px-5 py-3 text-sm">Turn Off</button>
                  </>
                )}
              </div>
            </section>
          )}

          {emotion && !mood && question && (
            <section className="rounded-3xl border border-white/10 bg-white/[.04] p-8">
              <p className="text-sm text-white/45">Detected emotion: <span className="text-white">{emotion}</span> ({Math.round(confidence * 100)}%)</p>
              <h2 className="mt-4 text-2xl font-semibold">{question.question}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(question.options || []).map((option: string) => (
                  <button key={option} onClick={() => answer(option)} className="rounded-2xl border border-white/10 bg-white/[.03] px-4 py-4 text-left transition hover:bg-white/10">
                    <span className="flex items-center justify-between">{option}<ChevronRight size={16}/></span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-white/30"><Check size={13}/> Answers shape the final mood</div>
            </section>
          )}

          {mood && (
            <>
              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[.03] p-8">
                <p className="text-sm uppercase tracking-[.2em] text-white/35">Your listening mood</p>
                <h2 className="mt-3 text-4xl font-semibold capitalize">{mood.mood}</h2>
                <p className="mt-3 max-w-2xl text-white/50">{mood.explanation}</p>
              </section>
              <section className="mt-10">
                <h3 className="text-2xl font-semibold">Your matches</h3>
                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {tracks.map(t => <TrackCard key={t.id} track={t} onPlay={play} />)}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      <MiniPlayer track={player} playing={playing} onToggle={() => {
        if (!audio) return;
        if (playing) { audio.pause(); setPlaying(false); } else { audio.play().then(() => setPlaying(true)).catch(console.error); }
      }}/>
    </main>
  );
}
