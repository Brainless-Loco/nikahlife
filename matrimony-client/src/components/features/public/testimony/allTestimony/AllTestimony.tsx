"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Testimonial {
  _id: string;
  userId: {
    _id: string;
    gender: string;
    email: string;
  };
  biodataId: {
    _id: string;
    name: string;
    gender: string;
    age: number;
  };
  rating: number;
  comment: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AllTestimony() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const testimonialsPerSlide = getTestimonialsPerSlide();
    const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const getTestimonialsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3; // lg screens
      if (window.innerWidth >= 768) return 2; // md screens
      return 1; // sm screens
    }
    return 3; // default for SSR
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/review`,
        {}
      );

      let testimonialsData = response.data;

      // If response.data is an object with a data property, use that
      if (
        testimonialsData &&
        typeof testimonialsData === "object" &&
        testimonialsData.data
      ) {
        testimonialsData = testimonialsData.data;
      }

      // If response.data has a reviews property, use that
      if (
        testimonialsData &&
        typeof testimonialsData === "object" &&
        testimonialsData.reviews
      ) {
        testimonialsData = testimonialsData.reviews;
      }

      // Ensure we have an array
      if (Array.isArray(testimonialsData)) {
        setTestimonials(testimonialsData);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      console.log("[v0] Setting empty testimonials array due to error");
      setTestimonials([]);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const getAvatarImage = (gender: string) => {
    return gender === "female" ? "/female_avatar.jpg" : "/male_avatar.jpg";
  };

  const nextSlide = () => {
    const testimonialsPerSlide = getTestimonialsPerSlide();
    const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    const testimonialsPerSlide = getTestimonialsPerSlide();
    const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-emerald-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto mb-4"></div>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
            Loading testimonials...
          </p>
        </motion.div>
      </div>
    );
  }

  const testimonialsPerSlide = getTestimonialsPerSlide();
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  return (
    <div className="w-full bg-gradient-to-br from-emerald-100 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}

      {/* Testimonials Slider */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Card
            className="backdrop-blur-sm border-0 p-8 md:p-12 relative overflow-hidden 
              bg-gradient-to-br from-white to-emerald-50 
              dark:from-gray-800 dark:to-gray-700
              shadow-lg dark:shadow-gray-900/30"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-400 rounded-full dark:bg-emerald-600"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-400 rounded-full dark:bg-teal-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-400 rounded-full dark:bg-cyan-600"></div>
            </div>

            {testimonials.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Quote className="w-16 h-16 text-emerald-300 dark:text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  No testimonials yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Be the first to share your love story!
                </p>
              </motion.div>
            ) : (
              <div className="relative">
                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 
                      bg-white dark:bg-gray-700 shadow-lg rounded-full p-3 
                      hover:bg-emerald-50 dark:hover:bg-gray-600 
                      transition-colors duration-300"
                  disabled={totalSlides <= 1}
                >
                  <ChevronLeft className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 
                      bg-white dark:bg-gray-700 shadow-lg rounded-full p-3 
                      hover:bg-emerald-50 dark:hover:bg-gray-600 
                      transition-colors duration-300"
                  disabled={totalSlides <= 1}
                >
                  <ChevronRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </button>

                {/* Testimonials Grid */}
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {testimonials
                        .slice(
                          currentSlide * testimonialsPerSlide,
                          (currentSlide + 1) * testimonialsPerSlide
                        )
                        .map((testimonial, index) => (
                          <motion.div
                            key={testimonial._id}
                            className="group"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card
                              className="h-full 
                                bg-gradient-to-br from-white to-emerald-50/50 
                                dark:from-gray-700 dark:to-gray-600 
                                border border-emerald-100 dark:border-gray-600 
                                hover:border-emerald-300 dark:hover:border-emerald-500 
                                transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/50"
                            >
                              <CardContent className="p-6">
                                {/* Quote Icon */}
                                <div className="flex justify-between items-start mb-4">
                                  <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{
                                      duration: 2,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    <Quote className="w-8 h-8 text-emerald-400 dark:text-emerald-500 opacity-60" />
                                  </motion.div>
                                  <div className="flex gap-1">
                                    {renderStars(testimonial.rating)}
                                  </div>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed text-pretty min-h-[60px]">
                                  {testimonial.comment}
                                </p>

                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                    }}
                                  >
                                    <Avatar className="w-12 h-12 border-2 border-emerald-200 dark:border-emerald-600">
                                      <AvatarImage
                                        src={
                                          getAvatarImage(
                                            testimonial?.userId?.gender
                                          ) || "/placeholder.svg"
                                        }
                                        alt={testimonial.biodataId.name}
                                      />
                                      <AvatarFallback className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold">
                                        {testimonial.biodataId.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </motion.div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                      {testimonial.biodataId.name}
                                    </h4>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                      {testimonial.biodataId.age} years • Happy
                                      Member
                                    </p>
                                  </div>
                                </div>

                                {/* Date */}
                                <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-gray-600">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      testimonial.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Slide Indicators */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalSlides }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-emerald-600 dark:bg-emerald-400 w-8"
                            : "bg-emerald-200 dark:bg-gray-600 hover:bg-emerald-300 dark:hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
