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

  type DbCase = {
    id: number;
    case_type: string;
    patient_name: string | null;
    patient_amka: string | null;
    patient_phone: string | null;
    title: string;
    created_at: string;
  };

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select("id, case_type, patient_name, patient_amka, patient_phone, title, created_at")
          .order("case_type", { ascending: true }) // general πρώτο
          .order("created_at", { ascending: false }); // μετά ανά ημερομηνία

        if (error) throw error;

        const formatted = (data as DbCase[]).map((c) => ({
          id: String(c.id),
          patientName: c.title || c.patient_name || "Χωρίς όνομα",
          dateLabel: new Date(c.created_at).toLocaleDateString("el-GR"),
        }));

        setCases(formatted);

        // Set active case to general (first one)
        if (formatted.length > 0) {
          setActiveCaseId(formatted[0].id);
        }
      } catch (e: any) {
        console.error("Error loading cases:", e);
      } finally {
        setLoadingCases(false);
      }
    };

    loadCases();
  }, [supabase]);

  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const lastAssistantRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    // Προτεραιότητα: τελευταίο assistant bubble
    if (lastAssistantRef.current) {
      lastAssistantRef.current.scrollIntoView({ behavior, block: "end" });
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  const nowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" });
  };

  const startRecording = async () => {
    if (isRecording || isTranscribing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        // σταμάτα τα tracks για να κλείσει το mic indicator
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        chunksRef.current = [];

        if (blob.size < 1000) return; // πολύ μικρό/άδειο

        setIsTranscribing(true);
        try {
          const fd = new FormData();
          const file = new File([blob], "audio.webm", {
            type: blob.type || "audio/webm",
          });
          fd.append("file", file);

          const r = await fetch("/api/transcribe", { method: "POST", body: fd });
          const data = await r.json();

          if (!r.ok) throw new Error(data?.error || "Σφάλμα μεταγραφής.");

          const t = String(data?.text || "").trim();
          if (t) {
            setInput((prev) => {
              const base = prev.trim();
              return base ? base + " " + t : t;
            });
          }
        } catch (e: any) {
          alert("Αποτυχία μεταγραφής. " + (e?.message ? `(${e.message})` : ""));
        } finally {
          setIsTranscribing(false);
        }
      };

      mr.start();
      setIsRecording(true);
    } catch (e: any) {
      alert("Δεν δόθηκε πρόσβαση στο μικρόφωνο ή δεν υποστηρίζεται. " + (e?.message ? `(${e.message})` : ""));
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    try {
      mediaRecorderRef.current.stop();
    } catch {}
    setIsRecording(false);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages when active case changes
  useEffect(() => {
    if (!activeCaseId) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id, role, text, created_at")
          .eq("case_id", parseInt(activeCaseId))
          .order("created_at", { ascending: true });

        if (error) throw error;

        const formatted = (data as any[]).map((m) => ({
          id: m.id.toString(),
          role: m.role as ChatRole,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString("el-GR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMessages(formatted);
      } catch (e: any) {
        console.error("Error loading messages:", e);
      }
    };

    loadMessages();
  }, [activeCaseId, supabase]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") {
      scrollToBottom("smooth");
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending || !activeCaseId) return;

    setInput("");
    setIsSending(true);

    try {
      // 1) Insert user message to DB
      const { data: userRow, error: userErr } = await supabase
        .from("messages")
        .insert([
          {
            case_id: parseInt(activeCaseId),
            role: "user",
            text,
          },
        ])
        .select("id, role, text, created_at")
        .single();

      if (userErr) throw userErr;

      // Update UI immediately
      setMessages((prev) => [
        ...prev,
        {
          id: userRow.id.toString(),
          role: "user",
          text: userRow.text,
          time: new Date(userRow.created_at).toLocaleTimeString("el-GR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // 2) Call AI
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data?.error || "Σφάλμα επικοινωνίας με τον server.");
      }

      const replyText = String(data?.reply || "").trim();

      // 3) Insert assistant message to DB
      const { data: aRow, error: aErr } = await supabase
        .from("messages")
        .insert([
          {
            case_id: parseInt(activeCaseId),
            role: "assistant",
            text: replyText || "—",
          },
        ])
        .select("id, role, text, created_at")
        .single();

      if (aErr) throw aErr;

      setMessages((prev) => [
        ...prev,
        {
          id: aRow.id.toString(),
          role: "assistant",
          text: aRow.text,
          time: new Date(aRow.created_at).toLocaleTimeString("el-GR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (e: any) {
      console.error(e);
      alert("Σφάλμα αποστολής. " + (e?.message ? `(${e.message})` : ""));
    } finally {
      setIsSending(false);
    }
  };

  const exportWord = async () => {
    if (!activeCaseId) {
      alert("Δεν υπάρχει ενεργό case.");
      return;
    }

    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    const text = (lastAssistant?.text || "").trim();

    if (!text) {
      alert("Δεν υπάρχει απάντηση βοηθού για εξαγωγή.");
      return;
    }

    try {
      const r = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          fileName: "gnomatefsi",
        }),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data?.error || "Αποτυχία δημιουργίας Word.");
      }

      const blob = await r.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "gnomatefsi.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("Δεν μπόρεσα να κατεβάσω Word. " + (e?.message ? `(${e.message})` : ""));
    }
  };

  
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
            <div className="cs-app__topbarTitle">ClinicScribe v2</div>
          </div>

          <div className="cs-app__topbarActions">
            <button className="cs-app__topBtn" type="button" onClick={exportWord}>
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
            {messages.map((m, idx) => {
              const isLast = idx === messages.length - 1;
              const isLastAssistant =
                isLast && m.role === "assistant";

              return (
                <div
                  key={m.id}
                  ref={isLastAssistant ? lastAssistantRef : null}
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
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="cs-app__composer" aria-label="Σύνταξη μηνύματος">
          <div className="cs-app__composerInner">
            <button
  className={
    "cs-app__iconBtn cs-app__micBtn" +
    (isRecording ? " is-recording" : "") +
    (isTranscribing ? " is-transcribing" : "")
  }
  type="button"
  aria-label={
    isTranscribing
      ? "Μεταγραφή σε εξέλιξη"
      : isRecording
      ? "Διακοπή ηχογράφησης"
      : "Έναρξη ηχογράφησης"
  }
  onClick={() => {
    if (isTranscribing) return;
    if (isRecording) stopRecording();
    else startRecording();
  }}
  disabled={isTranscribing}
>
  <svg
    className="cs-app__micIcon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 11a7 7 0 0 1-14 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 18v3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 21h8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>


            <textarea
              className="cs-app__input"
              placeholder="Γράψε ή υπαγόρευσε…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />

            <button
              className="cs-app__sendBtn"
              type="button"
              aria-label="Αποστολή"
              onClick={handleSend}
              disabled={isSending || isTranscribing || !input.trim()}
            >
              {isSending ? "…" : "➤"}
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
