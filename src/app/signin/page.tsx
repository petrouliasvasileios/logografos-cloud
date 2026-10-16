"use client";

import "./signin.css";
import { useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lgc_terms_accepted_v1");
      if (saved === "1") setAcceptedTerms(true);
    } catch {}
  }, []);

  async function handleGoogleSignIn() {
    if (!acceptedTerms) {
      alert("Για να συνεχίσεις, πρέπει να αποδεχτείς τους Όρους Χρήσης και την Πολιτική Απορρήτου.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error.message);
      alert("Σφάλμα σύνδεσης με Google. Δες Console για λεπτομέρειες.");
    }
  }

  return (
    <main className="lgc-signin">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Sign in">
          <div className="lgc-signin__logoWrap">
            <img
              className="lgc-signin__brandLogo"
              src="/ClinicScribe-logo.svg"
              alt="ClinicScribe"
              loading="eager"
            />
          </div>

          <h1 className="lgc-signin__title">Σύνδεση</h1>

          <form className="lgc-signin__form" onSubmit={(e) => e.preventDefault()}>
            <button
              className="lgc-signin__googleBtn"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <span className="lgc-signin__googleIcon" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="18" height="18">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C35.9 2.34 30.3 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.02 6.22C12.5 13.02 17.77 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.7 7.16l7.2 5.58C43.6 37.34 46.5 31.4 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.58 28.56c-.5-1.5-.78-3.1-.78-4.76s.28-3.26.78-4.76l-8.02-6.22C.92 16.36 0 20.07 0 23.8c0 3.73.92 7.44 2.56 10.98l8.02-6.22z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.3 0 11.6-2.08 15.47-5.66l-7.2-5.58c-2 1.35-4.56 2.14-8.27 2.14-6.23 0-11.5-3.52-13.42-8.44l-8.02 6.22C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </span>

              <span className="lgc-signin__googleText">Σύνδεση με Google</span>
            </button>

            <label className="lgc-signin__consent">
              <input
                className="lgc-signin__checkbox"
                type="checkbox"
                name="consent"
                checked={acceptedTerms}
                onChange={(e) => {
                  const v = e.target.checked;
                  setAcceptedTerms(v);
                  try {
                    window.localStorage.setItem("lgc_terms_accepted_v1", v ? "1" : "0");
                  } catch {}
                }}
              />
              <span className="lgc-signin__consentText">
                Αποδέχομαι τους{" "}
                <a className="lgc-signin__link" href="/legal/terms" target="_blank" rel="noreferrer">
                  Όρους Χρήσης
                </a>{" "}
                και την{" "}
                <a className="lgc-signin__link" href="/legal/privacy" target="_blank" rel="noreferrer">
                  Πολιτική Απορρήτου
                </a>
              </span>
            </label>

            <div className="lgc-signin__divider" aria-hidden="true">
              <span className="lgc-signin__dividerLine" />
              <span className="lgc-signin__dividerText">ή</span>
              <span className="lgc-signin__dividerLine" />
            </div>

            <label className="lgc-signin__field">
              <input
                className="lgc-signin__input"
                type="text"
                name="username"
                placeholder="Όνομα χρήστη"
                autoComplete="username"
              />
            </label>

            <label className="lgc-signin__field">
              <div className="lgc-signin__passwordRow">
                <input
                  className="lgc-signin__input lgc-signin__input--password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Κωδικός"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lgc-signin__eyeBtn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <button className="lgc-signin__btn" type="submit">
              Σύνδεση
            </button>

            <div className="lgc-signin__links">
              <a className="lgc-signin__link" href="/forgot-password">
                Ξέχασες τον κωδικό;
              </a>
              <a className="lgc-signin__link" href="/signup">
                Δημιουργία λογαριασμού
              </a>
            </div>
          </form>
        </section>

        <footer className="lgc-signin__footer" aria-label="NetWind">
          <img
            className="lgc-signin__footerLogo"
            src="/logo-2026-netwind.svg"
            alt="NetWind"
            loading="lazy"
          />
        </footer>
      </div>
    </main>
  );
}
