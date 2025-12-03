"use client";

import type React from "react";
import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/app/(auth)/context/auth-context";

export default function PostTestimony() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.error("দয়া করে সব ফিল্ড পূরণ করুন");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!token) {
        toast.error("অনুগ্রহ করে লগইন করুন");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/review`,
        {
          rating,
          comment: comment,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "রিভিউ সফলভাবে জমা দেওয়া হয়েছে!"
        );
        setRating(0);
        setComment("");
      }
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error(
        error.response?.data?.message || "রিভিউ জমা দিতে সমস্যা হয়েছে"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-emerald-800 mb-2">
              আপনার মতামত জানান
            </CardTitle>
            <p className="text-emerald-600">
              আমাদের সার্ভিস সম্পর্কে আপনার মতামত জানান
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="space-y-3">
                <Label className="text-emerald-700 font-medium">
                  রেটিং দিন *
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-emerald-600 font-medium">
                    {rating > 0 && (
                      <>
                        {rating} স্টার
                        {rating === 5 && " - চমৎকার!"}
                        {rating === 4 && " - ভালো"}
                        {rating === 3 && " - মোটামুটি"}
                        {rating === 2 && " - খারাপ"}
                        {rating === 1 && " - অত্যন্ত খারাপ"}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="comment"
                  className="text-emerald-700 font-medium"
                >
                  আপনার মন্তব্য *
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="আমাদের সার্ভিস সম্পর্কে আপনার অভিজ্ঞতা বিস্তারিত লিখুন..."
                  className="min-h-[120px] border-emerald-200 focus:ring-2 placeholder:text-gray-800 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-gray-950"
                  required
                />
                <p className="text-sm text-emerald-600">
                  অন্তত ১০ শব্দ লিখুন। বর্তমানে:{" "}
                  {
                    comment
                      .trim()
                      .split(" ")
                      .filter((word) => word.length > 0).length
                  }{" "}
                  শব্দ
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !rating || !comment.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    জমা দেওয়া হচ্ছে...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    রিভিউ জমা দিন
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines Card */}
        <Card className="mt-6 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="font-bold text-emerald-800 mb-3">
              রিভিউ লেখার নির্দেশনা:
            </h3>
            <ul className="space-y-2 text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                সৎ এবং গঠনমূলক মতামত দিন
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                ব্যক্তিগত আক্রমণ বা অশালীন ভাষা ব্যবহার করবেন না
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                আপনার প্রকৃত অভিজ্ঞতার ভিত্তিতে রিভিউ দিন
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                রিভিউ অনুমোদনের পর প্রকাশিত হবে
              </li>
            </ul>
          </CardContent>
        </Card>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
}
