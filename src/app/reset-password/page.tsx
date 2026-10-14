"use client";

import "../signin/signin.css";
import { useState } from "react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="lgc-signin">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Ορισμός νέου κωδικού">
          <div className="lgc-signin__logoWrap">
            <img
              className="lgc-signin__brandLogo"
              src="/ClinicScribe-logo.svg"
              alt="ClinicScribe"
              loading="eager"
            />
          </div>

          <h1 className="lgc-signin__title">Νέος κωδικός</h1>

          <form className="lgc-signin__form" onSubmit={(e) => e.preventDefault()}>
            <label className="lgc-signin__field">
              <div className="lgc-signin__passwordRow">
                <input
                  className="lgc-signin__input lgc-signin__input--password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Νέος κωδικός"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="lgc-signin__eyeBtn"
                  aria-label={showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <label className="lgc-signin__field">
              <div className="lgc-signin__passwordRow">
                <input
                  className="lgc-signin__input lgc-signin__input--password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Επιβεβαίωση νέου κωδικού"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="lgc-signin__eyeBtn"
                  aria-label={
                    showConfirmPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"
                  }
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <button className="lgc-signin__btn" type="submit">
              Αποθήκευση κωδικού
            </button>

            <div className="lgc-signin__links">
              <a className="lgc-signin__link" href="/signin">
                Πίσω στη σύνδεση
              </a>
              <span />
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
