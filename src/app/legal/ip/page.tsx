import "../legal.css";

export const metadata = {
  title: "Πνευματική Ιδιοκτησία | ClinicScribe",
};

export default function IpPage() {
  return (
    <main className="lgc-signin lgc-legal">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Πνευματική Ιδιοκτησία">
          <div className="lgc-signin__logoWrap">
  <img
    className="lgc-signin__brandLogo"
    src="/ClinicScribe-logo.svg"
    alt="ClinicScribe"
    loading="eager"
  />
</div>

<h1 className="lgc-legal__title">Πνευματική Ιδιοκτησία</h1>
          <p className="lgc-legal__meta">Τελευταία ενημέρωση: 16/10/2026</p>

          <div className="lgc-legal__content">
            <p>
              Όλο το λογισμικό, ο σχεδιασμός, τα λογότυπα και το περιεχόμενο που
              παρέχεται από το ClinicScribe προστατεύονται από δικαιώματα πνευματικής
              ιδιοκτησίας.
            </p>

            <h2>1. Δικαιώματα</h2>
            <ul>
              <li>Δεν μεταβιβάζονται δικαιώματα χρήσης πέραν των απολύτως αναγκαίων για την υπηρεσία.</li>
              <li>Απαγορεύεται η αντιγραφή, αναπαραγωγή ή μεταπώληση χωρίς άδεια.</li>
            </ul>

            <h2>2. Περιεχόμενο χρήστη</h2>
            <p>
              Το περιεχόμενο που εισάγετε παραμένει δικό σας. Μας παρέχετε μόνο την
              αναγκαία άδεια επεξεργασίας για να λειτουργεί η υπηρεσία.
            </p>

            <h2>3. Παραβιάσεις</h2>
            <p>
              Αν θεωρείτε ότι παραβιάζονται δικαιώματα, επικοινωνήστε μέσω των στοιχείων της εφαρμογής.
            </p>
          </div>

          <div className="lgc-legal__actions">
            <a className="lgc-legal__backLink" href="/signin">
              Επιστροφή στη σύνδεση
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
