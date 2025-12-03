"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Crown,
  Coins,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { getCookie } from "@/utils/getToken";

interface ProfileVisitData {
  access: string;
  pointsDeducted: number;
  remaining: number;
  subscriptionStatus: string;
  currentPackage: string;
  profileOwner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface ProfileVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string | null;
}

const translations = {
  en: {
    title: "Profile Visit Information",
    loading: "Loading profile information...",
    error: "Failed to load profile information",
    retry: "Retry",
    close: "Close",
    accessGranted: "Access Granted",
    accessDenied: "Access Denied",
    pointsDeducted: "Points Deducted",
    remainingPoints: "Remaining Points",
    subscriptionStatus: "Subscription Status",
    currentPackage: "Current Package",
    profileOwner: "Profile Owner",
    contactInfo: "Contact Information",
    email: "Email",
    phone: "Phone",
    active: "Active",
    inactive: "Inactive",
    premium: "Premium",
    basic: "Basic",
    free: "Free",
  },
  bn: {
    title: "প্রোফাইল ভিজিট তথ্য",
    loading: "প্রোফাইল তথ্য লোড হচ্ছে...",
    error: "প্রোফাইল তথ্য লোড করতে ব্যর্থ",
    retry: "পুনরায় চেষ্টা করুন",
    close: "বন্ধ করুন",
    accessGranted: "অ্যাক্সেস অনুমোদিত",
    accessDenied: "অ্যাক্সেস প্রত্যাখ্যাত",
    pointsDeducted: "পয়েন্ট কাটা হয়েছে",
    remainingPoints: "অবশিষ্ট পয়েন্ট",
    subscriptionStatus: "সাবস্ক্রিপশন স্ট্যাটাস",
    currentPackage: "বর্তমান প্যাকেজ",
    profileOwner: "প্রোফাইল মালিক",
    contactInfo: "যোগাযোগের তথ্য",
    email: "ইমেইল",
    phone: "ফোন",
    active: "সক্রিয়",
    inactive: "নিষ্ক্রিয়",
    premium: "প্রিমিয়াম",
    basic: "বেসিক",
    free: "ফ্রি",
  },
};

export default function ViewContact({
  isOpen,
  onClose,
  profileId,
}: ProfileVisitModalProps) {
  const [data, setData] = useState<ProfileVisitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "bn">("en");

  // Get language from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage === "bn" || storedLanguage === "en") {
      setLanguage(storedLanguage);
    }
  }, []);
  console.log(data);
  // Fetch profile data when modal opens
  useEffect(() => {
    if (isOpen && profileId) {
      fetchProfileData(profileId);
    }
  }, [isOpen, profileId]);

  const token = getCookie("token") || "";

  const fetchProfileData = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact-visit/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );

      const result = response.data;
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to load profile data");
      }
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setData(null);
    setError(null);
    onClose();
  };

  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-500" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
                <p className="text-muted-foreground">{t.loading}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 space-y-4">
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <div className="space-y-2">
                <p className="text-destructive font-medium">{t.error}</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button
                onClick={() => profileId && fetchProfileData(profileId)}
                variant="outline"
                className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                {t.retry}
              </Button>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              {/* Access Status */}
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.accessGranted}
                    </span>
                    <Badge
                      variant={
                        data.access === "granted" ? "default" : "destructive"
                      }
                      className={cn(
                        data.access === "granted"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-destructive hover:bg-destructive/90"
                      )}
                    >
                      {data.access === "granted" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {data.access === "granted"
                        ? t.accessGranted
                        : t.accessDenied}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Points Information */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="space-y-1">
                      <Coins className="h-5 w-5 text-emerald-500 mx-auto" />
                      <p className="text-2xl font-bold text-foreground">
                        {data.pointsDeducted}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.pointsDeducted}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="space-y-1">
                      <Coins className="h-5 w-5 text-emerald-500 mx-auto" />
                      <p className="text-2xl font-bold text-foreground">
                        {data.remaining}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.remainingPoints}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Info */}
              <Card className="border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.subscriptionStatus}
                    </span>
                    <Badge
                      variant={
                        data.subscriptionStatus === "active"
                          ? "default"
                          : "secondary"
                      }
                      className={cn(
                        data.subscriptionStatus === "active"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {data.subscriptionStatus === "active"
                        ? t.active
                        : t.inactive}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.currentPackage}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500 text-emerald-500"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      {data.currentPackage === "premium"
                        ? t.premium
                        : data.currentPackage === "basic"
                        ? t.basic
                        : t.free}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Separator className="bg-border" />

              {/* Profile Owner Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-500" />
                  {t.profileOwner}
                </h3>

                <Card className="border-border">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {data.profileOwner.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {data.profileOwner.id}
                      </p>
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t.contactInfo}
                      </p>

                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-emerald-500" />
                        <span className="text-foreground">
                          {data.profileOwner.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-emerald-500" />
                        <span className="text-foreground">
                          {data.profileOwner.phone}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Close Button */}
              <Button
                onClick={handleClose}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {t.close}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
