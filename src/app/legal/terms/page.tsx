import "../legal.css";

export const metadata = {
  title: "Όροι Χρήσης | ClinicScribe",
};

export default function TermsPage() {
  return (
    <main className="lgc-signin lgc-legal">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        <section className="lgc-signin__card" aria-label="Όροι Χρήσης">
          <div className="lgc-signin__logoWrap">
  <img
    className="lgc-signin__brandLogo"
    src="/ClinicScribe-logo.svg"
    alt="ClinicScribe"
    loading="eager"
  />
</div>

<h1 className="lgc-legal__title">Όροι Χρήσης</h1>
          <p className="lgc-legal__meta">Τελευταία ενημέρωση: 16/10/2026</p>

          <div className="lgc-legal__content">
            <p>
              Με τη χρήση του ClinicScribe αποδέχεστε τους παρόντες Όρους Χρήσης.
              Αν δεν συμφωνείτε, παρακαλούμε μην χρησιμοποιείτε την υπηρεσία.
            </p>

            <h2>1. Περιγραφή υπηρεσίας</h2>
            <p>
              Το ClinicScribe παρέχει εργαλεία υποβοήθησης σύνταξης κειμένων/εγγράφων.
              Ο χρήστης φέρει την αποκλειστική ευθύνη ελέγχου, τελικής διαμόρφωσης και
              υπογραφής οποιουδήποτε εγγράφου.
            </p>

            <h2>2. Επιλεξιμότητα & λογαριασμός</h2>
            <ul>
              <li>Είστε υπεύθυνοι για τη διατήρηση της ασφάλειας των στοιχείων σύνδεσης.</li>
              <li>Απαγορεύεται η μη εξουσιοδοτημένη πρόσβαση ή χρήση.</li>
            </ul>

            <h2>3. Αποδεκτή χρήση</h2>
            <ul>
              <li>Μην ανεβάζετε/εισάγετε παράνομο ή κακόβουλο περιεχόμενο.</li>
              <li>Μην επιχειρείτε να παρακάμψετε μέτρα ασφαλείας.</li>
              <li>Μην χρησιμοποιείτε την υπηρεσία για παραπλανητικούς σκοπούς.</li>
            </ul>

            <h2>4. Περιορισμός ευθύνης</h2>
            <p>
              Η υπηρεσία παρέχεται “ως έχει”. Δεν εγγυόμαστε ότι το παραγόμενο περιεχόμενο
              είναι ακριβές, πλήρες ή κατάλληλο για συγκεκριμένη χρήση. Η τελική ευθύνη
              παραμένει στον χρήστη.
            </p>

            <h2>5. Τροποποιήσεις</h2>
            <p>
              Ενδέχεται να τροποποιούμε την υπηρεσία ή/και τους όρους. Η συνέχιση χρήσης
              μετά από αλλαγές συνιστά αποδοχή.
            </p>

            <h2>6. Επικοινωνία</h2>
            <p>
              Για ερωτήσεις σχετικά με τους όρους, επικοινωνήστε μέσω των στοιχείων της εφαρμογής.
            </p>
          </div>

          <div className="lgc-legal__actions">
            <a className="lgc-legal__backLink" href="/signin">
              Επιστροφή στη σύνδεση
            </a>
          </div>
        </section>

        <footer className="lgc-signin__footer" aria-label="NetWind" />
      </div>
    </main>
  );
}
