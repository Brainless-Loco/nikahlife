"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Crown,
  Star,
  Shield,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { subscriptionPlan } from "@/dictionary/subscriptionPlan";
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

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "premium";
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  // const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { language } = useLanguage();
  const t = subscriptionPlan[language];

  const subscriptionPlans: Record<string, SubscriptionPlan> = {
    premium: {
      id: "premium",
      name: t.premium,
      price: 3000,
      duration: t.threeMonths,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      toast.error(t.fillAllFields);
      return;
    }

    setIsProcessing(true);

    try {
      // const response = await axios.post(
      //   `${process.env.NEXT_PUBLIC_BASE_URL}/payment/create`,
      //   {
      //     email: email,
      //     name: name,
      //     phone: phone,
      //     amount: selectedPlan?.price,
      //   }
      // );
      // console.log(response.data);

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          email,
          name,
          phone,
        })
      );
      router.push(`/bkash-manual?plan=${planId}`);

      toast.success(t.planActivated.replace("{plan}", selectedPlan.name));

      // Redirect after payment
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(t.paymentFailed);
    } finally {
      setIsProcessing(false);
    }
  };

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            {t.completePayment}
          </h1>
          <p className="text-muted-foreground">{t.subscribeDescription}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 ">
          {/* Left Side - Plan Details */}
          <Card className="h-fit border-gray-200 dark:border-gray-600 dark:hover:border-emerald-500 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${selectedPlan.color} text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedPlan.name} {t.planName}
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
              <div className="text-center p-6 bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 rounded-lg">
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  ৳{selectedPlan.price}
                </div>
                <div className="text-muted-foreground">
                  {t.forDuration} {selectedPlan.duration}
                </div>
              </div>

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

              <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  {t.needHelp}
                </h4>
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+8801721972807</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>nikahlife25@gmail.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Form */}
          <Card className="border-gray-200 dark:border-gray-600 dark:hover:border-emerald-500 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-emerald-500/10">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t.paymentInformation}
                </CardTitle>
                <CardDescription>{t.enterDetailsDescription}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">{t.personalInformation}</h3>
                  <div className="grid gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="name">
                        {t.fullName} {t.required}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t.enterFullName}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email">
                        {t.emailAddress} {t.required}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t.emailPlaceholder}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone">
                        {t.phoneNumber} {t.required}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t.phonePlaceholder}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4 ">
                  <h3 className="font-medium">{t.paymentMethod}</h3>
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-pink-600 to-red-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          bKash
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{t.bkashPayment}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t.fastSecurePayment}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.redirectDescription}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium">{t.paymentSummary}</h3>
                  <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>
                        {selectedPlan.name} {t.planName}
                      </span>
                      <span>৳{selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t.duration}</span>
                      <span>{selectedPlan.duration}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t.total}</span>
                      <span>৳{selectedPlan.price}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-6 text-lg cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t.processing}
                    </div>
                  ) : (
                    t.payWithBkash.replace(
                      "{amount}",
                      selectedPlan.price.toString()
                    )
                  )}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 inline mr-1" />
                  {t.securePayment}
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
