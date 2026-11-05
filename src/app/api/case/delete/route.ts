import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type DeleteCaseBody = {
  caseId: number | string;
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

    const body = (await req.json()) as DeleteCaseBody;
    const { caseId } = body;

    if (!caseId) {
      return NextResponse.json(
        { error: "Missing caseId" },
        { status: 400 }
      );
    }

    const caseIdNum = parseInt(String(caseId));

    // First, delete all messages associated with this case
    const { error: messagesError } = await supabase
      .from("messages")
      .delete()
      .eq("case_id", caseIdNum);

    if (messagesError) {
      console.error("Error deleting messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to delete case messages" },
        { status: 500 }
      );
    }

    // Then delete the case itself (verify ownership)
    const { data, error } = await supabase
      .from("cases")
      .delete()
      .eq("id", caseIdNum)
      .eq("user_id", userData.user.id) // Ensure ownership
      .select("id")
      .single();

    if (error) {
      console.error("Error deleting case:", error);
      return NextResponse.json(
        { error: "Failed to delete case" },
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
      deletedCaseId: data.id,
    });
  } catch (e: any) {
    console.error("Error in delete-case:", e);
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
