import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const cookieStore = cookies();

  const formData = await req.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirmPassword"));
  const fullName = String(formData.get("fullName"));

  // Validate passwords match
  if (password !== confirmPassword) {
    return NextResponse.redirect(
      `${url.origin}/signup?error=passwords_dont_match`,
      { status: 301 }
    );
  }

  console.log(fullName);

  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${url.origin}/auth/callback`,
    },
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  if (user) {
    // Insert the user into the users table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        email: user.email,
        name: fullName,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("Error inserting user:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }
  }

  return NextResponse.redirect(url.origin, { status: 301 });
}
