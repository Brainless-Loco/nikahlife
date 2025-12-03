"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContactInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";

const translations = {
  en: {
    title: "Contact Information",
    description: "Please provide guardian contact details",
    guardianPhone: "Guardian Phone Number",
    guardianPhonePlaceholder: "+880 1XXX-XXXXXX",
    phoneHelper: "Enter your guardian's phone number",
    relation: "Relation with Guardian",
    relationPlaceholder: "e.g., Father, Mother, Brother",
    relationHelper: "Specify your relationship with the guardian",
    noteTitle: "Important Note",
    note1: "Guardian's phone number will be used for verification purposes",
    note2: "Please ensure the phone number is active and accessible",
    note3: "This information will be kept confidential",
    errors: {
      phoneRequired: "Guardian phone number is required",
      phoneInvalid: "Please enter a valid phone number",
      phoneShort: "Phone number must be at least 10 digits",
      relationRequired: "Relation with guardian is required",
      relationInvalid: "Please enter a valid relation",
    },
  },
  bn: {
    title: "যোগাযোগের তথ্য",
    description: "অভিভাবকের যোগাযোগের তথ্য প্রদান করুন",
    guardianPhone: "অভিভাবকের ফোন নম্বর",
    guardianPhonePlaceholder: "+৮৮০ ১XXX-XXXXXX",
    phoneHelper: "আপনার অভিভাবকের ফোন নম্বর লিখুন",
    relation: "অভিভাবকের সাথে সম্পর্ক",
    relationPlaceholder: "যেমন: পিতা, মাতা, ভাই",
    relationHelper: "অভিভাবকের সাথে আপনার সম্পর্ক উল্লেখ করুন",
    noteTitle: "গুরুত্বপূর্ণ নোট",
    note1: "অভিভাবকের ফোন নম্বর যাচাইকরণের উদ্দেশ্যে ব্যবহার করা হবে",
    note2: "অনুগ্রহ করে নিশ্চিত করুন ফোন নম্বরটি সক্রিয় এবং ব্যবহারযোগ্য",
    note3: "এই তথ্য গোপনীয় রাখা হবে",
    errors: {
      phoneRequired: "অভিভাবকের ফোন নম্বর আবশ্যক",
      phoneInvalid: "অনুগ্রহ করে সঠিক ফোন নম্বর লিখুন",
      phoneShort: "ফোন নম্বর কমপক্ষে ১০ ডিজিটের হতে হবে",
      relationRequired: "অভিভাবকের সাথে সম্পর্ক আবশ্যক",
      relationInvalid: "অনুগ্রহ করে সঠিক সম্পর্ক লিখুন",
    },
  },
};

export default function ContactInfoStep({ data, updateData }: StepProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    guardianPhone: data.contactInfo?.guardianPhone || "",
    relation: data.contactInfo?.relation || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactInfo, string>>
  >({});

  useEffect(() => {
    validateAndUpdate();
  }, [contactInfo]);

  const validateAndUpdate = () => {
    const newErrors: Partial<Record<keyof ContactInfo, string>> = {};

    // Validate guardian phone
    if (!contactInfo.guardianPhone || contactInfo.guardianPhone.trim() === "") {
      newErrors.guardianPhone = t.errors.phoneRequired;
    } else if (!/^[\d\s\-+()]+$/.test(contactInfo.guardianPhone)) {
      newErrors.guardianPhone = t.errors.phoneInvalid;
    } else if (contactInfo.guardianPhone.replace(/\D/g, "").length < 10) {
      newErrors.guardianPhone = t.errors.phoneShort;
    }

    // Validate relation
    if (!contactInfo.relation || contactInfo.relation.trim() === "") {
      newErrors.relation = t.errors.relationRequired;
    } else if (contactInfo.relation.trim().length < 2) {
      newErrors.relation = t.errors.relationInvalid;
    }

    setErrors(newErrors);

    // Update parent component with validation status
    const isValid = Object.keys(newErrors).length === 0;
    updateData({
      contactInfo,
      isContactInfoValid: isValid,
    });
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
          {t.title}
        </h2>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <div className="space-y-6">
        {/* Guardian Phone */}
        <div className="space-y-2">
          <Label htmlFor="guardianPhone" className="text-base font-medium">
            {t.guardianPhone} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="guardianPhone"
            type="tel"
            placeholder={t.guardianPhonePlaceholder}
            value={contactInfo.guardianPhone}
            onChange={(e) => handleChange("guardianPhone", e.target.value)}
            className={`${
              errors.guardianPhone
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-emerald-200 dark:border-emerald-700"
            }`}
          />
          {errors.guardianPhone && (
            <p className="text-sm text-red-500">{errors.guardianPhone}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {t.phoneHelper}
          </p>
        </div>

        {/* Relation */}
        <div className="space-y-2">
          <Label htmlFor="relation" className="text-base font-medium">
            {t.relation} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="relation"
            type="text"
            placeholder={t.relationPlaceholder}
            value={contactInfo.relation}
            onChange={(e) => handleChange("relation", e.target.value)}
            className={`${
              errors.relation
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-emerald-200 dark:border-emerald-700"
            }`}
          />
          {errors.relation && (
            <p className="text-sm text-red-500">{errors.relation}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {t.relationHelper}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
          {t.noteTitle}
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <li>{t.note1}</li>
          <li>{t.note2}</li>
          <li>{t.note3}</li>
        </ul>
      </div>
    </div>
  );
}
