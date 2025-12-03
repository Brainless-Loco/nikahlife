"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CheckCircle,
  Crown,
  Star,
  Shield,
  CreditCard,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { manualPaymentTranslation } from "@/dictionary/manualPayment";
import { useLanguage } from "@/hooks/use-language";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  icon: React.ElementType;
  color: string;
  popular?: boolean;
}

export default function BkashManualPayment() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "premium";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, token } = useAuth();
  const router = useRouter();

  const { language } = useLanguage();
  const t = manualPaymentTranslation[language];

  const subscriptionPlans: Record<string, SubscriptionPlan> = {
    premium: {
      id: "premium",
      name: t.premium,
      price: 3000,
      duration: t.oneMonth,
      features: [
        t.unlimitedProfileViews,
        t.premiumSupport,
        t.advancedSearchFilters,
        t.profileHighlight,
        // t.messagingFeature,
      ],
      icon: Crown,
      color: "from-amber-500 to-orange-600",
      popular: true,
    },
    vip: {
      id: "vip",
      name: t.vip,
      price: 5000,
      duration: t.oneMonth,
      features: [
        t.allPremiumFeatures,
        t.privateConsultation,
        t.matchmakingService,
        t.profileVerification,
        t.prioritySupport,
        t.customProfileDesign,
      ],
      icon: Star,
      color: "from-purple-500 to-pink-600",
    },
  };

  const selectedPlan = subscriptionPlans[planId];

  // Dynamic form schema based on language
  const formSchema = z.object({
    transactionId: z
      .string()
      .min(10, {
        message: t.transactionIdMinLength,
      })
      .regex(/^[A-Z0-9]+$/, {
        message: t.transactionIdRegex,
      }),
    senderNumber: z
      .string()
      .min(11, {
        message: t.validBkashNumber,
      })
      .regex(/^01[3-9]\d{8}$/, {
        message: t.validBangladeshiPhone,
      }),
    paidAmount: z.string().refine(
      (val) => {
        const num = Number.parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: t.validAmount,
      }
    ),
    paymentDate: z.string().min(1, {
      message: t.selectPaymentDate,
    }),
    additionalNotes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionId: "",
      senderNumber: "",
      paidAmount: selectedPlan?.price.toString() || "",
      paymentDate: "",
      additionalNotes: "",
    },
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const paidAmount = Number.parseFloat(values.paidAmount);
      if (selectedPlan && paidAmount !== selectedPlan.price) {
        toast.error(
          t.payExactAmount
            .replace("{amount}", selectedPlan.price.toString())
            .replace("{plan}", selectedPlan.name)
        );
        setIsSubmitting(false);
        return;
      }
      
      if (!token) {
        throw new Error("No authentication token found");
      }
       await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create`,
        {
          ...values,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          approvalStatus: "pending",
          durationInMonths: selectedPlan?.duration === t.threeMonths ? 3 : 6,
          subscriptionType: selectedPlan?.id,
          userId: user?.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      // console.log("Payment submission response:", response.data);
      localStorage.removeItem("userInfo");
      toast.success(t.paymentSubmittedSuccess);
      router.push("/payment/success");
    } catch (error) {
      console.log(error);
      toast.error(t.submissionFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">{t.planNotFound}</h2>
            <p className="text-muted-foreground">{t.selectValidPlan}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = selectedPlan.icon;

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t.bkashManualPayment}
          </h1>
          <p className="text-muted-foreground">{t.submitPaymentDetails}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Selected Plan Details */}
          <Card className="h-fit  dark:border-gray-600 dark:hover:border-emerald-500 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition">
            <CardHeader>
              <div className="flex items-center gap-3 ">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${selectedPlan.color} text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedPlan.name} {t.planText}
                    {selectedPlan.popular && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                      >
                        {t.popular}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedPlan.duration} {t.subscription}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center p-6 bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 rounded-lg">
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  ৳{selectedPlan.price}
                </div>
                <div className="text-muted-foreground">
                  {t.forDuration} {selectedPlan.duration}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  {t.whatsIncluded}
                </h3>
                <div className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="h-fit  dark:border-gray-600 dark:hover:border-emerald-500 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gradient-to-r from-pink-600 to-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">bKash</span>
                </div>
                {t.paymentInstructions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 p-4 rounded-lg border border-pink-200">
                <h4 className="font-semibold text-gray-700 dark:text-gray-100 mb-2">
                  {t.step1MakePayment}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-100 mb-2">
                  {t.sendMoneyInstruction}
                </p>
                <div className="bg-white dark:bg-gray-900 p-3 rounded border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-pink-700">
                      01721972807
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {t.merchantAccount}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 dark:text-gray-100 mb-2">
                  {t.step2NoteDetails}
                </h4>
                <ul className="text-sm text-blue-800 dark:text-gray-300 space-y-1">
                  <li>{t.transactionId}</li>
                  <li>{t.yourBkashNumber}</li>
                  <li>{t.paymentDate}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 dark:text-green-600 mb-2">
                  {t.step3SubmitForm}
                </h4>
                <p className="text-sm text-green-800 dark:text-green-700">
                  {t.fillFormInstruction}
                </p>
              </div>

              <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <h4 className="font-semibold text-amber-900 dark:text-amber-600">
                    {t.verificationTime}
                  </h4>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-700">
                  {t.verificationDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="lg:col-span-1  dark:border-gray-600 dark:hover:border-emerald-500 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t.paymentDetails}
              </CardTitle>
              <CardDescription>{t.enterBkashInfo}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* bKash Payment Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-300">
                      {t.bkashPaymentInfo}
                    </h3>

                    <FormField
                      control={form.control}
                      name="transactionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.transactionIdLabel} {t.required}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.transactionIdPlaceholder}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t.transactionIdDescription}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="senderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.yourBkashNumberLabel} {t.required}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t.bkashNumberPlaceholder}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t.bkashNumberDescription}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="paidAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.amountPaidLabel} {t.required}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.amountPaidPlaceholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t.paymentDateLabel} {t.required}
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.additionalNotesLabel}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.additionalNotesPlaceholder}
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t.submitting}
                      </div>
                    ) : (
                      t.submitPaymentDetailsBtn
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
