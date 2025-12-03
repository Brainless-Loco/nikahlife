"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail } from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  email: string;
  subject: string;
  body: string;
}

const translations = {
  en: {
    title: "Contact Us",
    description:
      "Send us a message and we'll get back to you as soon as possible.",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email address",
    subjectLabel: "Subject",
    subjectPlaceholder: "Enter the subject of your message",
    bodyLabel: "Message",
    bodyPlaceholder: "Write your message here...",
    submitButton: "Send Message",
    successMessage: "Message sent successfully!",
    errorMessage: "Failed to send message. Please try again.",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email address",
  },
  bn: {
    title: "যোগাযোগ করুন",
    description:
      "আমাদের একটি বার্তা পাঠান এবং আমরা যত তাড়াতাড়ি সম্ভব আপনার কাছে ফিরে আসব।",
    emailLabel: "ইমেইল ঠিকানা",
    emailPlaceholder: "আপনার ইমেইল ঠিকানা লিখুন",
    subjectLabel: "বিষয়",
    subjectPlaceholder: "আপনার বার্তার বিষয় লিখুন",
    bodyLabel: "বার্তা",
    bodyPlaceholder: "এখানে আপনার বার্তা লিখুন...",
    submitButton: "বার্তা পাঠান",
    successMessage: "বার্তা সফলভাবে পাঠানো হয়েছে!",
    errorMessage: "বার্তা পাঠাতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
    requiredField: "এই ক্ষেত্রটি প্রয়োজনীয়",
    invalidEmail: "অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন",
  },
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    email: "",
    subject: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [language, setLanguage] = useState<"en" | "bn">("en");

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "bn" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = t.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t.requiredField;
    }

    if (!formData.body.trim()) {
      newErrors.body = t.requiredField;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/contactUs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success(t.successMessage, {
          description: "We'll get back to you soon.",
        });
        setFormData({ email: "", subject: "", body: "" });
        setErrors({});
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.log(error);
      toast.error(t.errorMessage, {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-emerald-200 dark:border-emerald-800">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
            {t.title}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                {t.emailLabel}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`transition-colors ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-input focus:border-emerald-500 focus:ring-emerald-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="subject"
                className="text-sm font-medium text-foreground"
              >
                {t.subjectLabel}
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder={t.subjectPlaceholder}
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={`transition-colors ${
                  errors.subject
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-input focus:border-emerald-500 focus:ring-emerald-500"
                }`}
              />
              {errors.subject && (
                <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="body"
                className="text-sm font-medium text-foreground"
              >
                {t.bodyLabel}
              </Label>
              <Textarea
                id="body"
                placeholder={t.bodyPlaceholder}
                value={formData.body}
                onChange={(e) => handleInputChange("body", e.target.value)}
                rows={6}
                className={`transition-colors resize-none ${
                  errors.body
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-input focus:border-emerald-500 focus:ring-emerald-500"
                }`}
              />
              {errors.body && (
                <p className="text-sm text-red-500 mt-1">{errors.body}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium py-3 transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === "bn" ? "পাঠানো হচ্ছে..." : "Sending..."}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  {t.submitButton}
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
