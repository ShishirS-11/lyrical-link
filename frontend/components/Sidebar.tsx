"use client";

import Link from "next/link";
import { Home, Compass, Library, LogIn } from "lucide-react";

export default function Sidebar({ active }: { active?: string }) {
  const items = [
    { href: "/", label: "Home", icon: Home, key: "home" },
    { href: "/discover", label: "Discover", icon: Compass, key: "discover" },
    { href: "/library", label: "Library", icon: Library, key: "library" },
    { href: "/login", label: "Login", icon: LogIn, key: "login" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-black/30 p-6 backdrop-blur-xl md:block">
      <Link href="/" className="mb-10 block text-xl font-semibold tracking-tight">Lyrical Link</Link>
      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon, key }) => (
          <Link
            key={key}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              active === key ? "bg-white text-black" : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
