"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/use-language";
import { User, Mail, Phone, Calendar, Crown, Edit3, Download } from "lucide-react";
import { profileTranslation } from "@/dictionary/profile";
import femaleAvatar from "../../../../../public/female_avatar.jpg";
import maleAvatar from "../../../../../public/men_avatar.webp";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { toast } from "sonner";
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

  const handleDownloadPDF = async () => {
    if (user?._id !== profile?.userId?._id) {
      toast.error(
        language === "bn"
          ? "শুধুমাত্র নিজের বায়োডাটা ডাউনলোড করতে পারবেন"
          : "You can only download your own biodata"
      );
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const primaryColor = [16, 185, 129];
      const secondaryColor = [51, 65, 85];
      const lightGray = [243, 244, 246];
      const darkGray = [107, 114, 128];

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = 15;

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("NIKAH LIFE", margin, 20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Matrimonial Profile", margin, 28);

      yPos = 50;
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(profile?.name || "Name", margin, yPos);

      yPos += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(`Biodata No: ${profile?.biodataNumber ?? ""}`, margin, yPos);

      yPos += 6;
      doc.text(
        `Upload Date: ${new Date(profile?.createdAt || "").toLocaleDateString(
          language === "bn" ? "bn-BD" : "en-US"
        )}`,
        margin,
        yPos
      );

      yPos += 12;
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin - 2, yPos - 5, pageWidth - 2 * margin + 4, 7, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PERSONAL INFORMATION", margin, yPos);

      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const personalInfo: Array<[string, string]> = [
        ["Age:", `${profile?.age ?? "N/A"} years`],
        ["Gender:", profile?.gender || "N/A"],
        ["Height:", profile?.personal?.height || "N/A"],
        ["Marital Status:", profile?.personal?.maritalStatus || "N/A"],
        ["Nationality:", profile?.address?.country || "N/A"],
        ["Complexion:", profile?.preference?.complexion || "N/A"],
      ];
      personalInfo.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text(item[0], margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(item[1], margin + 35, yPos);
        yPos += 5;
      });

      yPos += 3;
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin - 2, yPos - 5, pageWidth - 2 * margin + 4, 7, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("ADDRESS", margin, yPos);

      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Permanent Address:", margin, yPos);
      doc.setFont("helvetica", "normal");
      const permAddress = `${profile?.address?.permanent?.division ?? ""}, ${profile?.address?.permanent?.district ?? ""}`;
      doc.text(permAddress, margin + 50, yPos);
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Present Address:", margin, yPos);
      doc.setFont("helvetica", "normal");
      const presAddress = `${profile?.address?.present?.division ?? ""}, ${profile?.address?.present?.district ?? ""}`;
      doc.text(presAddress, margin + 50, yPos);
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Grew Up At:", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(profile?.address?.grewUpAt || "N/A", margin + 50, yPos);

      yPos += 8;
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin - 2, yPos - 5, pageWidth - 2 * margin + 4, 7, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATION", margin, yPos);

      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Method:", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(profile?.education?.method || "N/A", margin + 35, yPos);
      yPos += 5;
      (profile?.education?.history || []).forEach((edu: any) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${edu.level}:`, margin, yPos);
        doc.setFont("helvetica", "normal");
        const eduText = edu.level === "SSC" || edu.level === "HSC" ? `${edu.group} (${edu.year})` : `${edu.subject} (${edu.year})`;
        doc.text(eduText, margin + 35, yPos);
        yPos += 5;
      });

      yPos += 3;
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin - 2, yPos - 5, pageWidth - 2 * margin + 4, 7, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("OCCUPATION", margin, yPos);

      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const occupationInfo: Array<[string, string]> = [
        ["Current Occupation:", profile?.occupation?.current || "N/A"],
        ["Description:", profile?.occupation?.description || "N/A"],
        [
          "Income:",
          profile?.occupation?.income?.amount
            ? `${profile.occupation.income.amount} ${profile.occupation.income.currency}`
            : "Not specified",
        ],
      ];
      occupationInfo.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text(item[0], margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(item[1], margin + 50, yPos);
        yPos += 5;
      });

      yPos += 3;
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin - 2, yPos - 5, pageWidth - 2 * margin + 4, 7, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EXPECTED LIFE PARTNER", margin, yPos);

      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const preferenceInfo: Array<[string, string]> = [
        ["Age Range:", profile?.preference?.ageRange || "N/A"],
        ["Height:", profile?.preference?.height || "N/A"],
        ["Education:", profile?.preference?.education || "N/A"],
        ["Profession:", profile?.preference?.profession || "N/A"],
        ["Location Preference:", profile?.preference?.location || "N/A"],
      ];
      preferenceInfo.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text(item[0], margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(item[1], margin + 50, yPos);
        yPos += 5;
      });

      doc.setFontSize(8);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | NikahLife Matrimonial Service`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      doc.save(`biodata_${profile?.biodataNumber}.pdf`);
      toast.success(
        language === "bn" ? "বায়োডাটা ডাউনলোড হয়েছে" : "Biodata downloaded successfully!"
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        language === "bn" ? "ডাউনলোড ব্যর্থ হয়েছে" : "Failed to download biodata"
      );
    }
  };

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

      {user?._id === profile?.userId?._id && (
        <div className="mt-3">
          <Button
            variant="outline"
            className="w-full cursor-pointer border-purple-400 flex items-center justify-center"
            onClick={handleDownloadPDF}
          >
            <Download className="text-purple-400 mr-2 w-4 h-4" />
            {language === "bn" ? "পিডিএফ ডাউনলোড করুন" : "Download PDF"}
          </Button>
        </div>
      )}
    </div>
  );
}
