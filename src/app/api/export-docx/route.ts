import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";

type Body = {
  text?: string;
  fileName?: string;
};

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
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.length
            ? lines.map((line) => new Paragraph({ children: [new TextRun(line)] }))
            : [new Paragraph({ children: [new TextRun(text)] })],
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
