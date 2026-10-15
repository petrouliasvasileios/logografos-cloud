"use client";

import "./app.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

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
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (!isMounted) return;

      const meta: any = u?.user_metadata ?? {};
      setUserEmail(u?.email ?? "");
      setUserName(meta?.full_name ?? meta?.name ?? "");
      setUserAvatarUrl(meta?.avatar_url ?? meta?.picture ?? "");
    })();

    const onDocClick = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => {
      isMounted = false;
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [supabase]);

  const initials = useMemo(() => {
    const base = (userName || userEmail || "U").trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "U";
    const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (a + b).toUpperCase();
  }, [userName, userEmail]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

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

            <button
              className="cs-app__topBtn cs-app__topBtn--ghost"
              type="button"
              onClick={() => router.push("/account")}
            >
              Λογαριασμός
            </button>

            <div className="cs-app__userMenu" ref={userMenuRef}>
              <button
                className="cs-app__avatarBtn"
                type="button"
                aria-label="Μενού χρήστη"
                aria-expanded={isUserMenuOpen ? "true" : "false"}
                onClick={() => setIsUserMenuOpen((v) => !v)}
              >
                {userAvatarUrl ? (
                  <img
                    className="cs-app__avatarImg"
                    src={userAvatarUrl}
                    alt="Φωτογραφία χρήστη"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="cs-app__avatarFallback" aria-hidden="true">
                    {initials}
                  </span>
                )}
              </button>

              <div
                className={
                  "cs-app__userDropdown" + (isUserMenuOpen ? " is-open" : "")
                }
              >
                <button
                  className="cs-app__userDropdownItem"
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/account");
                  }}
                >
                  Λογαριασμός
                </button>

                <button
                  className="cs-app__userDropdownItem cs-app__userDropdownItem--danger"
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Αποσύνδεση
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="cs-app__chat">
          <div className="cs-app__chatInner">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  "cs-app__msgRow " +
                  (m.role === "user" ? "is-user" : "is-assistant")
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
            <button
              className="cs-app__iconBtn"
              type="button"
              aria-label="Ηχογράφηση"
            >
              🎙
            </button>

            <textarea
              className="cs-app__input"
              placeholder="Γράψε ή υπαγόρευσε…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
            />

            <button
              className="cs-app__sendBtn"
              type="button"
              aria-label="Αποστολή"
            >
              ➤
            </button>
          </div>

          <div className="cs-app__hint">
            Το ClinicScribe βοηθά στη σύνταξη κειμένου. Ο ιατρός ελέγχει και
            υπογράφει.
          </div>
        </div>
      </section>
    </main>
  );
}
