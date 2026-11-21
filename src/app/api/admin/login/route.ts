import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@yogitasbeauty.com";
    const expectedPassword = process.env.ADMIN_DEFAULT_PASSWORD || "YogitaLuxury@2025";

    if (email?.trim().toLowerCase() === expectedEmail.toLowerCase() && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
        user: { email: expectedEmail, role: "admin", name: "Yogita Salon Administrator" },
      });

      // Set auth cookie
      response.cookies.set("yogita_admin_session", "authenticated_token_active", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid administrator email or password." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal authentication error" },
      { status: 500 }
    );
  }
}

