"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/logo/nikahlife-white.png";

interface Translation {
  en: string;
  bn: string;
}

const translations: Record<string, Translation> = {
  biodatas: { en: "Biodatas", bn: "বায়োডাটা" },
  contact: { en: "Contact", bn: "যোগাযোগ" },
  about: { en: "About", bn: "সম্পর্কে" },
  successStories: { en: "Success Stories", bn: "সফলতার গল্প" },
  tagline: {
    en: "Connecting Hearts, Building Families",
    bn: "হৃদয় সংযোগ, পরিবার গঠন",
  },
  location: { en: "Sylhet, Bangladesh", bn: "সিলেট, বাংলাদেশ" },
  email: { en: "nikahlife25@gmail.com", bn: "nikahlife25@gmail.com" },
  phone: { en: "+8801721972807", bn: "+8801721972807" },
  copyright: {
    en: "© 2025 Nikahlife All rights reserved.",
    bn: "© ২০২৫ nikahlife সকল অধিকার সংরক্ষিত।",
  },
  madeWith: { en: "Made with", bn: "তৈরি করা হয়েছে" },
  forCommunity: {
    en: "for the Muslim community",
    bn: "মুসলিম সম্প্রদায়ের জন্য",
  },
};

export default function Footer() {
  const [language, setLanguage] = useState<"en" | "bn">("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "en" | "bn";
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const routes = [
    { href: "/biodatas", label: t("biodatas") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
    { href: "/success-stories", label: t("successStories") },
  ];

  return (
    <footer className="bg-gray-800 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Image width={200} height={200} src={logo} alt="nikahlife" />
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("tagline")}
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>{t("madeWith")}</span>
              <Heart className="w-4 h-4 mx-1 text-emerald-600 fill-current" />
              <span>{t("forCommunity")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 hover:underline"
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t("location")}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t("email")}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t("phone")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-400">{t("copyright")}</p>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">
                Islamic Matrimony Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
