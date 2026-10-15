import "./pending.css";

export default function Page() {
  return (
    <main className="lgc-pending">
      <div className="lgc-pending__bg" />

      <div className="lgc-pending__wrap">
        <section className="lgc-pending__card" aria-label="Αναμονή έγκρισης">
          <div className="lgc-pending__logoWrap">
            <img
              className="lgc-pending__brandLogo"
              src="/ClinicScribe-logo.svg"
              alt="ClinicScribe"
              loading="eager"
            />
          </div>

          <h1 className="lgc-pending__title">Αναμονή έγκρισης</h1>

          <p className="lgc-pending__lead">
            Ο λογαριασμός σου είναι σε αναμονή έγκρισης άδειας χρήσης.
            <br />
            Μόλις ενεργοποιηθεί, θα έχεις πρόσβαση στο ClinicScribe.
          </p>

          <div className="lgc-pending__contact" aria-label="Στοιχεία επικοινωνίας">
            <p className="lgc-pending__person">
              Vassilis Petroulias
            </p>
            <p className="lgc-pending__role">
              Creative &amp; Digital Solutions Specialist
            </p>

            <div className="lgc-pending__lines">
              <div>
                M: <a href="tel:+306947930375">+30 694 7930375</a> &nbsp;|&nbsp; E:{" "}
                <a href="mailto:v.petroulias@netwind.gr">v.petroulias@netwind.gr</a>
              </div>

              <div>
                T: <a href="tel:+302110011070">+30 211 0011070</a> &nbsp;|&nbsp;{" "}
                <a href="tel:+302110011071">+30 211 0011071</a>
              </div>

              <div>
                W: <a href="https://www.netwind.gr">www.netwind.gr</a>
              </div>

              <div>
                A: 59-61 Konstantinou Tsaldari Ave, 113 63 Athens, Greece
              </div>

            </div>
          </div>
        </section>

        <footer className="lgc-pending__footer" aria-label="NetWind">
          <img
            className="lgc-pending__footerLogo"
            src="/logo-2026-netwind.svg"
            alt="NetWind"
            loading="lazy"
          />
        </footer>
      </div>
    </main>
  );
}
