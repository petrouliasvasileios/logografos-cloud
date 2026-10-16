import "../legal.css";

export const metadata = {
  title: "Πολιτική Απορρήτου | ClinicScribe",
};

export default function PrivacyPage() {
  return (
    <main className="lgc-signin lgc-legal">
      <div className="lgc-signin__bg" />

      <div className="lgc-signin__wrap">
        {/* Προαιρετικά: βάλε εδώ το ίδιο brand logo component/img που έχεις στο /signin */}
        {/* <img className="lgc-signin__brandLogo" src="/clinicscribe-logo.svg" alt="ClinicScribe" /> */}

        <section className="lgc-signin__card" aria-label="Πολιτική Απορρήτου">
          <div className="lgc-signin__logoWrap">
  <img
    className="lgc-signin__brandLogo"
    src="/ClinicScribe-logo.svg"
    alt="ClinicScribe"
    loading="eager"
  />
</div>

<h1 className="lgc-legal__title">Πολιτική Απορρήτου</h1>
          <p className="lgc-legal__meta">Τελευταία ενημέρωση: 16/10/2026</p>

          <div className="lgc-legal__content">
            <p>
              Η παρούσα Πολιτική Απορρήτου περιγράφει πώς το ClinicScribe συλλέγει,
              χρησιμοποιεί και προστατεύει τα προσωπικά δεδομένα όταν χρησιμοποιείτε
              την υπηρεσία.
            </p>

            <h2>1. Υπεύθυνος Επεξεργασίας</h2>
            <p>
              Υπεύθυνος επεξεργασίας: ClinicScribe (στοιχεία επικοινωνίας όπως
              εμφανίζονται στην εφαρμογή/σελίδα αναμονής).
            </p>

            <h2>2. Δεδομένα που συλλέγουμε</h2>
            <ul>
              <li>Στοιχεία λογαριασμού (π.χ. email, όνομα, ειδικότητα, τηλέφωνο).</li>
              <li>Δεδομένα χρήσης (τεχνικά logs για ασφάλεια/λειτουργία).</li>
              <li>
                Περιεχόμενο που εισάγετε στην εφαρμογή (π.χ. κείμενα για παραγωγή
                εγγράφων), στο βαθμό που απαιτείται για την παροχή της υπηρεσίας.
              </li>
            </ul>

            <h2>3. Σκοποί επεξεργασίας</h2>
            <ul>
              <li>Παροχή και λειτουργία της υπηρεσίας.</li>
              <li>Ασφάλεια, πρόληψη κατάχρησης και τεχνική υποστήριξη.</li>
              <li>Βελτίωση εμπειρίας χρήσης και ποιότητας υπηρεσίας.</li>
            </ul>

            <h2>4. Νομική βάση</h2>
            <ul>
              <li>Εκτέλεση σύμβασης (παροχή υπηρεσίας).</li>
              <li>Έννομο συμφέρον (ασφάλεια, πρόληψη απάτης, βελτιστοποίηση).</li>
              <li>Συμμόρφωση με νομικές υποχρεώσεις όπου απαιτείται.</li>
            </ul>

            <h2>5. Διαβιβάσεις & τρίτοι πάροχοι</h2>
            <p>
              Ενδέχεται να χρησιμοποιούνται τρίτοι πάροχοι υποδομών (π.χ. hosting,
              authentication, email) αποκλειστικά για την παροχή της υπηρεσίας.
            </p>

            <h2>6. Ασφάλεια</h2>
            <p>
              Λαμβάνουμε τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων.
              Παρόλα αυτά, καμία μέθοδος μετάδοσης/αποθήκευσης δεν είναι 100% ασφαλής.
            </p>

            <h2>7. Δικαιώματα υποκειμένων</h2>
            <ul>
              <li>Πρόσβαση, διόρθωση, διαγραφή, περιορισμός.</li>
              <li>Εναντίωση όπου εφαρμόζεται.</li>
              <li>Φορητότητα δεδομένων όπου εφαρμόζεται.</li>
            </ul>

            <h2>8. Επικοινωνία</h2>
            <p>
              Για αιτήματα σχετικά με προσωπικά δεδομένα, επικοινωνήστε μέσω των
              στοιχείων επικοινωνίας που παρέχονται στην εφαρμογή.
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
