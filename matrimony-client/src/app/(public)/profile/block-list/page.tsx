"use client";

import { PageLoader } from "@/components/common/Loader";
import { getCookie } from "@/utils/getToken";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

// TypeScript interfaces
interface IgnoredUser {
  name: string;
  _id: string;
}

interface BlockedUserData {
  createdAt: string;
  ignoredUser: IgnoredUser;
  updatedAt: string;
  user: string;
  __v: number;
  _id: string;
}

interface ApiResponse {
  data: BlockedUserData[];
  message?: string;
  success?: boolean;
}

const BlockList: React.FC = () => {
  const [ignoredUsers, setIgnoredUsers] = useState<BlockedUserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unblockingUsers, setUnblockingUsers] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const token: string = getCookie("token") || "";
  // Fetch blocked users
  useEffect(() => {
    const fetchIgnoredUsers = async (): Promise<void> => {
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/ignore`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            timeout: 10000,
          }
        );

        setIgnoredUsers(response?.data?.data || []);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error fetching ignored users:", error);

        if (error.response?.status === 401) {
          setError("Authentication failed. Please login again.");
        } else if (error.response?.status === 403) {
          setError(
            "Access denied. You don't have permission to view blocked users."
          );
        } else if (error.code === "ECONNABORTED") {
          setError("Request timeout. Please check your internet connection.");
        } else if (!navigator.onLine) {
          setError("No internet connection. Please check your network.");
        } else {
          setError("Failed to load blocked users. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIgnoredUsers();
  }, [token]);

  // Unblock user function
  const handleUnblock = async (ignoredUserId: string): Promise<void> => {
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      setUnblockingUsers((prev) => new Set(prev).add(ignoredUserId));
      setError(null);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ignore/unignore?ignoredUserId=${ignoredUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );

      // Remove the user from the list
      setIgnoredUsers((prev) =>
        prev.filter((user) => user.ignoredUser._id !== ignoredUserId)
      );
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error unblocking user:", error);

      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        setError("Access denied. You don't have permission to unblock users.");
      } else if (error.response?.status === 404) {
        setError("User not found or already unblocked.");
        // Remove from UI anyway since it might be already unblocked
        setIgnoredUsers((prev) =>
          prev.filter((user) => user.ignoredUser._id !== ignoredUserId)
        );
      } else if (error.code === "ECONNABORTED") {
        setError("Request timeout. Please try again.");
      } else if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else {
        setError("Failed to unblock user. Please try again.");
      }
    } finally {
      setUnblockingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ignoredUserId);
        return newSet;
      });
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Get avatar initials
  const getAvatarInitials = (email: string): string => {
    try {
      if (!email) return "U";
      const parts = email.split("@")[0].split(".");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return email.charAt(0).toUpperCase();
    } catch (error) {
      console.error("Error generating avatar initials:", error);
      return "U";
    }
  };

  // Retry function for errors
  const handleRetry = (): void => {
    window.location.reload();
  };

  // Clear error
  const clearError = (): void => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Blocked Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your blocked user list
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleRetry}
                    type="button"
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline focus:outline-none"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={clearError}
                    type="button"
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline focus:outline-none"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div>
            <PageLoader />
          </div>
        ) : ignoredUsers.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No blocked users
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You haven&apos;t blocked any users yet.
              </p>
            </div>
          </div>
        ) : (
          /* User List */
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {ignoredUsers.length} blocked user
              {ignoredUsers.length !== 1 ? "s" : ""}
            </div>

            {ignoredUsers.map((userBlock: BlockedUserData) => (
              <div
                key={userBlock._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {getAvatarInitials(userBlock.ignoredUser.name)}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {userBlock.ignoredUser.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Blocked on {formatDate(userBlock.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Unblock Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleUnblock(userBlock.ignoredUser._id)}
                      disabled={unblockingUsers.has(userBlock.ignoredUser._id)}
                      type="button"
                      aria-label={`Unblock ${userBlock.ignoredUser.name}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium transition-colors duration-200 disabled:cursor-not-allowed min-w-[120px] justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      {unblockingUsers.has(userBlock.ignoredUser._id) ? (
                        <>
                          <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                            aria-hidden="true"
                          ></div>
                          Unblocking...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                            />
                          </svg>
                          Unblock
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate">
                      User ID: {userBlock.ignoredUser._id}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">Block ID: {userBlock._id}</span>
                    {userBlock.updatedAt !== userBlock.createdAt && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">
                          Updated: {formatDate(userBlock.updatedAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && ignoredUsers.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing all {ignoredUsers.length} blocked user
              {ignoredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockList;
