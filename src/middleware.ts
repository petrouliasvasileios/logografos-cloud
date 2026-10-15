import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  // During setup, don't crash if env vars are missing
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;
  const isLoggedIn = !!user;

  // Helper: redirect
  const redirectTo = (toPath: string) => {
    const url = request.nextUrl.clone();
    url.pathname = toPath;
    return NextResponse.redirect(url);
  };

  // If not logged in: protect /app and /pending
  if (!isLoggedIn) {
    if (pathname.startsWith("/app") || pathname === "/pending") {
      return redirectTo("/signin");
    }
    return response;
  }

  // Logged in: fetch access_level from profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("access_level")
    .eq("user_id", user.id)
    .maybeSingle();

  // If profile missing (edge case), treat as pending (safe default)
  const accessLevel = profile?.access_level ?? "pending";
  const isActive = accessLevel === "active";

  // If user is pending/blocked: keep them out of /app
  if (!isActive) {
    // allow them to see /pending
    if (pathname.startsWith("/app")) return redirectTo("/pending");
    if (pathname === "/signin") return redirectTo("/pending");
    return response;
  }

  // If user is active:
  // - if they try to go to /signin or /pending, send them to /app
  if (pathname === "/signin" || pathname === "/pending") {
    return redirectTo("/app");
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/signin", "/pending"],
};
