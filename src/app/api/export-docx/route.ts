import { NextResponse } from "next/server";
import { AlignmentType, Document, Packer, Paragraph, TextRun } from "docx";

type Body = {
  text?: string;
  fileName?: string;
};

const FONT = "Times New Roman";

const SECTION_TITLE_RE =
  /^(ΣΤΟΙΧΕΙΑ ΑΣΘΕΝΟΥΣ|ΕΞΕΤΑΣΗ|ΤΕΧΝΙΚΗ|ΕΥΡΗΜΑΤΑ|ΣΥΜΠΕΡΑΣΜΑ|ΓΝΩΜΑΤΕΥΣΗ|ΙΣΤΟΡΙΚΟ)(?=$|[\s:])/;

function headerParagraph(
  text: string,
  alignment: (typeof AlignmentType)[keyof typeof AlignmentType],
  after: number
) {
  return new Paragraph({
    alignment,
    spacing: { after },
    children: [new TextRun({ text, bold: true, size: 22, font: FONT })],
  });
}

function signatureParagraph(
  text: string,
  size: number,
  spacing: { before?: number; after: number }
) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing,
    children: [new TextRun({ text, size, font: FONT })],
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const text = (body?.text || "").trim();

    if (!text) {
      return NextResponse.json(
        { error: "Missing 'text' in request body." },
        { status: 400 }
      );
    }

    const lines = text
      .replace(/\*\*/g, "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const bodyParagraphs = (lines.length ? lines : [text.replace(/\*\*/g, "")]).map(
      (line) => {
        const isTitle = SECTION_TITLE_RE.test(line);
        return new Paragraph({
          alignment: isTitle ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
          spacing: { line: 280, after: 160 },
          children: [
            new TextRun({ text: line, size: 24, font: FONT, bold: isTitle }),
          ],
        });
      }
    );

    const doc = new Document({
      styles: {
        default: {
          document: { run: { font: FONT } },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
            },
          },
          children: [
            headerParagraph("ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ", AlignmentType.LEFT, 40),
            headerParagraph("Α’ ΠΕΡΙΦΕΡΕΙΑΚΟ ΣΥΣΤΗΜΑ ΥΓΕΙΑΣ ΑΤΤΙΚΗΣ", AlignmentType.LEFT, 40),
            headerParagraph("ΓΕΝΙΚΟ ΝΟΣΟΚΟΜΕΙΟ ΠΑΙΔΩΝ", AlignmentType.LEFT, 40),
            headerParagraph("« Η  ΑΓΙΑ  ΣΟΦΙΑ »", AlignmentType.LEFT, 240),

            headerParagraph("ΤΜΗΜΑ ΑΠΕΙΚΟΝΙΣΤΙΚΩΝ ΜΕΘΟΔΩΝ", AlignmentType.CENTER, 40),
            headerParagraph("ΑΞΟΝΙΚΗ - ΜΑΓΝΗΤΙΚΗ ΤΟΜΟΓΡΑΦΙΑ", AlignmentType.CENTER, 40),
            headerParagraph(
              "ΣΥΝΤΟΝΙΣΤΡΙΑ ΔΙΕΥΘΥΝΤΡΙΑ: Δρ. ΜΑΡΙΑ Μ. ΓΑΒΡΑ",
              AlignmentType.CENTER,
              400
            ),

            ...bodyParagraphs,

            signatureParagraph("Ο/Η  ΙΑΤΡΟΣ", 24, { before: 480, after: 400 }),
            signatureParagraph("……………………………….", 22, { after: 40 }),
            signatureParagraph("……………………………….", 22, { after: 40 }),
            signatureParagraph("-----------------------   ---------", 22, { after: 120 }),
          ],
        },
      ],
    });

    const buf = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buf);


    const safeName = (body?.fileName || "gnomatefsi")
      .replace(/[^\w\-]+/g, "_")
      .slice(0, 60);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
