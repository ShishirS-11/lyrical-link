import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyrical Link",
  description: "AI-powered mood-to-music recommendations",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
