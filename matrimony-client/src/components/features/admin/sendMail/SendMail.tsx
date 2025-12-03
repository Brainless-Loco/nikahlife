"use client";
import {
  ApiResponse,
  DraftData,
  MailData,
  Notification,
} from "@/types/dashboard/sendEmail";
import { getCookie } from "@/utils/getToken";
import { Send, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState, ChangeEvent } from "react";

const SendMailPage = () => {
  const [mailData, setMailData] = useState<MailData>({
    recipients: "all",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (
    type: "success" | "error",
    message: string
  ): void => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSendMail = async (): Promise<void> => {
    // Validation
    if (!mailData.subject.trim() || !mailData.message.trim()) {
      showNotification(
        "error",
        "Please fill in both subject and message fields"
      );
      return;
    }

    if (mailData.recipients === "single" && !mailData.email.trim()) {
      showNotification("error", "Please enter the recipient email address");
      return;
    }

    // Email validation for single user
    if (mailData.recipients === "single") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mailData.email.trim())) {
        showNotification("error", "Please enter a valid email address");
        return;
      }
    }
    const token = getCookie("token") || "";
    if (!token) {
      showNotification(
        "error",
        "Authentication required. Please log in again."
      );
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL not configured");
      }

      let url: string;
      const body = {
        subject: mailData.subject.trim(),
        body: mailData.message.trim(),
      };

      if (mailData.recipients === "all") {
        url = `${baseUrl}/mail/send-all`;
      } else {
        url = `${baseUrl}/mail/send-single?email=${encodeURIComponent(
          mailData.email.trim()
        )}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(body),
      });

      const responseData: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Success
      const recipientText =
        mailData.recipients === "all" ? "all users" : mailData.email.trim();

      showNotification(
        "success",
        `Email sent successfully to ${recipientText}!`
      );

      // Reset form
      setMailData({
        recipients: "all",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      // Handle different types of errors
      let errorMessage = "Failed to send email. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (
          error.message.includes("403") ||
          error.message.includes("Forbidden")
        ) {
          errorMessage = "You do not have permission to send emails.";
        } else if (error.message.includes("429")) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = (): void => {
    const draftData: DraftData = {
      ...mailData,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem("emailDraft", JSON.stringify(draftData));
      showNotification("success", "Draft saved successfully!");
    } catch (error) {
      console.log(error);
      showNotification("error", "Failed to save draft");
    }
  };

  const loadDraft = (): void => {
    try {
      const draft = localStorage.getItem("emailDraft");
      if (draft) {
        const draftData: DraftData = JSON.parse(draft);
        setMailData({
          recipients: draftData.recipients || "all",
          email: draftData.email || "",
          subject: draftData.subject || "",
          message: draftData.message || "",
        });
        showNotification("success", "Draft loaded successfully!");
      } else {
        showNotification("error", "No saved draft found");
      }
    } catch (error) {
      console.log(error);
      showNotification("error", "Failed to load draft");
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-emerald-600" />
            Send Email
          </h2>
          <button
            onClick={loadDraft}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Load Draft
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Recipients *
              </label>
              <select
                value={mailData.recipients}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setMailData({
                    ...mailData,
                    recipients: e.target.value as "all" | "single",
                    email: "",
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                disabled={isLoading}
              >
                <option value="all">All Users</option>
                <option value="single">Single User</option>
              </select>
            </div>

            {mailData.recipients === "single" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={mailData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMailData({ ...mailData, email: e.target.value })
                  }
                  placeholder="Enter recipient email address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Subject *
              </label>
              <input
                type="text"
                value={mailData.subject}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMailData({ ...mailData, subject: e.target.value })
                }
                placeholder="Enter email subject"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Message *
            </label>
            <textarea
              value={mailData.message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setMailData({ ...mailData, message: e.target.value })
              }
              placeholder="Enter your message..."
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500">
              Characters: {mailData.message.length}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSendMail}
              disabled={
                isLoading ||
                !mailData.subject.trim() ||
                !mailData.message.trim() ||
                (mailData.recipients === "single" && !mailData.email.trim())
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[140px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </button>

            <button
              onClick={saveDraft}
              disabled={isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
          </div>

          {/* Form Requirements */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>Requirements:</strong>
            <ul className="mt-1 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>• For single user emails, enter a valid email address</li>
              <li>• Make sure you&apos;re logged in before sending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMailPage;
