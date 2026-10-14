"use client";

import "../signin/signin.css";

export default function Page() {
  return (
    <main className="lgc-signin">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Επαναφορά κωδικού">
          <div className="lgc-signin__logoWrap">
            <img
              className="lgc-signin__brandLogo"
              src="/ClinicScribe-logo.svg"
              alt="ClinicScribe"
              loading="eager"
            />
          </div>

          <h1 className="lgc-signin__title">Επαναφορά κωδικού</h1>

          <form className="lgc-signin__form" onSubmit={(e) => e.preventDefault()}>
            <label className="lgc-signin__field">
              <input
                className="lgc-signin__input"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
              />
            </label>

            <button className="lgc-signin__btn" type="submit">
              Αποστολή συνδέσμου
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
