"use client";

import "./app.css";
import { useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
};

type CaseItem = {
  id: string;
  patientName: string;
  dateLabel: string;
};

export default function Page() {
  const cases: CaseItem[] = useMemo(
    () => [
      { id: "c1", patientName: "Παπαδόπουλος Γ.", dateLabel: "Σήμερα" },
      { id: "c2", patientName: "Ιωάννου Μ.", dateLabel: "Χθες" },
      { id: "c3", patientName: "Κωνσταντίνου Α.", dateLabel: "12/10" },
      { id: "c4", patientName: "Δημητρίου Ε.", dateLabel: "10/10" },
    ],
    []
  );

  const [activeCaseId, setActiveCaseId] = useState<string>("c1");
  const [input, setInput] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const messages: ChatMessage[] = useMemo(
    () => [
      {
        id: "m1",
        role: "assistant",
        text:
          "Είμαι έτοιμος. Υπαγόρευσε τα στοιχεία/ευρήματα και θα συντάξω ιατρική γνωμάτευση.",
        time: "22:51",
      },
      {
        id: "m2",
        role: "user",
        text:
          "Ασθενής με οσφυαλγία 10 ημερών. Κλινικά: περιορισμός κάμψης, χωρίς νευρολογικό έλλειμμα. Προτείνεται ανάπαυση και αντιφλεγμονώδη.",
        time: "22:52",
      },
      {
        id: "m3",
        role: "assistant",
        text:
          "Θέλεις η γνωμάτευση να είναι για εργασία/άδεια ή καθαρά ιατρική αναφορά; Επίσης, να συμπεριλάβω διάγνωση (ICD-10) ή όχι;",
        time: "22:52",
      },
    ],
    [activeCaseId]
  );

  return (
    <main className="cs-app">
      <div
        className={"cs-app__overlay" + (isSidebarOpen ? " is-open" : "")}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={"cs-app__sidebar" + (isSidebarOpen ? " is-open" : "")}
        aria-label="Πλευρικό μενού"
      >
        <div className="cs-app__brand">
          <img
            className="cs-app__brandLogo"
            src="/ClinicScribe-logo.svg"
            alt="ClinicScribe"
            loading="eager"
          />
        </div>

        <button className="cs-app__newBtn" type="button">
          + Νέα γνωμάτευση
        </button>

        <div className="cs-app__sectionTitle">Ιστορικό</div>

        <nav className="cs-app__caseList" aria-label="Ιστορικό γνωματεύσεων">
          {cases.map((c) => (
            <button
              key={c.id}
              type="button"
              className={
                "cs-app__caseItem" + (c.id === activeCaseId ? " is-active" : "")
              }
              onClick={() => {
                setActiveCaseId(c.id);
                setIsSidebarOpen(false);
              }}
            >
              <div className="cs-app__caseName">{c.patientName}</div>
              <div className="cs-app__caseMeta">{c.dateLabel}</div>
            </button>
          ))}
        </nav>

        <div className="cs-app__sidebarFooter">
          <img
            className="cs-app__netwind"
            src="/logo-2026-netwind.svg"
            alt="NetWind"
            loading="lazy"
          />
        </div>
      </aside>

      <section className="cs-app__main" aria-label="Συνομιλία">
        <header className="cs-app__topbar">
          <div className="cs-app__topbarLeft">
            <button
              className="cs-app__hamburger"
              type="button"
              aria-label="Άνοιγμα μενού"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="cs-app__topbarTitle">ClinicScribe</div>
          </div>

          <div className="cs-app__topbarActions">
            <button className="cs-app__topBtn" type="button">
              Εξαγωγή Word
            </button>
            <button className="cs-app__topBtn cs-app__topBtn--ghost" type="button">
              Ρυθμίσεις
            </button>
          </div>
        </header>

        <div className="cs-app__chat">
          <div className="cs-app__chatInner">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  "cs-app__msgRow " + (m.role === "user" ? "is-user" : "is-assistant")
                }
              >
                <div className="cs-app__bubble">
                  <div className="cs-app__bubbleText">{m.text}</div>
                  <div className="cs-app__bubbleMeta">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cs-app__composer" aria-label="Σύνταξη μηνύματος">
          <div className="cs-app__composerInner">
            <button className="cs-app__iconBtn" type="button" aria-label="Ηχογράφηση">
              🎙
            </button>

            <textarea
              className="cs-app__input"
              placeholder="Γράψε ή υπαγόρευσε…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
            />

            <button className="cs-app__sendBtn" type="button" aria-label="Αποστολή">
              ➤
            </button>
          </div>

          <div className="cs-app__hint">
            Το ClinicScribe βοηθά στη σύνταξη κειμένου. Ο ιατρός ελέγχει και υπογράφει.
          </div>
        </div>
      </section>
    </main>
  );
}
