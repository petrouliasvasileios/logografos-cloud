"use client";

import "./signin.css";
import { useState } from "react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

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
