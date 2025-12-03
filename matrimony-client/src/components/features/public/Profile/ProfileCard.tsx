"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/use-language";
import { User, Mail, Phone, Calendar, Crown, Edit3 } from "lucide-react";
import { profileTranslation } from "@/dictionary/profile";
import femaleAvatar from "../../../../../public/female_avatar.jpg";
import maleAvatar from "../../../../../public/men_avatar.webp";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/context/auth-context";
{ /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
export function ProfileCard({ profile }: any) {
  const { language } = useLanguage();
  const t = profileTranslation[language];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "bn" ? "bn-BD" : "en-US"
    );
  };

  const { user } = useAuth()

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="inline-block mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={
                profile?.gender === "female" ? femaleAvatar.src : maleAvatar.src
              }
            />
            <AvatarFallback className="text-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              {profile?.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {profile?.subscriptionType === "premium" && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {profile?.name}
        </h3>

        <div className="flex justify-center gap-2">
          <Badge
            variant={profile?.isVerified ? "default" : "secondary"}
            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
          >
            {profile?.isVerified ? t.verified : t.notVerified}
          </Badge>
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0">
            {user?.subscriptionType}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t.gender}:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {profile?.gender}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t.email}:
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 ml-6">
            {profile?.email}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t.phone}:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {profile?.phone}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {t.profileViewLimit}:
            </span>
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
              {profile?.subscriptionId?.profileViewLimit || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
          <Crown className="h-4 w-4" />
          {t.subscription}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-yellow-700 dark:text-yellow-300">
              {t.subscriptionStatus}:
            </span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {t.active}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-700 dark:text-yellow-300">
              {t.duration}:
            </span>
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              {profile?.subscriptionId?.durationInMonths} {t.months}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-700 dark:text-yellow-300">
              {t.endDate}:
            </span>
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              {profile?.subscriptionId?.endDate
                ? formatDate(profile.subscriptionId.endDate)
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <Link href={"/profile/update-biodata"}>
        <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <Edit3 className="h-4 w-4 mr-2" />
          {t.editProfile}
        </Button>
      </Link>
    </div>
  );
}
