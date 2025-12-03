"use client";
import { getCookie } from "@/utils/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/common/Loader";
import ShortlistCard from "./ShortlistCard";

const MySentInterest = () => {
  const [shortList, setShortList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const token = getCookie("token") || "";
  useEffect(() => {
    const fetchInterestSent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/shortList`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            timeout: 10000,
          }
        );
        setShortList(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterestSent();
  }, []);

  console.log(shortList);
  if (loading) return <PageLoader />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10 p-4 sm:p-6 lg:p-8">
      <div className="container px-4 mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-balance mb-2">
            My Shortlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-pretty">
            View all your shortlisted profile.
          </p>
          {shortList.length > 0 && (
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shortList.length} interest
                {shortList.length !== 1 ? "s" : ""} sent
              </span>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {shortList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {shortList.map((biodata, index) => {

              return <ShortlistCard key={index} biodata={biodata} />;
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              {/* <User className="w-12 h-12 text-emerald-600 dark:text-emerald-400" /> */}{" "}
              ash
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No interests sent yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-pretty max-w-md mx-auto">
              When you send interests to potential matches, they will appear
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySentInterest;
