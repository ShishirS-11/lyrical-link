"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { login, register } from "../../lib/api";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = mode === "login"
        ? await login(email, password)
        : await register(name, email, password);
      localStorage.setItem("lyrical_link_token", result.token);
      localStorage.setItem("lyrical_link_user", JSON.stringify({ id: result.user_id, name: result.name }));
      setMessage(`Welcome, ${result.name}!`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen apple-gradient">
      <Sidebar active="login" />
      <div className="md:ml-64 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[.04] p-8">
          <p className="text-sm text-white/40">Lyrical Link account</p>
          <h1 className="mt-2 text-3xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none" required />}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none" minLength={mode === "register" ? 8 : undefined} required />
            <button disabled={busy} className="w-full rounded-full bg-white px-5 py-3 font-semibold text-black disabled:opacity-50">{busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
          </form>
          {message && <p className="mt-4 text-sm text-white/60">{message}</p>}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-6 text-sm text-white/50 hover:text-white">
            {mode === "login" ? "Need an account? Create one" : "Already have an account? Log in"}
          </button>
          <Link href="/" className="mt-4 block text-sm text-white/30">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
