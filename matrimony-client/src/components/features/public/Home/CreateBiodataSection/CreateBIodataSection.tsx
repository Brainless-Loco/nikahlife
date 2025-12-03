"use client";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";

const translations = {
  bn: {
    title: "সম্পূর্ণ বিনামূল্যে বায়োডাটা তৈরি করা যায়",
    create: "বায়োডাটা তৈরি করুন",
    how: "যেভাবে বায়োডাটা তৈরি করবেন",
  },
  en: {
    title: "Create a complete biodata for free",
    create: "Create Biodata",
    how: "How to Create Biodata",
  },
};

export default function CreateBiodataSection() {
  const { language } = useLanguage();
  const lang = translations[language];

  return (
    <section className="py-28 bg-gray-50 dark:bg-gray-900 text-center transition-colors duration-300">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-10">
        {lang.title}
      </h2>

      {/* Buttons */}
      <div className="flex justify-center gap-6 flex-wrap">
        <Link href="/registration">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-semibold shadow-md hover:scale-105 transition cursor-pointer">
            <span className="text-xl">+</span> {lang.create}
          </button>
        </Link>

        <Link href="/">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-300 dark:border-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-gray-800 transition cursor-pointer">
            <span className="text-red-600 text-xl">▶</span> {lang.how}
          </button>
        </Link>
      </div>
    </section>
  );
}
