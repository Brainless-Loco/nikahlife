"use client";
import {
  ApiError,
  FormData,
  SpecialOffer,
} from "@/types/dashboard/specialOffer";
import { formatDate } from "@/utils/formatDate";
import { getCookie } from "@/utils/getToken";
import axios, { AxiosError } from "axios";
import {
  Calendar,
  Clock,
  Download,
  Edit3,
  Filter,
  Gift,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  WifiOff,
  ServerCrash,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// Error handling utility
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
   {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    const axiosError = error as AxiosError<any>;

    if (!axiosError.response) {
      // Network error
      return {
        message: "Network error. Please check your internet connection.",
        statusCode: 0,
        details: "Unable to reach the server",
      };
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data;

    switch (status) {
      case 400:
        return {
          message: data?.message || "Invalid request. Please check your input.",
          statusCode: status,
          details: "Bad Request",
        };
      case 401:
        return {
          message: "Authentication failed. Please log in again.",
          statusCode: status,
          details: "Unauthorized",
        };
      case 403:
        return {
          message: "You don't have permission to perform this action.",
          statusCode: status,
          details: "Forbidden",
        };
      case 404:
        return {
          message: "The requested resource was not found.",
          statusCode: status,
          details: "Not Found",
        };
      case 422:
        return {
          message:
            data?.message || "Validation failed. Please check your input.",
          statusCode: status,
          details: "Unprocessable Entity",
        };
      case 429:
        return {
          message: "Too many requests. Please try again later.",
          statusCode: status,
          details: "Rate Limited",
        };
      case 500:
        return {
          message: "Server error. Please try again later.",
          statusCode: status,
          details: "Internal Server Error",
        };
      default:
        return {
          message: data?.message || "An unexpected error occurred.",
          statusCode: status,
          details: `HTTP ${status}`,
        };
    }
  }

  // Non-Axios error
  return {
    message: error?.message || "An unexpected error occurred.",
    details: "Unknown Error",
  };
};

// Toast wrapper with error handling
type ToastAction = {
  label: string;
  onClick: () => void;
};

type ToastOptions = {
  action?: ToastAction;
  [key: string]: unknown;
};

const showToast = {
  success: (message: string, options?: ToastOptions) => {
    try {
      toast.success(message, {
        ...(typeof options === "object" && options !== null ? options : {}),
        action: options?.action
          ? {
              label: options.action.label,
              onClick: () => {
                try {
                  options?.action?.onClick();
                } catch (err) {
                  console.error("Toast action error:", err);
                }
              },
            }
          : undefined,
      });
    } catch (error) {
      console.error("Toast success error:", error);
      // fallback
      alert(`Success: ${message}`);
    }
  },

  error: (message: string, options?: ToastOptions) => {
    try {
      toast.error(message, {
        duration: 6000,
        ...options,
      });
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to browser alert if toast fails
      alert(`Error: ${message}`);
    }
  },

  loading: (message: string, options?: ToastOptions) => {
    try {
      return toast.loading(message, options);
    } catch (error) {
      console.error("Toast loading error:", error);
      return null;
    }
  },

  dismiss: (toastId?: string | number) => {
    try {
      toast.dismiss(toastId);
    } catch (error) {
      console.error("Toast dismiss error:", error);
    }
  },
};

const SpecialOffersPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"post" | "get">("post");
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form states with proper typing
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    validTill: "",
  });

  const token = getCookie("token") || "";

  // Fetch special offers with comprehensive error handling
  const fetchSpecialOffers = useCallback(async () => {
    if (!token) {
      showToast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setFetchLoading(true);
      setError(null);

      const response = await axios.get<{ data: SpecialOffer[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/special-offers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );

      // Validate response data
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Sort by creation date (newest first)
      const sortedOffers = response.data.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOffers(sortedOffers);

    } catch (error: unknown) {
      const apiError = handleApiError(error);
      setError(apiError.message);
      showToast.error(apiError.message, {
        description: apiError.details,
      });
      console.error("Error fetching offers:", error);
    } finally {
      setFetchLoading(false);
    }
  }, [token]);

  // Handle submit offer with enhanced error handling
  const handleSubmitOffer = async () => {
    // Validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.validTill
    ) {
      showToast.error("Please fill all required fields");
      return;
    }

    if (!token) {
      showToast.error("Authentication token not found. Please log in again.");
      return;
    }

    // Validate date
    const validTillDate = new Date(formData.validTill);
    if (validTillDate <= new Date()) {
      showToast.error("Valid till date must be in the future");
      return;
    }

    // Check if date is too far in the future (optional validation)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (validTillDate > oneYearFromNow) {
      showToast.error("Valid till date cannot be more than 1 year from now");
      return;
    }

    setLoading(true);
    const loadingToast = showToast.loading("Creating special offer...");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/special-offers`,
        {
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 15000,
        }
      );

      // Reset form
      setFormData({ title: "", description: "", validTill: "" });

      // Dismiss loading toast
      showToast.dismiss(loadingToast ?? undefined);

      // Switch to offers tab and refresh
      setActiveTab("get");
      await fetchSpecialOffers();

      showToast.success("Special offer created successfully!", {
        description: `"${formData.title}" is now active`,
      });
    } catch (error: unknown) {
      showToast.dismiss(loadingToast ?? undefined);
      const apiError = handleApiError(error);
      showToast.error("Failed to create special offer", {
        description: apiError.message,
      });
      console.error("Error creating offer:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete offer with enhanced error handling
  const handleDeleteOffer = async (offerId: string, offerTitle: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${offerTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    if (!token) {
      showToast.error("Authentication token not found. Please log in again.");
      return;
    }

    setDeleteLoading(offerId);
    const loadingToast = showToast.loading(`Deleting "${offerTitle}"...`);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/special-offers/${offerId}`,
        {
          headers: {
            Authorization: token,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Remove from local state
      setOffers(offers.filter((offer) => offer._id !== offerId));

      showToast.dismiss(loadingToast ?? undefined);
      showToast.success("Offer deleted successfully!", {
        description: `"${offerTitle}" has been removed`,
      });
    } catch (error: unknown) {
      showToast.dismiss(loadingToast ?? undefined);
      const apiError = handleApiError(error);
      showToast.error("Failed to delete offer", {
        description: apiError.message,
      });
      console.error("Error deleting offer:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Check if offer is expired
  const isOfferExpired = (validTill: string): boolean => {
    try {
      return new Date(validTill) < new Date();
    } catch (error) {
      console.error("Date parsing error:", error);
      return false;
    }
  };

  // Get minimum datetime for input (current time + 1 hour)
  const getMinDateTime = (): string => {
    try {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Initial fetch with error handling
  useEffect(() => {
    if (token) {
      fetchSpecialOffers();
    } else {
      setFetchLoading(false);
      setError("Authentication token not found. Please log in.");
    }
  }, [token, fetchSpecialOffers]);

  // Error boundary for the entire component
  if (error && !fetchLoading && offers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="text-center py-12">
            {navigator.onLine === false ? (
              <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
            ) : (
              <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {navigator.onLine === false
                ? "No Internet Connection"
                : "Something went wrong"}
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchSpecialOffers}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Special Offers Management
          </h2>
          {activeTab === "get" && (
            <button
              onClick={fetchSpecialOffers}
              disabled={fetchLoading}
              className="px-3 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${fetchLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("post")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === "post"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Post Special Offer
          </button>
          <button
            onClick={() => setActiveTab("get")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === "get"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Gift className="w-4 h-4 inline mr-2" />
            All Special Offers ({offers.length})
          </button>
        </div>

        {/* Post Offer Tab */}
        {activeTab === "post" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  Offer Title
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter offer title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  Valid Till
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.validTill}
                  onChange={(e) =>
                    setFormData({ ...formData, validTill: e.target.value })
                  }
                  min={getMinDateTime()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter offer description"
                rows={4}
                maxLength={500}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              />
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            <button
              onClick={handleSubmitOffer}
              disabled={
                loading ||
                !formData.title.trim() ||
                !formData.description.trim() ||
                !formData.validTill
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Offer...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Offer
                </>
              )}
            </button>
          </div>
        )}

        {/* Get All Offers Tab */}
        {activeTab === "get" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Total Offers:{" "}
                <span className="font-semibold">{offers.length}</span>
                {offers.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (
                    {
                      offers.filter((offer) => !isOfferExpired(offer.validTill))
                        .length
                    }{" "}
                    active,{" "}
                    {
                      offers.filter((offer) => isOfferExpired(offer.validTill))
                        .length
                    }{" "}
                    expired)
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-4 py-2 text-gray-400 border border-gray-300 rounded-lg cursor-not-allowed flex items-center"
                  title="Filter functionality coming soon"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center"
                  title="Export functionality coming soon"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {fetchLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading offers...</span>
                </div>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No special offers
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first special offer to get started.
                </p>
                <button
                  onClick={() => setActiveTab("post")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Offer
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div
                    key={offer._id}
                    className={`border rounded-lg p-4 transition-all ${
                      isOfferExpired(offer.validTill)
                        ? "bg-red-50 border-red-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {offer.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                                isOfferExpired(offer.validTill)
                                  ? "bg-red-100 text-red-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {isOfferExpired(offer.validTill) ? (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Expired
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {offer.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Valid till: {formatDate(offer.validTill)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Created: {formatDate(offer.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          disabled
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg cursor-not-allowed transition-colors"
                          title="Edit functionality coming soon"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteOffer(offer._id, offer.title)
                          }
                          disabled={deleteLoading === offer._id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete offer"
                        >
                          {deleteLoading === offer._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialOffersPage;
