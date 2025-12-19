"use client";

import * as React from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageLoader } from "@/components/common/Loader";
import axios, { type AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import SearchFilters from "../Home/SearchFilters/SearchFilters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import { useAuth } from "@/app/(auth)/context/auth-context";

interface BiodataProps {
  _id: string;
  personal: {
    height: string;
  };
  userId: {
    _id: string;
  };
  occupation: {
    current: string;
  };
  age: number;
  name: string;
  gender: string;
}

export default function ProfessionalBiodatasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profiles, setProfiles] = React.useState<BiodataProps[]>([]);
  const [error, setError] = React.useState<string>("");

  const { user } = useAuth();

  const divisionMap: Record<string, string> = {
    "1": "Chattagram",
    "2": "Rajshahi",
    "3": "Khulna",
    "4": "Barisal",
    "5": "Sylhet",
    "6": "Dhaka",
    "7": "Rangpur",
    "8": "Mymensingh",
  };

  const getAllBioData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Get search parameters from URL
      const gender = searchParams.get("gender") || "";
      const minAge = searchParams.get("minAge");
      const maxAge = searchParams.get("maxAge");
      const division = searchParams.get("division") || "";
      const district = searchParams.get("district") || "";
      const upazila = searchParams.get("upazila") || "";
      const profession = searchParams.get("profession") || "";
      const education = searchParams.get("education") || "";
      const maritalStatus = searchParams.get("maritalStatus") || "";
      const incomeRange = searchParams.get("incomeRange") || "";
      const university = searchParams.get("university") || "";

      // Build query parameters
      const queryParams: Record<string, string | number> = {};

      if (gender) queryParams.gender = gender;
      if (minAge) queryParams.minAge = minAge;
      if (maxAge) queryParams.maxAge = maxAge;
      if (division) {
        const divisionName = divisionMap[division];
        if (divisionName) {
          queryParams["address.present.division"] = divisionName;
        }
      }
      if (district) queryParams["address.present.district"] = district;
      if (upazila) queryParams["address.present.upazila"] = upazila;
      if (profession) queryParams.profession = profession;
      if (education) queryParams.education = education;
      if (maritalStatus) queryParams["personal.maritalStatus"] = maritalStatus;
      if (incomeRange) queryParams.incomeRange = incomeRange;
      if (university) queryParams["education.history.institution"] = university;

      // console.log("Frontend sending these params:", queryParams)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/all`,
        {
          params: queryParams,
          timeout: 10000,
        }
      );

      // console.log("Backend response:", response.data);

      if (response.data?.success || response.data?.data) {
        const profilesData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setProfiles(profilesData);
        setShowFilters(false);

        if (profilesData.length === 0) {
          setError("No profiles found matching your criteria.");
        }
      } else {
        setError("No profiles found or invalid response format.");
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching biodata:", error);

      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        setError("You are not authorized. Please login first.");
        router.push("/login");
      } else if (axiosError.response?.status === 403) {
        setError("Access denied. You don't have permission to view profiles.");
      } else if (axiosError.response?.status === 404) {
        setError("Biodata service not found. Please contact support.");
      } else if (axiosError.code === "ECONNABORTED") {
        setError(
          "Request timeout. Please check your internet connection and try again."
        );
      } else if (!navigator.onLine) {
        setError(
          "No internet connection. Please check your network and try again."
        );
      } else {
        setError(
          (axiosError.response?.data &&
          typeof axiosError.response.data === "object" &&
          "message" in axiosError.response.data
            ? (axiosError.response.data as { message?: string }).message
            : undefined) || "Failed to fetch profiles. Please try again later."
        );
      }

      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getAllBioData();
  }, [searchParams]);

  const handleRetry = () => {
    setError("");
    getAllBioData();
  };
  // console.log(profiles)

  const { language } = useLanguage();
  const t = biodataTranslation[language];
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters{" "}
              </Button>

              {error && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <>
          <SearchFilters />
        </>
      )}
      <div className="container mx-auto px-4">
        {isLoading && <PageLoader />}
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-4 pb-12">
            {profiles.map((biodata) => {
              return (
                <Card
                  key={biodata._id}
                  className="flex flex-col justify-between p-4 shadow-md dark:shadow-gray-800 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                >
                  {/* Left side */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border border-emerald-500 dark:border-emerald-400">
                      <AvatarImage src="/placeholder.svg" alt="profile" />
                      <AvatarFallback className="bg-yellow-100 dark:bg-yellow-100 text-gray-600 dark:text-gray-200">
                        👤
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {user?.subscriptionType === "premium" ||
                      user?.subscriptionType === "vip" ? (
                        <h2 className="text-lg font-semibold text-black dark:text-gray-300">
                          {biodata?.name}
                        </h2>
                      ) : (
                        <h2 className="text-lg font-semibold text-black dark:text-gray-300">
                          {biodata?.gender === "female"
                            ? t.singleBiodata?.femaleBiodata
                            : t.singleBiodata?.maleBiodata}
                        </h2>
                      )}

                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t.personalInformation?.age} - {biodata?.age}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t.expectedLifePartner?.height} -{" "}
                        {biodata?.personal?.height}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t.OccupationalInformation?.occupation} -{" "}
                        {biodata?.occupation?.current}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex justify-end mt-4">
                    <Link href={`/biodatas/${biodata?._id}`}>
                      <Button
                        variant="outline"
                        className="rounded-full text-emerald-600 dark:text-emerald-400 border-yellow-500 dark:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 bg-white dark:bg-gray-800 transition-colors duration-200 cursor-pointer"
                      >
                        {t.biodataBtn} →
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No data found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
