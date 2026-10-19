import { NextResponse } from "next/server";
import OpenAI from "openai";



type ChatBody = {
  message?: string;
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ChatBody;
    const message = (body?.message || "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' in request body." },
        { status: 400 }
      );
    }

    // Check if user is asking about the creator
    const creatorKeywords = [
      "ποιος σε έφτιαξε",
      "ποιος είναι ο δημιουργός",
      "ποιος σε δημιούργησε",
      "ποιος σε ανέπτυξε",
      "who made you",
      "who created you",
      "who is your creator",
      "δημιουργός",
      "κτίστης",
    ];

    const lowerMessage = message.toLowerCase();
    const isCreatorQuestion = creatorKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    if (isCreatorQuestion) {
      const creatorReply =
        "Το ClinicScribe αναπτύχθηκε από τον Βασίλης Πετρούλιας. Όλα τα πνευματικά δικαιώματα ανήκουν στον Βασίλη Πετρούλια. Για περισσότερες πληροφορίες: Τηλ: 6947930375";
      return NextResponse.json({ reply: creatorReply });
    }

   const client = new OpenAI({ apiKey });

    // Triage: check if question is app-related, case-related, or medical
    const triageResp = await client.responses.create({
      model: "gpt-6.1-sol",
      input: [
        {
          role: "system",
          content:
            "Είσαι ένας ταξινομητής. Απάντησε ΜΟΝΟ με 'ALLOWED' ή 'BLOCKED'. Απάντησε 'ALLOWED' αν η ερώτηση είναι: (1) σχετική με τη χρήση της εφαρμογής (π.χ. 'πώς κάνω εξαγωγή;', 'ποιος είσαι;', 'πώς λειτουργείς;'), (2) σχετική με ασθενή/case (π.χ. ονόματα ασθενών, ημερομηνίες, υπενθυμίσεις), ή (3) ιατρική (γνωματεύσεις, κλινικά ευρήματα, διάγνωση, θεραπεία, συμπτώματα). Απάντησε 'BLOCKED' αν είναι ιστορία, πολιτικά, αθλητικά, τραγούδια, ή άλλα άσχετα.",
        },
        { role: "user", content: message },
      ],
    });

    const triageResult = (triageResp.output_text?.trim() || "").toUpperCase();

    if (triageResult.includes("BLOCKED")) {
      const blockedReply =
        "Το ClinicScribe έχει σχεδιαστεί αποκλειστικά για ιατρικές γνωματεύσεις και βοήθεια στη σύνταξη ιατρικών κειμένων. Δεν μπορώ να απαντήσω σε ερωτήσεις εκτός του σκοπού της εφαρμογής. Παρακαλώ θέσε μια ιατρική ερώτηση, ρώτησε κάτι σχετικό με τη χρήση της εφαρμογής, ή περιέγραψε τα κλινικά ευρήματα.";
      return NextResponse.json({ reply: blockedReply });
    }

    const resp = await client.responses.create({
      model: "gpt-6.1-sol",
      input: [
        {
          role: "system",
          content:
            "Είσαι ο ClinicScribe, βοηθός ιατρού. Απαντάς στα Ελληνικά, με επαγγελματικό ύφος. Ζητάς διευκρινίσεις όταν λείπουν κρίσιμα στοιχεία. Δεν αντικαθιστάς ιατρική κρίση — ο ιατρός ελέγχει και υπογράφει.",
        },
        { role: "user", content: message },
      ],
    });

    const reply =
      resp.output_text?.trim() ||
      "Δεν μπόρεσα να δημιουργήσω απάντηση αυτή τη στιγμή.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    const msg =
      typeof err?.message === "string" ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
