"use client";

import * as React from "react";
import { Crown, Shield, Eye } from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/hooks/use-language";
import { PageLoader } from "@/components/common/Loader";
import { getCookie } from "@/utils/getToken";
import { ProfileCard } from "./ProfileCard";
import { NavigationButtons } from "./navigationButton";
import { ProfileData } from "@/types/profile";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { getOwnBiodata } from "@/app/actions/getOwnBiodata";

export default function Profile() {
  const [profile, setProfile] = React.useState<ProfileData | undefined>();
  const [loading, setLoading] = React.useState(false);
  const token = getCookie("token") || "";
  const { user } = useAuth();

  React.useEffect(() => {
    getOwnBiodata();
  }, []);
  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/ownProfile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        setProfile(response?.data?.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const { language } = useLanguage();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 mt-7">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950"></div>
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white/80 text-sm">
                    {language === "bn" ? "সাবস্ক্রিপশন" : "Subscription"}
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {user?.subscriptionType}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white/80 text-sm">
                    {language === "bn" ? "প্রোফাইল ভিউ" : "Profile Views"}
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {profile?.subscriptionId?.profileViewLimit || 0}{" "}
                    {language === "bn" ? "বাকি" : "Left"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white/80 text-sm">
                    {language === "bn" ? "স্ট্যাটাস" : "Status"}
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {language === "bn" ? "সক্রিয়" : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <ProfileCard profile={profile} />
            </div>
          </div>

          {/* Main Actions */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-8 px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === "bn" ? "আপনার প্রোফাইল" : "Your Profile"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "bn"
                    ? "নিচের অপশনগুলি ব্যবহার করে আপনার অনুরোধ এবং আগ্রহ পরিচালনা করুন"
                    : "Manage your requests and interests using the options below"}
                </p>
              </div>

              <NavigationButtons />

              {/* <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-400/10 dark:to-emerald-500/10 rounded-xl py-6 px-3 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                      {language === "bn"
                        ? "প্রিমিয়াম সদস্য!"
                        : "Premium Member!"}
                    </h3>
                    <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      {language === "bn"
                        ? "আপনার প্রিমিয়াম সাবস্ক্রিপশন ২০২৫ সালের নভেম্বর পর্যন্ত সক্রিয় রয়েছে। আপনি ৯৯টি প্রোফাইল দেখতে পারবেন এবং সব প্রিমিয়াম ফিচার ব্যবহার করতে পারবেন।"
                        : "Your premium subscription is active until November 2025. You have 99 profile views remaining and access to all premium features."}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
