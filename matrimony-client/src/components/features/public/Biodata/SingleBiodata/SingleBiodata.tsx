"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios, { AxiosError } from "axios";
import femaleAvatar from "../../../../../../public/men_avatar.webp";
import maleAvatar from "../../../../../../public/female_avatar.jpg";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import {
  Ban,
  Briefcase,
  GraduationCap,
  Heart,
  Loader2,
  MapPin,
  Target,
  User,
  Users,
  Shield,
  Star,
  Eye,
  Crown,
  Copy,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BiodataType } from "@/types/publicBiodata";
import { downloadBiodataAsPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { PageLoader } from "@/components/common/Loader";
import { getCookie } from "@/utils/getToken";
import { useAuth } from "@/app/(auth)/context/auth-context";
import ViewContact from "./viewContactModal";
import Link from "next/link";

export default function Biodata({ id }: { id: string }) {
  const [biodata, setBiodata] = React.useState<BiodataType | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [ButtonLoader, setButtonLoader] = React.useState(false);
  const [shortListLoader, setShortListLoader] = React.useState(false);
  const [blockLoader, setBlockLoader] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProfileId, setSelectedProfileId] = React.useState<
    string | null
  >(null);
  // Translation function
  const { language } = useLanguage();
  const t = biodataTranslation[language];
  const token = getCookie("token") || "";

  const { user } = useAuth();
  React.useEffect(() => {
    const getbiodata = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/${id}`
        );
        setBiodata(response.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getbiodata();
  }, [id]);
  const handleSendInterest = async () => {
    setButtonLoader(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/interest/send?receiverId=${biodata?.userId._id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Interest sent successfully:", response.data);
      toast.success("Interest sent successfully");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setButtonLoader(false);
    }
  };
  const handleBlock = async () => {
    // if (!user) return router.push("/login");
    setBlockLoader(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ignore?ignoredUserId=${biodata?.userId?._id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log("Blocked successfully:", response.data);
      toast.success("Blocked successfully");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setBlockLoader(false);
    }
  };
  const handleShortlist = async () => {
    // if (!user) return router.push("/login");
    setShortListLoader(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/shortList/${biodata?._id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log("Shortlisted successfully:", response.data);
      toast.success("Shortlisted successfully");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setShortListLoader(false);
    }
  };

  const handleViewContact = (profileId: string) => {
    setSelectedProfileId(profileId);
    setIsModalOpen(true);
  };

  const handleCopyLink = async () => {
    const biodataUrl = `${window.location.origin}/biodatas/${id}`;
    try {
      await navigator.clipboard.writeText(biodataUrl);
      toast.success(language === "bn" ? "লিঙ্ক কপি করা হয়েছে" : "Link copied to clipboard!");
    } catch {
      toast.error(language === "bn" ? "লিঙ্ক কপি করতে ব্যর্থ" : "Failed to copy link");
    }
  };

  const handleDownloadPDF = async () => {
    // Check if user is viewing their own biodata
    if (user?._id !== biodata?.userId?._id && user?._id !== biodata?.userId) {
      toast.error(
        language === "bn"
          ? "শুধুমাত্র নিজের বায়োডাটা ডাউনলোড করতে পারবেন"
          : "You can only download your own biodata"
      );
      return;
    }

    try {
      await downloadBiodataAsPDF(biodata);
      toast.success(
        language === "bn"
          ? "বায়োডাটা ডাউনলোড হয়েছে"
          : "Biodata downloaded successfully!"
      );
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error(
        language === "bn" ? "ডাউনলোড ব্যর্থ হয়েছে" : "Failed to download biodata"
      );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return <PageLoader />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Profile Summary */}
          <div className="lg:w-1/3">
            <Card className="bg-yellow-500/10 dark:bg-yellow-500/5 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <Avatar className="h-40 w-40 ring-4 ring-white dark:ring-gray-700 shadow-lg">
                    <AvatarImage
                      src={
                        biodata?.gender === "female"
                          ? maleAvatar.src
                          : femaleAvatar.src
                      }
                      alt={biodata?.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white text-2xl font-bold">
                      {getInitials("asda")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {user &&
                  ["premium", "vip"].includes(user?.subscriptionType || "") && (
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                      {biodata?.name}
                    </h2>
                  )}

                <div className="space-y-1">
                  {biodata?.biodataNumber && (
                    <div className="flex border-b border-gray-200 dark:border-gray-700 py-3">
                      <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0">
                        Biodata No.
                      </div>
                      <div className="flex-1 text-right text-gray-800 dark:text-gray-100 break-words leading-relaxed font-semibold">
                        {biodata.biodataNumber}
                      </div>
                    </div>
                  )}
                  
                  {biodata?.createdAt && (
                    <div className="flex border-b border-gray-200 dark:border-gray-700 py-3">
                      <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0">
                        Upload Date
                      </div>
                      <div className="flex-1 text-right text-gray-800 dark:text-gray-100 break-words leading-relaxed">
                        {new Date(biodata.createdAt).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-3">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0">
                      {t.singleBiodata?.typesOfBiodata}
                    </div>
                    <div className="flex-1 text-right text-gray-800 dark:text-gray-100">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 whitespace-nowrap"
                      >
                        {biodata?.gender === "male" || "Male"
                          ? t.singleBiodata?.maleBiodata
                          : t.singleBiodata?.femaleBiodata}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-3">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0">
                      {t.personalInformation?.age}
                    </div>
                    <div className="flex-1 text-right text-gray-800 dark:text-gray-100 break-words leading-relaxed">
                      {biodata?.age}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-3">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0">
                      {t.expectedLifePartner?.complexion}
                    </div>
                    <div className="flex-1 text-right text-gray-800 dark:text-gray-100 break-words leading-relaxed">
                      {biodata?.preference?.complexion}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-3">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0">
                      {t.singleBiodata?.nationality}
                    </div>
                    <div className="flex-1 text-right text-gray-800 dark:text-gray-100 break-words leading-relaxed">
                      {biodata?.address?.country}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSendInterest}
              disabled={ButtonLoader}
              className="w-full mt-4 bg-emerald-600 dark:text-gray-100 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 cursor-pointer"
            >
              {ButtonLoader ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Heart className="w-4 h-4 mr-2" />
              )}
              {ButtonLoader ? "Sending..." : t.sendInterest}
            </Button>

            {/* Shortlist and Ignore Buttons */}
            <div className="flex justify-between mt-6 w-full space-x-4">
              {/* Shortlist Button */}
              <div className="w-full">
                <Button
                  className="cursor-pointer border-green-400 w-full flex items-center justify-center"
                  variant="outline"
                  onClick={handleShortlist}
                  disabled={shortListLoader}
                >
                  {shortListLoader ? (
                    <span className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Star className="text-green-400 mr-2" /> Shortlist
                    </>
                  )}
                </Button>
              </div>

              {/* Ignore Button */}
              <div className="w-full">
                <Button
                  className="cursor-pointer border-red-400 w-full flex items-center justify-center"
                  variant="outline"
                  onClick={handleBlock}
                  disabled={blockLoader}
                >
                  {blockLoader ? (
                    <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Ban className="text-red-400 mr-2" /> Ignore
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Copy Link and Download Buttons */}
            <div className="flex justify-between mt-4 w-full space-x-4">
              {/* Copy Link Button */}
              <div className="w-full">
                <Button
                  className="cursor-pointer border-blue-400 w-full flex items-center justify-center"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  <>
                    <Copy className="text-blue-400 mr-2 w-4 h-4" /> {language === "bn" ? "লিঙ্ক কপি" : "Copy Link"}
                  </>
                </Button>
              </div>

              {/* Download Button - Only for own biodata */}
              {user?._id === biodata?.userId?._id && (
                <div className="w-full">
                  <Button
                    className="cursor-pointer border-purple-400 w-full flex items-center justify-center"
                    variant="outline"
                    onClick={handleDownloadPDF}
                  >
                    <>
                      <Download className="text-purple-400 mr-2 w-4 h-4" /> {language === "bn" ? "ডাউনলোড" : "Download"}
                    </>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Detailed Information */}
          <div className="lg:w-2/3 space-y-6">
            {/* Address Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.address?.address}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.address?.permanentAddress}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.address?.permanent?.division},{" "}
                      {biodata?.address?.permanent?.district},{" "}
                      {biodata?.address?.permanent?.upazila},{" "}
                      {t.address?.address}:{" "}
                      {biodata?.address?.permanent?.address}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.address?.presentAddress}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.address?.present?.division},{" "}
                      {biodata?.address?.present?.district},{" "}
                      {biodata?.address?.present?.upazila}, {t.address?.address}
                      : {biodata?.address?.present?.address}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.address?.whereDidYouGrow}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.address?.grewUpAt}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <GraduationCap className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.educationalQualification?.educationalQualification}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.educationalQualification?.educationMethod}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.education?.method}
                    </div>
                  </div>
                  {biodata?.education?.history.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex border-b border-gray-200 dark:border-gray-700 py-4"
                    >
                      <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                        {edu.level === "SSC"
                          ? t.educationalQualification?.sscDakhilEqulalent
                          : edu.level === "HSC"
                          ? t.educationalQualification?.hscAlimEquivalent
                          : edu.level === "Graduation"
                          ? t.educationalQualification?.graduation
                          : edu.level === "Masters"
                          ? t.educationalQualification?.masters
                          : edu.level === "PhD"
                          ? t.educationalQualification?.phd
                          : "Prefer not say"}
                        :
                      </div>
                      <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                        {edu.level === "SSC" || edu.level === "HSC" ? (
                          <span className="flex flex-col">
                            {edu.group} ({edu.year})
                            {edu.result && (
                              <small>
                                {t.educationalQualification?.result}:{" "}
                                {edu.result}
                              </small>
                            )}
                          </span>
                        ) : edu.level === "Graduation" ||
                          edu.level === "Masters" ||
                          edu.level === "PhD" ? (
                          <span className="flex flex-col">
                            {edu.subject} ({edu.year})
                            <small>({edu.institution})</small>
                            {edu.result && <small>{edu.result}</small>}
                          </span>
                        ) : (
                          <span>
                            {edu.level} ({edu.year})
                            {edu.result && <small> {edu.result}</small>}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.educationalQualification?.othersEducation}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.education?.other.join(", ")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <Users className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.familyInformation?.familyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.fatherProfession}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.fatherProfession}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.fatherAlive}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 pl-2">
                      <Badge
                        variant={
                          biodata?.family?.fatherAlive
                            ? "default"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {biodata?.family?.fatherAlive ? "জীবিত" : "মৃত"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.motherProfession}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.motherProfession}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.motherAlive}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 pl-2">
                      <Badge
                        variant={
                          biodata?.family.motherAlive
                            ? "default"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {biodata?.family?.motherAlive ? "জীবিত" : "মৃত"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.brother}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.brothers} -{" "}
                      {biodata?.family?.brothersInfo?.join(", ")}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.sister}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.sisters} -{" "}
                      {biodata?.family?.sistersInfo?.join(", ")}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.uncleProfession}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.unclesProfession?.join(", ")}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.familyStatus}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.financialStatus}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.familySituation}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.financialDetails}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.familyInformation?.religiousCondition}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.family?.religiousPractice}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupation Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <Briefcase className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.OccupationalInformation?.occupation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.OccupationalInformation?.occupation}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.occupation?.current}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.OccupationalInformation?.profession}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.occupation?.description}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.OccupationalInformation?.income}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.occupation?.income?.amount
                        ? `${biodata.occupation.income.amount} ${biodata.occupation.income.currency}`
                        : "Not specified"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <User className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.personalInformation?.personalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.dressUp}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.dress}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.height}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.height}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.maritalStatus}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.maritalStatus}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.pray5times}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.prayerHabit}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.mahram}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.maintainMahram}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.quranReading}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.quranReading}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.fiqh}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.fiqh}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.entertainment}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.entertainment}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.favoriteBooks}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.favoriteBooks.join(", ")}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.hobbies}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.hobbies.join(", ")}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.specialSkills}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.specialSkills}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.personalInformation?.diseases}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.personal?.healthIssues}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marriage Information Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <Heart className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.marriageRelatedInformation?.marriageInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.marriageRelatedInformation?.guardiansAgree}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 pl-2">
                      <Badge
                        variant={
                          biodata?.marriage?.guardiansAgree
                            ? "default"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {biodata?.marriage?.guardiansAgree ? "আছে" : "নেই"}
                      </Badge>
                    </div>
                  </div>
                  {user?.gender === "female" && (
                    <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                      <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                        {t.marriageRelatedInformation?.jobContinue}:
                      </div>
                      <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                        {biodata?.marriage?.jobStatus}
                      </div>
                    </div>
                  )}
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.marriageRelatedInformation?.studyContinue}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.marriage?.studyContinue}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.marriageRelatedInformation?.reason}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.marriage?.reason}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preference Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <Target className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.expectedLifePartner?.expectedPartner}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.age}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.ageRange} বছর
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.height}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.height}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.educationQualification}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.education}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.maritalStatus}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.maritalStatus}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.financialCondition}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.financialCondition}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.profession}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.profession}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.district}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.location}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.expectedLifePartner?.qualities}:
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 break-words leading-relaxed pl-2">
                      {biodata?.preference?.qualities.join(", ")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/*  Pledge Section */}
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-gray-800 dark:text-gray-100">
                  <Shield className="w-6 h-6 mr-2 text-emerald-600" />
                  {t.pledge.finalPledge}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.pledge?.parentsAware}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 pl-2">
                      <Badge
                        variant={
                          biodata?.pledge?.parentsAware
                            ? "default"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {biodata?.pledge?.parentsAware ? "হ্যাঁ" : "না"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.pledge?.confirmAccurate}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 pl-2">
                      <Badge
                        variant={
                          biodata?.pledge?.informationAccurate
                            ? "default"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {biodata?.pledge?.informationAccurate ? "হ্যাঁ" : "না"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="w-2/5 font-medium text-gray-600 dark:text-gray-300 pr-4 flex-shrink-0 leading-relaxed border-r border-gray-200 dark:border-gray-700">
                      {t.pledge?.nikahResponsibility}
                    </div>
                    <div className="flex-1 text-gray-800 dark:text-gray-100 pl-2">
                      <Badge
                        variant={
                          biodata?.pledge?.nikahResponsibility
                            ? "default"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {biodata?.pledge?.nikahResponsibility ? "হ্যাঁ" : "না"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* {(token && user?.subscriptionType === "premium") || "vip" ? (
              <div className="space-y-2">
                <Button
                  onClick={() => handleViewContact(biodata?.userId?._id || "")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
                >
                  View Contact
                </Button>
              </div>
            ) : (
              <div>
                <Link href={"/registration"}>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full cursor-pointer">
                    {t.createBiodata}
                  </Button>
                </Link>
              </div>
            )} */}

            {/* Three Action Buttons */}
            <div className="mt-6 space-y-3">
              {/* View Contact Information Button */}
              {token && user ? (
                <>
                  <Button
                    onClick={() =>
                      handleViewContact(biodata?.userId?._id || "")
                    }
                    disabled={
                      !["premium", "vip"].includes(user?.subscriptionType || "")
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t.actionButtons?.viewContactInfo}
                  </Button>

                  {/* Upgrade Buttons Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Upgrade to Premium Button */}
                    <Link href="/payment?plan=premium" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg">
                        <Star className="w-4 h-4 mr-2" />
                        <span className="text-sm font-semibold">
                          {t.actionButtons?.upgradePremium}
                        </span>
                      </Button>
                    </Link>

                    {/* Upgrade to VIP Button */}
                    <Link href="/payment?plan=vip" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900 text-white cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg">
                        <Crown className="w-4 h-4 mr-2" />
                        <span className="text-sm font-semibold">
                          {t.actionButtons?.upgradeVip}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                // If not logged in
                <div>
                  <Link href={"/registration"}>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer">
                      {t.createBiodata}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Modal */}
            <ViewContact
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedProfileId(null);
              }}
              profileId={selectedProfileId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
