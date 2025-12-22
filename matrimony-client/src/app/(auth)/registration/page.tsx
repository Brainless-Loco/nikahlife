"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonLoader } from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Image from "next/image";
import logo from "../../../../public/logo/nikahlife.png";
// import logoWhite from "../../../../public/logo/nikahlife-white.png";

enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Zod validation schema
const registrationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 digits (including +880)")
      .max(15, "Phone number must be less than 15 digits")
      .regex(
        /^(?:\+?88)?01[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number (e.g. +8801712345678 or 01712345678)"
      )
      .optional()
      .or(z.literal("")),
    gender: z.enum(["male", "female"], {
      required_error: "Please select your gender",
    }),
    role: z.nativeEnum(UserRole),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
      message: "You must agree to the privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email || data.phone, {
    message: "Please provide either an email address or a phone number",
    path: ["email"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const router = useRouter();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "male",
      role: UserRole.USER,
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      console.log(process.env.NEXT_PUBLIC_BASE_URL)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/register`, {
        agreeToPrivacy: data.agreeToPrivacy,
        agreeToTerms: data.agreeToTerms,
        role: data.role,
        gender: data.gender,
        password: data.password,
        phone: data.phone || undefined,
        email: data.email || undefined,
        name: data.name,
      });

      console.log("Registration response:", response.data);
      console.log(
        "Storing userId in localStorage:",
        response.data?.data?.userId
      );
      localStorage.setItem(
        "userId",
        JSON.stringify(response.data?.data?.userId)
      );
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          email: data.email || null,
          phone: data.phone || null,
          verificationMethod: data.email ? "email" : "phone"
        })
      );

      router.push("verify-otp");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate =
      currentStep === 1
        ? ["name", "email", "phone"]
        : ["password", "confirmPassword", "phone", "email", "gender"];

    const isValid = await form.trigger(
      fieldsToValidate as (keyof RegistrationFormData)[]
    );
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const steps = [
    { number: 1, title: "Basic Info", description: "Username and email" },
    {
      number: 2,
      title: "Complete Profile",
      description: "Password and details",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl"></div>
        <div className="flex justify-start mt-4 max-w-6xl mx-auto">
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
        {/* Left Side - Branding */}
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
              Start Your
              <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Love Journey
              </span>
              Today
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Join thousands of verified members who found their perfect match.
              Create your profile and start connecting with compatible partners.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              "100% Verified Profiles",
              "Advanced Matching Algorithm",
              "Privacy & Security Guaranteed",
              "24/7 Customer Support",
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Registration Form */}
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

              {/* Step Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep >= step.number
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                          : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    {step.number < steps.length && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all duration-300 ${currentStep > step.number
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                          }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign Up Button (one-click) */}
              <div>
                <Button
                  type="button"
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border-1 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-5 rounded-xl group cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </Button>

                <div className="relative mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or register with email</span>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      {/* Username Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  placeholder="Enter your name"
                                  className="pl-10 py-3 border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl transition-all duration-300 placeholder:text-gray-400 text-black"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-emerald-600" />
                          </FormItem>
                        )}
                      />

                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Email Address (or use phone number below)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email address"
                                  className="pl-10 py-3 border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl placeholder:text-gray-400 transition-all duration-300 text-black"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-emerald-600" />
                          </FormItem>
                        )}
                      />

                      {/* Next Button */}
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-emerald-200 transition-all duration-300 font-semibold py-3 rounded-xl group cursor-pointer"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Complete Profile */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      {/* Password Field */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  className="pl-10 pr-10 py-3 border-2  text-gray-900 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 placeholder:text-gray-400 rounded-xl transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-emerald-600" />
                          </FormItem>
                        )}
                      />

                      {/* Confirm Password Field */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Confirm your password"
                                  className="pl-10 pr-10 py-3 border-2 text-gray-900 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 placeholder:text-gray-400 rounded-xl transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-emerald-600" />
                          </FormItem>
                        )}
                      />

                      {/* Phone Field */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Phone Number (or use email above)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="+880 1712 345 678"
                                  className="pl-10 py-3 border-2 text-gray-900 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 placeholder:text-gray-400 rounded-xl transition-all duration-300"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-emerald-600" />
                          </FormItem>
                        )}
                      />

                      {/* Gender Field */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Gender
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex space-x-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="male"
                                    id="male"
                                    className="border-2 border-gray-300 text-emerald-600"
                                  />
                                  <Label
                                    htmlFor="male"
                                    className="cursor-pointer text-black "
                                  >
                                    Male
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="female"
                                    id="female"
                                    className="border-2 border-gray-300 text-emerald-600"
                                  />
                                  <Label
                                    htmlFor="female"
                                    className="cursor-pointer text-black"
                                  >
                                    Female
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-emerald-600" />
                          </FormItem>
                        )}
                      />

                      {/* Role Field (Hidden for regular users) */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={UserRole.USER}>
                                    User
                                  </SelectItem>
                                  <SelectItem value={UserRole.ADMIN}>
                                    Admin
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Terms and Privacy Checkboxes */}
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-2 border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm text-gray-700 cursor-pointer">
                                  I agree to the{" "}
                                  <Link
                                    href="/terms"
                                    className="text-emerald-600 hover:text-emerald-700 underline"
                                  >
                                    Terms and Conditions
                                  </Link>
                                </FormLabel>
                                <FormMessage className="text-emerald-600" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="agreeToPrivacy"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-2 border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm text-gray-700 cursor-pointer">
                                  I agree to the{" "}
                                  <Link
                                    href="/privacy"
                                    className="text-emerald-600 hover:text-emerald-700 underline"
                                  >
                                    Privacy Policy
                                  </Link>
                                </FormLabel>
                                <FormMessage className="text-emerald-600" />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex-1 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 font-semibold py-3 rounded-xl bg-transparent"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-emerald-200 transition-all duration-300 font-semibold py-3 rounded-xl cursor-pointer"
                        >
                          {isSubmitting ? (
                            <ButtonLoader size="sm" />
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Sign In
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
