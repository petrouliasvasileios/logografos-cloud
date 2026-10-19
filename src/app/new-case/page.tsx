"use client";

import "./new-case.css";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

export default function NewCasePage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [amka, setAmka] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractBirthDateFromAmka = (amkaStr: string): string | null => {
    const cleaned = amkaStr.replace(/\D/g, "");
    if (cleaned.length < 6) return null;
    const dd = cleaned.substring(0, 2);
    const mm = cleaned.substring(2, 4);
    const yy = parseInt(cleaned.substring(4, 6), 10);
    const currentYear = new Date().getFullYear();
    const cutoff = currentYear % 100;
    const yyyy = yy > cutoff ? 1900 + yy : 2000 + yy;
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleCreate = async () => {
    const fName = firstName.trim();
    const lName = lastName.trim();
    const amkaVal = amka.trim();

    if (!fName || !lName || !amkaVal) {
      alert("Παρακαλώ συμπλήρωσε όνομα, επώνυμο και ΑΜΚΑ.");
      return;
    }

    const birthDate = extractBirthDateFromAmka(amkaVal);
    if (!birthDate) {
      alert("Μη έγκυρο ΑΜΚΑ. Πρέπει να έχει τουλάχιστον 6 ψηφία.");
      return;
    }

    setIsLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Δεν είσαι συνδεδεμένος.");

      const { data: newCase, error } = await supabase
        .from("cases")
        .insert([
          {
            user_id: userData.user.id,
            case_type: "general",
            patient_name: `${fName} ${lName}`,
            patient_amka: amkaVal,
            title: `${fName} ${lName}`,
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      router.push(`/app?case=${newCase.id}`);
    } catch (e: any) {
      console.error(e);
      alert("Αποτυχία δημιουργίας γνωμάτευσης. " + (e?.message ? `(${e.message})` : ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nc-page">
      <div className="nc-container">
        <div className="nc-card">
          <h1 className="nc-title">Νέα Γνωμάτευση</h1>

          <div className="nc-form">
            <div className="nc-formGroup">
              <label className="nc-label">Όνομα</label>
              <input
                type="text"
                className="nc-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="π.χ. Γιάννης"
                disabled={isLoading}
              />
            </div>

            <div className="nc-formGroup">
              <label className="nc-label">Επώνυμο</label>
              <input
                type="text"
                className="nc-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="π.χ. Παπαδόπουλος"
                disabled={isLoading}
              />
            </div>

            <div className="nc-formGroup">
              <label className="nc-label">ΑΜΚΑ</label>
              <input
                type="text"
                className="nc-input"
                value={amka}
                onChange={(e) => setAmka(e.target.value)}
                placeholder="π.χ. 05037804696"
                disabled={isLoading}
              />
              <div className="nc-hint">
                Η ημερομηνία γέννησης θα υπολογιστεί αυτόματα από το ΑΜΚΑ.
              </div>
            </div>
          </div>

          <div className="nc-footer">
            <button
              type="button"
              className="nc-btn nc-btn--secondary"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Ακύρωση
            </button>
            <button
              type="button"
              className="nc-btn nc-btn--primary"
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? "Δημιουργία..." : "Δημιουργία"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
