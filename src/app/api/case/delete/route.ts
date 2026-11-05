import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { NextResponse } from "next/server";

type DeleteCaseBody = {
  caseId: number | string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

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

    if (!Number.isFinite(caseIdNum)) {
      return NextResponse.json({ error: "Invalid caseId" }, { status: 400 });
    }

    // Verify ownership before deleting anything
    const { data: existing, error: lookupError } = await supabase
      .from("cases")
      .select("id")
      .eq("id", caseIdNum)
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (lookupError) {
      console.error("Error looking up case:", lookupError);
      return NextResponse.json(
        { error: "Failed to delete case" },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Case not found or access denied" },
        { status: 404 }
      );
    }

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
      .maybeSingle();

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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
