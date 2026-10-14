"use client";

import "../../signin/signin.css";

export default function Page() {
  return (
    <main className="lgc-signin">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Επιβεβαίωση αποστολής">
          <div className="lgc-signin__logoWrap">
            <img
              className="lgc-signin__brandLogo"
              src="/ClinicScribe-logo.svg"
              alt="ClinicScribe"
              loading="eager"
            />
          </div>

          <h1 className="lgc-signin__title">Ελέγξτε το email σας</h1>

          <div className="lgc-signin__note">
            Αν το email υπάρχει στο σύστημά μας, σας στείλαμε σύνδεσμο επαναφοράς
            κωδικού. Παρακαλούμε ελέγξτε και τον φάκελο ανεπιθύμητης αλληλογραφίας
            (spam).
          </div>

          <div className="lgc-signin__links lgc-signin__links--center">
            <a className="lgc-signin__link" href="/signin">
              Πίσω στη σύνδεση
            </a>
          </div>
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
