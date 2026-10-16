import "../legal.css";

export const metadata = {
  title: "Αποποίηση Ευθύνης | ClinicScribe",
};

export default function DisclaimerPage() {
  return (
    <main className="lgc-signin lgc-legal">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Αποποίηση Ευθύνης">
          <div className="lgc-signin__logoWrap">
  <img
    className="lgc-signin__brandLogo"
    src="/ClinicScribe-logo.svg"
    alt="ClinicScribe"
    loading="eager"
  />
</div>

<h1 className="lgc-legal__title">Αποποίηση Ευθύνης</h1>
          <p className="lgc-legal__meta">Τελευταία ενημέρωση: 16/10/2026</p>

          <div className="lgc-legal__content">
            <p>
              Το ClinicScribe είναι εργαλείο υποβοήθησης. Δεν παρέχει ιατρική συμβουλή,
              διάγνωση ή θεραπεία και δεν υποκαθιστά την επαγγελματική κρίση.
            </p>

            <h2>1. Ευθύνη χρήστη</h2>
            <p>
              Ο χρήστης (επαγγελματίας υγείας) είναι αποκλειστικά υπεύθυνος για:
            </p>
            <ul>
              <li>την ακρίβεια των δεδομένων που εισάγει,</li>
              <li>τον έλεγχο του παραγόμενου κειμένου,</li>
              <li>την τελική υπογραφή/σφράγιση και χρήση του εγγράφου.</li>
            </ul>

            <h2>2. Περιορισμοί AI</h2>
            <p>
              Τα αποτελέσματα μπορεί να περιέχουν σφάλματα ή παραλείψεις. Απαιτείται
              πάντα ανθρώπινος έλεγχος.
            </p>

            <h2>3. Επείγοντα περιστατικά</h2>
            <p>
              Σε επείγουσες καταστάσεις, ακολουθήστε τα καθιερωμένα ιατρικά πρωτόκολλα
              και τις αρμόδιες υπηρεσίες. Μην βασίζεστε στην εφαρμογή.
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
