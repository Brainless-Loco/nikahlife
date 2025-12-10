"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios, { type AxiosError } from "axios"
import { ArrowLeft, Shield, CheckCircle, RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import type { ApiResponse, OTPArray } from "@/types/otp"

export default function OTPVerify() {
  // State
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email")
  const [emailOtp, setEmailOtp] = useState<OTPArray>(["", "", "", "", "", ""])
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false)
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false)
  const [isVerifyingUser, setIsVerifyingUser] = useState<boolean>(false)
  const [emailVerified, setEmailVerified] = useState<boolean>(false)
  const [userVerified, setUserVerified] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [countdown, setCountdown] = useState<number>(0)
  const [userId, setUserId] = useState<string>("")
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false)
  const [initialOtpSent, setInitialOtpSent] = useState<boolean>(false)

  // Refs
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Effects
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load user info
        const userInfoData = localStorage.getItem("userInfo")
        console.log("Loading userInfo from localStorage:", userInfoData)
        if (userInfoData) {
          const userInfo = JSON.parse(userInfoData)
          setEmail(userInfo.email || "")
          setPhone(userInfo.phone || "")
          setVerificationMethod(userInfo.verificationMethod || "email")
          console.log("[v0] Loaded email:", userInfo.email, "phone:", userInfo.phone, "method:", userInfo.verificationMethod)
        }

        // Load user ID
        const userIdData = localStorage.getItem("userId")
        console.log("Loading userId from localStorage:", userIdData)
        if (userIdData) {
          const parsedUserId = JSON.parse(userIdData)
          setUserId(String(parsedUserId)) // Ensure it's a string
          console.log("[v0] Loaded userId:", parsedUserId)
        }

        setIsDataLoaded(true)
      } catch (err) {
        console.error("Error loading user data:", err)
        setError("Failed to load user information. Please try again.")
        setIsDataLoaded(true)
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown])

  useEffect(() => {
    if (isDataLoaded && (email || phone) && !emailVerified && !initialOtpSent) {
      const target = verificationMethod === "email" ? email : phone
      console.log(`[v0] Data loaded, sending initial OTP to ${verificationMethod}:`, target)
      sendInitialOtp()
    }
  }, [isDataLoaded, email, phone, emailVerified, initialOtpSent, verificationMethod]) // eslint-disable-line react-hooks/exhaustive-deps

  // API Calls
  const sendOtpToContact = async (target: string, method: "email" | "phone" = "email"): Promise<ApiResponse> => {
    try {
      if (!target) {
        throw new Error(`${method === "email" ? "Email" : "Phone number"} is required`)
      }

      console.log(`[v0] Sending OTP to ${method}:`, target)
      const payload = method === "email" 
        ? { email: target }
        : { phone: target }
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-otp`,
        payload,
        { withCredentials: true },
      )
      console.log("[v0] OTP send response:", response.data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      console.log("[v0] OTP send error:", error)
      throw new Error(err.response?.data?.message || "Failed to send OTP. Please try again.")
    }
  }

  const verifyOtp = async (otpCode: string): Promise<ApiResponse> => {
    try {
      if (!otpCode || otpCode.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP code")
      }
      
      const target = verificationMethod === "email" ? email : phone
      if (!target) {
        throw new Error(`${verificationMethod === "email" ? "Email" : "Phone number"} is missing`)
      }

      console.log(`[v0] Verifying OTP:`, otpCode, `for ${verificationMethod}:`, target)
      const payload = verificationMethod === "email"
        ? { email: target, otp: otpCode }
        : { phone: target, otp: otpCode }
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-otp`,
        payload,
        { withCredentials: true },
      )
      console.log("[v0] OTP verify response:", response.data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      console.log("[v0] OTP verify error:", error)
      throw new Error(err.response?.data?.message || "Invalid OTP code. Please try again.")
    }
  }

  const verifyUserAccount = async (userIdParam: string): Promise<ApiResponse> => {
    try {
      if (!userIdParam) {
        throw new Error("User ID is required")
      }

      console.log("[v0] Verifying user account:", userIdParam)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userIdParam}/verify`,
        {},
        { withCredentials: true },
      )
      console.log("[v0] User verify response:", response.data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      console.log("[v0] User verify error:", error)
      throw new Error(err.response?.data?.message || "Failed to verify user account. Please try again.")
    }
  }

  // Handlers
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return

    const newOtp = [...emailOtp] as OTPArray
    newOtp[index] = value
    setEmailOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      emailInputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when complete
    if (newOtp.every((digit) => digit !== "")) {
      handleEmailVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && index > 0 && !emailOtp[index]) {
      emailInputRefs.current[index - 1]?.focus()
    }
  }

  const handleEmailVerify = async (otpCode: string) => {
    if (!userId) {
      setError("User ID not found. Please try logging in again.")
      return
    }

    if (!email) {
      setError("Email address not found. Please try again.")
      return
    }

    setIsVerifyingEmail(true)
    setError("")
    setSuccess("")

    try {
      console.log("[v0] Starting OTP verification process")

      // Step 1: Verify OTP
      const otpResult = await verifyOtp(otpCode)
      console.log("[v0] OTP verification successful:", otpResult)

      setEmailVerified(true)
      setSuccess("Email verified successfully! Verifying your account...")

      // Step 2: Call user verification API
      setIsVerifyingUser(true)
      const userResult = await verifyUserAccount(userId)
      console.log("[v0] User verification successful:", userResult)

      setUserVerified(true)
      setSuccess("Account verified successfully! You can now continue to your dashboard.")
      setError("")
    } catch (err: unknown) {
      console.log("[v0] Verification failed:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Something went wrong please try again or contact support.")
      }
      setEmailOtp(["", "", "", "", "", ""])
      setEmailVerified(false)
      setUserVerified(false)
      setTimeout(() => {
        emailInputRefs.current[0]?.focus()
      }, 100)
    } finally {
      setIsVerifyingEmail(false)
      setIsVerifyingUser(false)
    }
  }

  const handleEmailResend = async () => {
    if (countdown > 0) return

    const target = verificationMethod === "email" ? email : phone
    if (!target) {
      setError(`${verificationMethod === "email" ? "Email" : "Phone number"} not found. Please refresh the page and try again.`)
      return
    }

    setIsSendingOtp(true)
    setEmailOtp(["", "", "", "", "", ""])
    setError("")
    setSuccess("")
    setEmailVerified(false)
    setUserVerified(false)

    try {
      await sendOtpToContact(target, verificationMethod)
      setSuccess(`New OTP sent to your ${verificationMethod}!`)
      setCountdown(60)
      setTimeout(() => {
        emailInputRefs.current[0]?.focus()
      }, 100)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to send OTP.")
      }
    } finally {
      setIsSendingOtp(false)
    }
  }

  const sendInitialOtp = async () => {
    const target = verificationMethod === "email" ? email : phone
    if (!target) {
      setError(`${verificationMethod === "email" ? "Email" : "Phone number"} not found. Please refresh the page and try again.`)
      return
    }

    setInitialOtpSent(true)
    setIsSendingOtp(true)
    setError("")

    try {
      await sendOtpToContact(target, verificationMethod)
      setSuccess(`OTP sent to your ${verificationMethod}!`)
      setCountdown(60)
      setTimeout(() => {
        emailInputRefs.current[0]?.focus()
      }, 100)
    } catch (err: unknown) {
      setInitialOtpSent(false)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Something went wrong!")
      }
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Render Functions
  const renderOTPInputs = () => {
    return (
      <div className="flex justify-center space-x-3">
        {emailOtp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              emailInputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isVerifyingEmail || emailVerified || isVerifyingUser}
            className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl transition-all duration-300 ${
              userVerified
                ? "border-green-400 bg-green-50 text-green-700"
                : emailVerified
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : digit
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            }`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
    )
  }

  const renderLoadingState = () => {
    if (isVerifyingEmail && !isVerifyingUser) {
      return (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-emerald-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
            <span className="text-sm">Verifying email...</span>
          </div>
        </div>
      )
    }

    if (isVerifyingUser) {
      return (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            <span className="text-sm">Verifying account...</span>
          </div>
        </div>
      )
    }

    return null
  }

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="flex items-center space-x-2 text-emerald-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100/10 to-pink-100/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Back Button */}
            <div className="flex justify-start">
              <Link href="/registration" passHref>
                <Button
                  variant="ghost"
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group"
                  asChild
                >
                  <div>
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </div>
                </Button>
              </Link>
            </div>

            {/* Logo & Header */}
            <div className="space-y-4">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Verify Your {verificationMethod === "email" ? "Email" : "Phone"}
                </h1>
                <p className="text-gray-600 max-w-md mx-auto">
                  We&apos;ve sent a verification code to your {verificationMethod === "email" ? "email address" : "phone number"}. Please enter the 6-digit code below to
                  verify your account.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Sent to: {verificationMethod === "email" ? email : phone}
                </p>
              </div>
            </div>

            {/* Status Alerts */}
            {error && (
              <div className="bg-white border-2 border-red-200 rounded-xl p-4 text-red-700">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-white border-2 border-green-200 rounded-xl p-4 text-green-700">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span className="font-medium">{success}</span>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Email Verification */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email Verification</h3>
                    <p className="text-sm text-gray-600">
                      Code sent to{" "}
                      <span className="font-medium">
                        {email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "your email"}
                      </span>
                    </p>
                  </div>
                </div>
                {userVerified && (
                  <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
                {emailVerified && !userVerified && (
                  <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Email Verified</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter 6-digit code from your email
                  </label>
                </div>

                {renderOTPInputs()}

                {renderLoadingState()}

                {!emailVerified && !isVerifyingEmail && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEmailResend}
                      disabled={countdown > 0 || isSendingOtp}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      {isSendingOtp ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 mr-2" />
                          Sending...
                        </>
                      ) : countdown > 0 ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resend in {countdown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Resend Email Code
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Success State */}
            {userVerified && (
              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-center text-green-600 bg-green-50 py-4 rounded-xl">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="font-semibold text-lg">Account Verified Successfully!</span>
                </div>
                <Link href="/login" passHref>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-emerald-200 transition-all duration-300 font-semibold py-4 text-lg rounded-xl">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Continue to Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {/* Help Section */}
            <div className="pt-6 border-t border-gray-100 text-center space-y-4">
              <p className="text-sm text-gray-600">Didn&apos;t receive the code?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Verification codes expire in 5 minutes and are encrypted for security
          </p>
        </div>
      </div>
    </div>
  )
}
