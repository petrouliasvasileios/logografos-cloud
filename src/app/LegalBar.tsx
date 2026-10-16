"use client";

import { usePathname } from "next/navigation";

export default function LegalBar() {
  const pathname = usePathname() || "";

  // ΜΗΝ εμφανίζεται μέσα στο /app
  if (pathname === "/app" || pathname.startsWith("/app/")) return null;

  return (
    <footer className="lgc-legalbar" aria-label="Νομικές πληροφορίες">
      <nav className="lgc-legalbar__nav" aria-label="Σύνδεσμοι νομικών κειμένων">
        <a className="lgc-legalbar__link" href="/legal/terms" target="_blank" rel="noreferrer">
          Όροι
        </a>
        <span className="lgc-legalbar__sep">•</span>
        <a className="lgc-legalbar__link" href="/legal/privacy" target="_blank" rel="noreferrer">
          Απόρρητο
        </a>
        <span className="lgc-legalbar__sep">•</span>
        <a className="lgc-legalbar__link" href="/legal/disclaimer" target="_blank" rel="noreferrer">
          Αποποίηση
        </a>
        <span className="lgc-legalbar__sep">•</span>
        <a className="lgc-legalbar__link" href="/legal/ip" target="_blank" rel="noreferrer">
          Πνευματική Ιδιοκτησία
        </a>
      </nav>
    </footer>
  );
}
