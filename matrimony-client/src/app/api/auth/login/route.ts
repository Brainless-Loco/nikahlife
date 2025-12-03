// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UserData {
  userId: string;
  name: string;
  email: string;
  role?: string;
  hasBiodata?: boolean;
  subscriptionType?: string;
  [key: string]: unknown;
}

interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  exp: number;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginCredentials = await req.json();
    const { email, password, rememberMe } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call your backend login endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
      { email, password, rememberMe },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // Check if login was successful
    if (!response.data?.data?.token) {
      return NextResponse.json(
        { error: "Authentication failed: No token received" },
        { status: 401 }
      );
    }

    const { token, ...userData } = response.data.data;

    // Decode JWT to extract user information
    const decoded: DecodedToken = jwtDecode(token);

    const userToStore: UserData = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || userData.role || "user",
      ...userData,
    };
    // // Set cookie expiration (7 days or 30 days based on rememberMe)
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // seconds

    // Create response with user data
    const apiResponse = NextResponse.json({
      success: true,
      data: {
        user: userToStore,
        token: token,
      },
    });

    // Set cookies
    apiResponse.cookies.set("token", token, {
      maxAge,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    apiResponse.cookies.set("user", JSON.stringify(userToStore), {
      maxAge,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    apiResponse.cookies.set("userRole", userToStore.role || "user", {
      maxAge,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    apiResponse.cookies.set(
      "hasBiodata",
      userToStore.hasBiodata ? "true" : "false",
      {
        maxAge,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      }
    );

    apiResponse.cookies.set(
      "subscriptionType",
      userToStore.subscriptionType || "free",
      {
        maxAge,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      }
    );

    return apiResponse;
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle different types of errors
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
