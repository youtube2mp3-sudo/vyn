import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Continue to next middleware or route
  return NextResponse.next();
}
