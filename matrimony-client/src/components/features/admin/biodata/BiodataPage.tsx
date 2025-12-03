"use client";

import type { ApiResponse, BiodataItem } from "@/types/dashboard/biodata";
import { getCookie } from "@/utils/getToken";
import axios from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Phone,
  X,
  Loader2,
} from "lucide-react";

const BiodataPage = () => {
  const [biodataList, setBiodataList] = useState<BiodataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());
  const [selectedBiodata, setSelectedBiodata] = useState<BiodataItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = getCookie("token") || "";

  useEffect(() => {
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }
    fetchPendingBiodata();
  }, [token]);

  const fetchPendingBiodata = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/pending`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );

      if (response?.data?.data) {
        setBiodataList(response.data.data);
      } else {
        setBiodataList([]);
      }
    { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    } catch (err: any) {
      console.error("Error fetching biodata:", err);
      if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch biodata. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string) => {
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      setApprovingIds((prev) => new Set(prev).add(id));
      setError("");

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/approval/${id}`,
        { status: "approved" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );

      setBiodataList((prev) =>
        prev.map((item) =>
          item._id.toString() === id.toString()
            ? { ...item, isApproved: "approved" as const }
            : item
        )
      );

      setIsModalOpen(false);
      setSelectedBiodata(null);
    { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    } catch (err: any) {
      console.error("Error approving biodata:", err);
      if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Biodata not found.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to approve biodata. Please try again."
        );
      }
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleViewBiodata = (biodata: BiodataItem) => {
    setSelectedBiodata(biodata);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBiodata(null);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchPendingBiodata}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Biodata Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review and approve pending biodata submissions
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-900">
                Total Pending: {biodataList.length}
              </span>
            </div>
            <button
              onClick={fetchPendingBiodata}
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Biodata List */}
        {biodataList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Biodata
            </h3>
            <p className="text-gray-600">
              There are no pending biodata submissions to review.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {biodataList.map((biodata) => (
              <div
                key={biodata._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {biodata.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        ID: {biodata._id.slice(-8)}
                      </p>
                    </div>
                    <span className={getStatusBadge(biodata.isApproved)}>
                      {biodata.isApproved.charAt(0).toUpperCase() +
                        biodata.isApproved.slice(1)}
                    </span>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {biodata.gender.charAt(0).toUpperCase() +
                            biodata.gender.slice(1)}
                          , {biodata.age} years
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 truncate">
                          {biodata.userId.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {biodata.userId.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Submitted: {formatDate(biodata.createdAt)}</p>
                      <p>Updated: {formatDate(biodata.updatedAt)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewBiodata(biodata)}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>View Biodata</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedBiodata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Biodata Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Detailed Biodata View */}
            <div className="p-6">
              {/* Header */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBiodata.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3 text-gray-700 flex-wrap">
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedBiodata.age} years
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {selectedBiodata.personal.maritalStatus}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {selectedBiodata.gender}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <Section
                icon={<User className="w-5 h-5" />}
                title="Personal Information"
              >
                <InfoRow
                  label="Height"
                  value={selectedBiodata.personal.height}
                />
                <InfoRow
                  label="Marital Status"
                  value={
                    selectedBiodata.personal.maritalStatus === "unmarried"
                      ? "Unmarried"
                      : "Married"
                  }
                />
                <InfoRow label="Fiqh" value={selectedBiodata.personal.fiqh} />
                <InfoRow
                  label="Prayer Habit"
                  value={selectedBiodata.personal.prayerHabit}
                />
                <InfoRow
                  label="Quran Reading"
                  value={selectedBiodata.personal.quranReading}
                />
                <InfoRow
                  label="Maintain Mahram"
                  value={selectedBiodata.personal.maintainMahram}
                />
                <InfoRow
                  label="Dress Style"
                  value={selectedBiodata.personal.dress}
                />
                <InfoRow
                  label="Entertainment"
                  value={selectedBiodata.personal.entertainment}
                />
                <InfoRow
                  label="Health Issues"
                  value={selectedBiodata.personal.healthIssues}
                />
                <InfoRow
                  label="Special Skills"
                  value={selectedBiodata.personal.specialSkills}
                />
                <InfoRow
                  label="Hobbies"
                  value={selectedBiodata.personal.hobbies.join(", ")}
                />
                <InfoRow
                  label="Favorite Books"
                  value={selectedBiodata.personal.favoriteBooks.join(", ")}
                />
              </Section>

              {/* Address */}
              <Section icon={<MapPin className="w-5 h-5" />} title="Address">
                <InfoRow
                  label="Country"
                  value={selectedBiodata.address.country}
                />
                <InfoRow
                  label="Grew Up At"
                  value={selectedBiodata.address.grewUpAt}
                />
                <div className="mt-3 space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Permanent Address
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedBiodata.address.permanent.address}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedBiodata.address.permanent.upazila},{" "}
                      {selectedBiodata.address.permanent.district},{" "}
                      {selectedBiodata.address.permanent.division}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Present Address
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedBiodata.address.present.address}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedBiodata.address.present.upazila},{" "}
                      {selectedBiodata.address.present.district},{" "}
                      {selectedBiodata.address.present.division}
                    </p>
                  </div>
                </div>
              </Section>

              {/* Education */}
              <Section
                icon={<GraduationCap className="w-5 h-5" />}
                title="Educational Qualification"
              >
                <InfoRow
                  label="Education Method"
                  value={selectedBiodata.education.method}
                />
                {selectedBiodata.education.history.map((edu, idx) => (
                  <div
                    key={idx}
                    className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                  >
                    <InfoRow label="Level" value={edu.level} />
                    <InfoRow label="Institution" value={edu.institution} />
                    <InfoRow label="Subject" value={edu.subject} />
                    <InfoRow label="Year" value={edu.year} />
                    <InfoRow label="Result" value={edu.result} />
                  </div>
                ))}
              </Section>

              {/* Occupation */}
              <Section
                icon={<Briefcase className="w-5 h-5" />}
                title="Occupation"
              >
                <InfoRow
                  label="Current Job"
                  value={selectedBiodata.occupation.current}
                />
                <InfoRow
                  label="Description"
                  value={selectedBiodata.occupation.description}
                />
                <InfoRow
                  label="Income"
                  value={`${selectedBiodata.occupation.income.amount} ${selectedBiodata.occupation.income.currency}`}
                />
              </Section>

              {/* Family */}
              <Section
                icon={<Users className="w-5 h-5" />}
                title="Family Information"
              >
                <InfoRow
                  label="Father"
                  value={
                    selectedBiodata.family.fatherAlive ? "Alive" : "Deceased"
                  }
                />
                <InfoRow
                  label="Father's Profession"
                  value={selectedBiodata.family.fatherProfession}
                />
                <InfoRow
                  label="Mother"
                  value={
                    selectedBiodata.family.motherAlive ? "Alive" : "Deceased"
                  }
                />
                <InfoRow
                  label="Mother's Profession"
                  value={selectedBiodata.family.motherProfession}
                />
                <InfoRow
                  label="Brothers"
                  value={selectedBiodata.family.brothers}
                />
                <InfoRow
                  label="Brothers Info"
                  value={selectedBiodata.family.brothersInfo.join(", ")}
                />
                <InfoRow
                  label="Sisters"
                  value={selectedBiodata.family.sisters}
                />
                <InfoRow
                  label="Sisters Info"
                  value={selectedBiodata.family.sistersInfo.join(", ")}
                />
                <InfoRow
                  label="Uncles' Profession"
                  value={selectedBiodata.family.unclesProfession.join(", ")}
                />
                <InfoRow
                  label="Financial Status"
                  value={selectedBiodata.family.financialStatus}
                />
                <InfoRow
                  label="Financial Details"
                  value={selectedBiodata.family.financialDetails}
                />
                <InfoRow
                  label="Religious Practice"
                  value={selectedBiodata.family.religiousPractice}
                />
              </Section>

              {/* Marriage */}
              <Section
                icon={<Heart className="w-5 h-5" />}
                title="Marriage Information"
              >
                <InfoRow
                  label="Guardians Agree"
                  value={selectedBiodata.marriage.guardiansAgree ? "Yes" : "No"}
                />
                <InfoRow
                  label="Study Continue"
                  value={selectedBiodata.marriage.studyContinue}
                />
                <InfoRow
                  label="Reason for Marriage"
                  value={selectedBiodata.marriage.reason}
                />
              </Section>

              {/* Preferences */}
              <Section
                icon={<Heart className="w-5 h-5" />}
                title="Partner Preferences"
              >
                <InfoRow
                  label="Age Range"
                  value={selectedBiodata.preference.ageRange}
                />
                <InfoRow
                  label="Complexion"
                  value={selectedBiodata.preference.complexion}
                />
                <InfoRow
                  label="Height"
                  value={selectedBiodata.preference.height}
                />
                <InfoRow
                  label="Education"
                  value={selectedBiodata.preference.education}
                />
                <InfoRow
                  label="Location"
                  value={selectedBiodata.preference.location}
                />
                <InfoRow
                  label="Marital Status"
                  value={selectedBiodata.preference.maritalStatus}
                />
                <InfoRow
                  label="Profession"
                  value={selectedBiodata.preference.profession}
                />
                <InfoRow
                  label="Financial Condition"
                  value={selectedBiodata.preference.financialCondition}
                />
                <InfoRow
                  label="Desired Qualities"
                  value={selectedBiodata.preference.qualities.join(", ")}
                />
              </Section>

              {/* Contact */}
              <Section
                icon={<Phone className="w-5 h-5" />}
                title="Contact Information"
              >
                <InfoRow
                  label="Guardian's Phone"
                  value={selectedBiodata.contactInfo.guardianPhone}
                />
                <InfoRow
                  label="Relation"
                  value={selectedBiodata.contactInfo.relation}
                />
                <InfoRow label="Email" value={selectedBiodata.userId.email} />
                <InfoRow label="Phone" value={selectedBiodata.userId.phone} />
              </Section>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
                <p>Biodata ID: {selectedBiodata._id}</p>
                <p className="mt-1">
                  Created on: {formatDate(selectedBiodata.createdAt)}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              {selectedBiodata.isApproved === "pending" ? (
                <button
                  onClick={() => handleApproval(selectedBiodata._id)}
                  disabled={approvingIds.has(selectedBiodata._id)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium cursor-pointer"
                >
                  {approvingIds.has(selectedBiodata._id) ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Approve Biodata</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-lg text-center font-medium">
                  Already Approved
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-100">
      <div className="text-emerald-600">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="pl-7 space-y-2">{children}</div>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm font-medium text-gray-600 w-48 flex-shrink-0">
      {label}:
    </span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

export default BiodataPage;
