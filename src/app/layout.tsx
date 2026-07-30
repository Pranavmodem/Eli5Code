import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SyncProvider from "@/components/SyncProvider";
import AskAI from "@/components/AskAI";

export const metadata: Metadata = {
  title: "Zero to Hero — Interactive Coding Bootcamp",
  description:
    "Master OOP, Data Structures, Algorithms & Big O in 60 days with ELI5 analogies and interactive visualizations. 2 hours a day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <SyncProvider>
          <NavBar />
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">{children}</main>
          <AskAI />
          <footer className="border-t border-ink-700/60 py-8 text-center text-xs text-slate-500">
            Zero to Hero Bootcamp · 2 hrs/day · 60 days · Built for visual learners
          </footer>
        </SyncProvider>
      </body>
    </html>
  );
}
