"use client";

import "./account.css";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

type ProfileRow = {
  user_id: string;
  access_level: string;
  full_name: string | null;
  specialty: string | null;
  phone: string | null;
};

export default function Page() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setStatus("loading");

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        router.push("/signin");
        return;
      }

      const meta: any = user.user_metadata ?? {};
      const googleName = (meta?.full_name ?? meta?.name ?? "").toString();

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, access_level, full_name, specialty, phone")
        .eq("user_id", user.id)
        .maybeSingle<ProfileRow>();

      if (!isMounted) return;

      setEmail(user.email ?? "");

      // Prefer saved profile values; fallback to Google name
      setFullName((profile?.full_name ?? googleName ?? "").toString());
      setSpecialty((profile?.specialty ?? "").toString());
      setPhone((profile?.phone ?? "").toString());

      setStatus("idle");
    })();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  const onSave = async () => {
    setStatus("saving");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      router.push("/signin");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        specialty: specialty.trim() || null,
        phone: phone.trim() || null,
      })
      .eq("user_id", user.id);

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1200);
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <main className="cs-account">
      <section className="cs-account__card" aria-label="Λογαριασμός">
        <div className="cs-account__top">
          <h1 className="cs-account__title">Λογαριασμός</h1>

          <div className="cs-account__actions">
            <button className="cs-account__btn cs-account__btn--ghost" type="button" onClick={() => router.push("/app")}>
              Πίσω
            </button>
            <button className="cs-account__btn" type="button" onClick={onSave} disabled={status === "saving" || status === "loading"}>
              {status === "saving" ? "Αποθήκευση…" : "Αποθήκευση"}
            </button>
            <button className="cs-account__btn cs-account__btn--danger" type="button" onClick={onLogout}>
              Αποσύνδεση
            </button>
          </div>
        </div>

        <div className="cs-account__grid">
          <div className="cs-account__field">
            <label>Email (μόνο ανάγνωση)</label>
            <input className="cs-account__input" value={email} readOnly />
          </div>

          <div className="cs-account__field">
            <label>Ονοματεπώνυμο</label>
            <input className="cs-account__input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="cs-account__field">
            <label>Ειδικότητα</label>
            <input className="cs-account__input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="π.χ. Ορθοπαιδικός" />
          </div>

          <div className="cs-account__field">
            <label>Τηλέφωνο</label>
            <input className="cs-account__input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="π.χ. +30 69…" />
          </div>
        </div>

        <div className="cs-account__hint">
          Τα στοιχεία αυτά χρησιμοποιούνται για την εξατομίκευση της εφαρμογής και (αργότερα) για πρότυπα/εξαγωγές εγγράφων.
        </div>
      </section>
    </main>
  );
}
