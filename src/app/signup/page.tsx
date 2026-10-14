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
        <section className="lgc-signin__card" aria-label="Εγγραφή">
          <div className="lgc-signin__logoWrap">
            <img
              className="lgc-signin__brandLogo"
              src="/ClinicScribe-logo.svg"
              alt="ClinicScribe"
              loading="eager"
            />
          </div>

          <h1 className="lgc-signin__title">Εγγραφή</h1>

          <form className="lgc-signin__form" onSubmit={(e) => e.preventDefault()}>
            <label className="lgc-signin__field">
              <input
                className="lgc-signin__input"
                type="text"
                name="firstName"
                placeholder="Όνομα"
                autoComplete="given-name"
              />
            </label>

            <label className="lgc-signin__field">
              <input
                className="lgc-signin__input"
                type="text"
                name="lastName"
                placeholder="Επώνυμο"
                autoComplete="family-name"
              />
            </label>

            <label className="lgc-signin__field">
              <input
                className="lgc-signin__input"
                type="text"
                name="specialty"
                placeholder="Ειδικότητα"
                autoComplete="organization-title"
              />
            </label>

            <label className="lgc-signin__field">
              <input
                className="lgc-signin__input"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
              />
            </label>

            <label className="lgc-signin__field">
              <div className="lgc-signin__passwordRow">
                <input
                  className="lgc-signin__input lgc-signin__input--password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Κωδικός"
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
                  placeholder="Επιβεβαίωση κωδικού"
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

            <label className="lgc-signin__consent">
              <input className="lgc-signin__checkbox" type="checkbox" name="consent" />
              <span className="lgc-signin__consentText">
                Αποδέχομαι τους Όρους Χρήσης και την Πολιτική Απορρήτου
              </span>
            </label>

            <button className="lgc-signin__btn" type="submit">
              Εγγραφή
            </button>

            <button className="lgc-signin__btn lgc-signin__btn--ghost" type="button">
              Εγγραφή με Google
            </button>

            <div className="lgc-signin__links">
              <a className="lgc-signin__link" href="/signin">
                Έχεις ήδη λογαριασμό; Σύνδεση
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
