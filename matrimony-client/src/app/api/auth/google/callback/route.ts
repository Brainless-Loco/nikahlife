// app/api/auth/google/callback/route.ts
// This route receives the token from Google OAuth callback and sets cookies on the client domain

import { NextRequest, NextResponse } from "next/server";

interface UserData {
  userId: string;
  name: string;
  email: string;
  gender?: string;
  role?: string;
  hasBiodata?: boolean;
  subscriptionType?: string;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");
    const userDataEncoded = searchParams.get("user");
    const redirectPath = searchParams.get("redirect") || "/";

    console.log("Google OAuth callback received:", {
      hasToken: !!token,
      hasUserData: !!userDataEncoded,
      redirectPath,
    });

    if (!token) {
      console.error("No token received from Google OAuth");
      return NextResponse.redirect(
        new URL("/login?error=no_token", req.url)
      );
    }

    // Parse user data
    let userData: UserData;
    try {
      userData = JSON.parse(decodeURIComponent(userDataEncoded || "{}"));
    } catch (e) {
      console.error("Failed to parse user data:", e);
      return NextResponse.redirect(
        new URL("/login?error=invalid_user_data", req.url)
      );
    }

    console.log("Parsed user data:", userData);

    // Set cookie expiration (7 days)
    const maxAge = 7 * 24 * 60 * 60; // seconds
    const isProduction = process.env.NODE_ENV === "production";

    // Create redirect response
    const response = NextResponse.redirect(new URL(redirectPath, req.url));

    // Set cookies on the client domain (same origin as the frontend)
    const cookieOptions = {
      maxAge,
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
    };

    // Set token cookie
    response.cookies.set("token", token, cookieOptions);

    // Set user data cookie
    response.cookies.set("user", JSON.stringify(userData), cookieOptions);

    // Set additional cookies for quick access
    response.cookies.set("userRole", userData.role || "user", cookieOptions);
    response.cookies.set(
      "hasBiodata",
      userData.hasBiodata ? "true" : "false",
      cookieOptions
    );
    response.cookies.set(
      "subscriptionType",
      userData.subscriptionType || "free",
      cookieOptions
    );

    console.log("Cookies set successfully, redirecting to:", redirectPath);

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", req.url)
    );
  }
}
