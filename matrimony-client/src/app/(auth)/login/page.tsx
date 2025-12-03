"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  // Heart,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { getCookie } from "@/utils/getToken";
import authService from "@/utils/authService";
import { useAuth } from "../context/auth-context";
import Image from "next/image";
import logo from "../../../../public/logo/nikahlife.png";
// import logoWhite from "../../../../public/logo/nikahlife-white.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const { login, clearError } = useAuth();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      // Client-side validation
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Use AuthContext login function - this handles everything
      await login({ email, password, rememberMe });

      // Success toast
      toast.success("Login successful! Redirecting...", {
        position: "top-center",
      });

      // The AuthContext login function automatically updates user state
      // Small delay to ensure state is updated, then redirect
      setTimeout(() => {
        const userRole = getCookie("userRole") || "user";
        const redirectPath = userRole === "admin" ? "/dashboard" : "/";
        router.push(redirectPath);
      }, 100);
      { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    } catch (err: any) {
      const message = err.message || "Login failed. Please try again.";
      toast.error(message, {
        position: "top-center",
      });
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordToggle = () => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  );
  const handleGoogleLogin = () => {
    // Directly hit backend Google auth start
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 flex items-center justify-center px-4">
      {/* Background elements remain unchanged */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl"></div>
        <div className="flex justify-start max-w-6xl mx-auto mt-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group bg-amber-50 ml-4"
              asChild
            >
              <div>
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding (unchanged) */}
        <div className="hidden lg:block space-y-8 text-center lg:text-left px-8">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              
              <div >
                <Image
                  width={200}
                  height={200}
                  src={logo}
                  alt="nikahlife"
                  className="block"
                />
              </div>

              {/* <div >
                <Image
                  width={200}
                  height={200}
                  src={logoWhite}
                  alt="nikahlife"
                  className="hidden dark:block"
                />
              </div> */}
              {/* <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Nikah
                </span>
                <span className="text-sm text-emerald-500/70 font-medium -mt-1">
                  Find Your Perfect Match
                </span>
              </div> */}
            </div>
          </Link>

          {/* Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Welcome Back to
              <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Your Love Journey
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Continue your search for the perfect life partner. Thousands of
              verified profiles are waiting to connect with you.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="space-y-4 pb-8">
              {/* Mobile Logo */}
              <div className="flex lg:hidden items-center justify-center space-x-3 mb-4">
                {/* <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Nikah
                </span> */}
                  <div >
                    <Image
                      width={200}
                      height={200}
                      src={logo}
                      alt="nikahlife"
                      className="block"
                    />
                  </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome Back!
                </h2>
                <p className="text-gray-600">
                  Sign in to continue your journey
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-1 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-5 rounded-xl group cursor-pointer"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Divider */}
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div> */}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 py-3 text-gray-900 border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl transition-all duration-300"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 py-3 border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl text-gray-900 transition-all duration-300"
                      required
                      autoComplete="current-password"
                      minLength={8}
                    />
                    <PasswordToggle />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      className="border-2 border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  {/* <Link
                    href="/forgot-password"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Forgot password?
                  </Link> */}
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-emerald-200 transition-all duration-300 font-semibold py-3 rounded-xl group cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      Sign In to Your Account
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/registration"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your data is protected with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
