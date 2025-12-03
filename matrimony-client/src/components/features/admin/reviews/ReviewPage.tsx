"use client";

import { ApiError, Review } from "@/types/dashboard/reviews";
import { getCookie } from "@/utils/getToken";
import axios, { AxiosError } from "axios";
import {
  CheckCircle,
  Eye,
  Star,
  X,
  Trash2,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("token") || "";

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApiError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 401) {
        toast.error("Authentication failed", {
          description: "Please login again to continue.",
          action: {
            label: "Refresh",
            onClick: () => window.location.reload(),
          },
        });
        return;
      }

      if (axiosError.response?.status === 403) {
        toast.error("Access denied", {
          description: "You don't have permission to perform this action.",
        });
        return;
      }

      if (axiosError.response?.status === 404) {
        toast.error("Not found", {
          description: "The requested resource was not found.",
        });
        return;
      }

      if (
        typeof axiosError.response?.status === "number" &&
        axiosError.response.status >= 500
      ) {
        toast.error("Server error", {
          description:
            "Something went wrong on our end. Please try again later.",
        });
        return;
      }

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        defaultMessage;
      toast.error("Operation failed", {
        description: errorMessage,
      });
    } else if (error instanceof Error) {
      toast.error("Error", {
        description: error.message || defaultMessage,
      });
    } else {
      toast.error("Unknown error", {
        description: defaultMessage,
      });
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/pending`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );

      const data = response.data?.data;
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format received from server.");
      }

      setReviews(data);
    } catch (error) {
      setError("Failed to load reviews");
      handleApiError(error, "Failed to fetch reviews. Please try again.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    if (!reviewId) {
      toast.error("Invalid review", {
        description: "Review ID is missing.",
      });
      return;
    }

    if (!token) {
      toast.error("Authentication required", {
        description: "Please login to continue.",
      });
      return;
    }

    try {
      setActionLoading(reviewId);

      const loadingToast = toast.loading("Approving review...", {
        description: "Please wait while we process your request.",
      });

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/approve/${reviewId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 8000,
        }
      );

      // Update the review status locally
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? { ...review, status: "approved" as const }
            : review
        )
      );

      if (selectedReview?._id === reviewId) {
        setSelectedReview((prev) =>
          prev ? { ...prev, status: "approved" as const } : null
        );
      }

      toast.dismiss(loadingToast);
      toast.success("Review approved!", {
        description:
          "The review has been successfully approved and is now visible to users.",
        action: {
          label: "Undo",
          onClick: () => {
            // Optionally implement undo functionality
            toast.info("Undo functionality coming soon");
          },
        },
      });
    } catch (error) {
      handleApiError(error, "Failed to approve review. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!reviewId) {
      toast.error("Invalid review", {
        description: "Review ID is missing.",
      });
      return;
    }

    if (!token) {
      toast.error("Authentication required", {
        description: "Please login to continue.",
      });
      return;
    }

    // Show confirmation toast instead of browser confirm
    toast("Are you sure you want to delete this review?", {
      description:
        "This action cannot be undone. The review will be permanently removed.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            setActionLoading(reviewId);

            const loadingToast = toast.loading("Deleting review...", {
              description: "Please wait while we process your request.",
            });

            await axios.delete(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/delete/${reviewId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                timeout: 8000, // 8 second timeout
              }
            );

            // Remove the review from the list
            setReviews((prev) =>
              prev.filter((review) => review._id !== reviewId)
            );

            if (selectedReview?._id === reviewId) {
              setIsModalOpen(false);
              setSelectedReview(null);
            }

            toast.dismiss(loadingToast);
            toast.success("Review deleted", {
              description:
                "The review has been permanently removed from the system.",
            });
          } catch (error) {
            handleApiError(error, "Failed to delete review. Please try again.");
          } finally {
            setActionLoading(null);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  const openModal = (review: Review) => {
    try {
      if (!review || !review._id) {
        toast.error("Invalid review", {
          description: "Cannot open review details. Review data is missing.",
        });
        return;
      }

      setSelectedReview(review);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("Failed to open review", {
        description: "An error occurred while opening the review details.",
      });
    }
  };

  const closeModal = () => {
    try {
      setIsModalOpen(false);
      setSelectedReview(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to close modal", {
        description: "An error occurred while closing the modal.",
      });
    }
  };

  // Network connectivity check
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Connection restored", {
        description: "You're back online. Data will be refreshed.",
      });
      fetchReviews();
    };

    const handleOffline = () => {
      toast.error("No internet connection", {
        description: "Please check your internet connection and try again.",
        duration: Infinity,
        action: {
          label: "Retry",
          onClick: () => {
            if (navigator.onLine) {
              fetchReviews();
            } else {
              toast.error("Still offline", {
                description: "Please check your internet connection.",
              });
            }
          },
        },
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial connection state
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Unknown date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const renderStars = (rating: number) => {
    try {
      const validRating = Math.max(0, Math.min(5, rating || 0));
      return [...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(validRating)
              ? "text-yellow-400 fill-current"
              : validRating > i && validRating < i + 1
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
        />
      ));
    } catch (error) {
      console.error("Error rendering stars:", error);
      return <span className="text-gray-400">Rating unavailable</span>;
    }
  };

  const validateReviewData = (review: Review): boolean => {
    return !!(
      review &&
      review._id &&
      review.biodataId?.name &&
      review.userId?.email &&
      typeof review.rating === "number" &&
      review.comment &&
      review.status &&
      review.createdAt
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Failed to load reviews
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
              {error}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchReviews}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Retrying..." : "Try Again"}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Review Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and moderate user reviews ({reviews.length} reviews)
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={fetchReviews}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.filter(validateReviewData).map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review.biodataId?.name || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.userId?.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {review.rating || 0}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {review.comment || "No comment"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : review.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.status || "unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(review)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {review.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(review._id)}
                            disabled={actionLoading === review._id}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 disabled:opacity-50"
                            title="Approve review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            disabled={actionLoading === review._id}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {reviews.filter(validateReviewData).map((review) => (
            <div
              key={review._id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {review.biodataId?.name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.userId?.email || "No email"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : review.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {review.status || "unknown"}
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-600">
                  {review.rating || 0}/5
                </span>
              </div>

              <p className="text-gray-600 mb-3 text-sm">
                {review.comment || "No comment"}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(review.createdAt)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(review)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {review.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        disabled={actionLoading === review._id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                        title="Approve review"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={actionLoading === review._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Show message if all reviews are invalid */}
          {reviews.length > 0 &&
            reviews.filter(validateReviewData).length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-8 w-8 text-yellow-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Invalid review data
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Some reviews contain invalid data and cannot be displayed.
                </p>
                <button
                  onClick={fetchReviews}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Refresh Data
                </button>
              </div>
            )}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No reviews
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No pending reviews to display.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Review Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!validateReviewData(selectedReview) ? (
              <div className="p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                <h4 className="mt-2 text-lg font-medium text-gray-900">
                  Invalid Review Data
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  This review contains incomplete or invalid data.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedReview.biodataId?.name || "Unknown User"}
                    </h4>
                    <p className="text-gray-600">
                      {selectedReview.userId?.email || "No email"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                      <span>
                        Age: {selectedReview.biodataId?.age || "Unknown"}
                      </span>
                      <span>•</span>
                      <span>
                        Gender: {selectedReview.biodataId?.gender || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="flex">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedReview.rating || 0}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {selectedReview.comment || "No comment provided"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        selectedReview.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedReview.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedReview.status || "unknown"}
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Created
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatDate(selectedReview.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Updated
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatDate(selectedReview.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {selectedReview.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(selectedReview._id)}
                      disabled={actionLoading === selectedReview._id}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {actionLoading === selectedReview._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve Review</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedReview._id)}
                      disabled={actionLoading === selectedReview._id}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {actionLoading === selectedReview._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Review</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
