import { NextResponse } from "next/server";
import OpenAI from "openai";


export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server." },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing audio file (field name: 'file')." },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey });

    const tr = await client.audio.transcriptions.create({
      file,
      model: "gpt-4o-mini-transcribe",
      language: "el",
    });

    const text = (tr.text || "").trim();
    return NextResponse.json({ text });
  } catch (err: any) {
    const msg =
      typeof err?.message === "string" ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
