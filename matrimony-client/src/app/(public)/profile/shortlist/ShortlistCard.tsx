"use client";

import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, User } from "lucide-react";
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
export default function BiodataCard({ biodata }: any) {
  const { language } = useLanguage();
  const shortlist = biodata?.biodataId;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-[1.02] overflow-hidden">
      <CardContent className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getInitials("dasdb")}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-balance mb-1">
              {shortlist?.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="capitalize">{shortlist?.gender}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>
                  {shortlist?.age} {language === "bn" ? "বছর" : "years"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Present Address Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-sm">
              {language === "bn" ? "বর্তমান ঠিকানা" : "Present Address"}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-6">
            {shortlist?.address?.present?.address}
          </p>
        </div>

        {/* Location Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-sm">
              {language === "bn" ? "অবস্থানের বিবরণ" : "Location Details"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pl-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                {language === "bn" ? "উপজেলা" : "Upazila"}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {shortlist?.address?.present?.upazila}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                {language === "bn" ? "জেলা" : "District"}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {shortlist?.address?.present?.district}
              </p>
            </div>
          </div>

          <div className="pl-6">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
              {language === "bn" ? "বিভাগ" : "Division"}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {shortlist?.address?.present?.division}
            </p>
          </div>
        </div>

        {/* View Full Data Button */}
        <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
          {language === "bn" ? "সম্পূর্ণ বায়োডাটা দেখুন" : "View Full Biodata"}
        </Button>
      </CardContent>
    </Card>
  );
}
