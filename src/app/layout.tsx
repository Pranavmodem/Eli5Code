import type { Metadata } from "next";
import "./design.css";
import "./globals.css";
import NavBar from "@/components/NavBar";
import AuthProvider from "@/components/AuthProvider";
import SyncProvider from "@/components/SyncProvider";
import AskAI from "@/components/AskAI";

export const metadata: Metadata = {
  title: "ELI5Code — Zero / Hero Coding Bootcamp",
  description:
    "60 days, 2 hours a day, 0 to 100% DSA mastery. Every lesson explained like you're five, visualized step by step, and testable in Tech mode.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>
          <SyncProvider>
            <NavBar />
            <main style={{ flex: 1, width: "100%" }}>{children}</main>
            <AskAI />
            <footer
              className="text-muted"
              style={{ borderTop: "1px solid var(--color-divider)", padding: "var(--space-6) var(--space-8)", fontSize: 12, textAlign: "center" }}
            >
              ELI5Code · ZERO / HERO · 60 days — 2 hours a day — 0 to 100%
            </footer>
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
