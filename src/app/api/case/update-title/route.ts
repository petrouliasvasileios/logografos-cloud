import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type UpdateTitleBody = {
  caseId: number | string;
  newTitle: string;
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Create Supabase client with auth token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Verify user session
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as UpdateTitleBody;
    const { caseId, newTitle } = body;

    if (!caseId || !newTitle?.trim()) {
      return NextResponse.json(
        { error: "Missing caseId or newTitle" },
        { status: 400 }
      );
    }

    const trimmedTitle = newTitle.trim().substring(0, 80);

    // Update case title (verify ownership by checking user_id)
    const { data, error } = await supabase
      .from("cases")
      .update({ title: trimmedTitle })
      .eq("id", parseInt(String(caseId)))
      .eq("user_id", userData.user.id) // Ensure ownership
      .select("id, title, patient_name, created_at")
      .single();

    if (error) {
      console.error("Error updating case:", error);
      return NextResponse.json(
        { error: "Failed to update case" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Case not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      case: data,
    });
  } catch (e: any) {
    console.error("Error in update-title:", e);
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
