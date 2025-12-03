"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, MapPin, Phone, Mail } from "lucide-react";
import AllTestimony from "@/components/features/public/testimony/allTestimony/AllTestimony";
import Link from "next/link";

interface Translation {
  title: string;
  subtitle: string;
  mission: {
    title: string;
    description: string;
  };
  values: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    adminInfo: string;
  };
  stats: {
    title: string;
    items: Array<{
      number: string;
      label: string;
    }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      name: string;
      text: string;
      location: string;
    }>;
  };
  contact: {
    title: string;
    description: string;
    cta: string;
  };
}

const translations: Record<string, Translation> = {
  bn: {
    title: "নিকাহ সম্পর্কে",
    subtitle: "ইসলামিক বিবাহের জন্য বিশ্বস্ত প্ল্যাটফর্ম",
    mission: {
      title: "আমাদের লক্ষ্য",
      description:
        "নিকাহ একটি ইসলামিক ম্যাট্রিমনি প্ল্যাটফর্ম যা মুসলিম পরিবারগুলোকে তাদের সন্তানদের জন্য উপযুক্ত জীবনসঙ্গী খুঁজে পেতে সাহায্য করে। আমরা ইসলামিক মূল্যবোধ এবং ঐতিহ্যকে সম্মান করে আধুনিক প্রযুক্তির মাধ্যমে বিবাহের ব্যবস্থা করি।",
    },
    values: {
      title: "আমাদের মূল্যবোধ",
      items: [
        {
          icon: "shield",
          title: "বিশ্বস্ততা",
          description:
            "আমরা সকল সদস্যদের তথ্যের গোপনীয়তা এবং নিরাপত্তা নিশ্চিত করি।",
        },
        {
          icon: "heart",
          title: "ইসলামিক মূল্যবোধ",
          description:
            "কুরআন ও সুন্নাহর আলোকে বিবাহের ব্যবস্থা করা আমাদের প্রধান লক্ষ্য।",
        },
        {
          icon: "users",
          title: "পারিবারিক সম্পৃক্ততা",
          description:
            "পরিবারের সম্মতি ও অংশগ্রহণকে আমরা অত্যন্ত গুরুত্ব দিয়ে থাকি।",
        },
      ],
    },
    about: {
      title: "নিকাহ প্ল্যাটফর্ম",
      description:
        "২০২০ সাল থেকে আমরা হাজারো মুসলিম পরিবারকে তাদের সন্তানদের জন্য উপযুক্ত জীবনসঙ্গী খুঁজে পেতে সাহায্য করেছি। আমাদের প্ল্যাটফর্মে রয়েছে উন্নত প্রোফাইল ম্যাচিং সিস্টেম, নিরাপদ যোগাযোগ ব্যবস্থা এবং পেশাদার পরামর্শ সেবা।",
      adminInfo:
        "আমাদের প্রধান কার্যালয় সিলেট, বাংলাদেশে অবস্থিত এবং আমাদের অভিজ্ঞ টিম ২৪/৭ সেবা প্রদান করে থাকে।",
    },
    stats: {
      title: "আমাদের সাফল্য",
      items: [
        { number: "৫০০০+", label: "নিবন্ধিত সদস্য" },
        { number: "১২০০+", label: "সফল বিবাহ" },
        { number: "৯৮%", label: "সন্তুষ্ট পরিবার" },
        { number: "৫+", label: "বছরের অভিজ্ঞতা" },
      ],
    },
    testimonials: {
      title: "সদস্যদের মতামত",
      items: [
        {
          name: "আহমেদ ও ফাতিমা",
          text: "নিকাহ প্ল্যাটফর্মের মাধ্যমে আমরা একে অপরকে খুঁজে পেয়েছি। তাদের পেশাদার সেবা ও ইসলামিক নির্দেশনা অসাধারণ।",
          location: "ঢাকা, বাংলাদেশ",
        },
        {
          name: "করিম ও আয়েশা",
          text: "আমাদের পরিবার নিকাহ প্ল্যাটফর্মের সেবায় অত্যন্ত সন্তুষ্ট। তারা আমাদের সন্তানের জন্য পারফেক্ট ম্যাচ খুঁজে দিয়েছে।",
          location: "চট্টগ্রাম, বাংলাদেশ",
        },
      ],
    },
    contact: {
      title: "যোগাযোগ করুন",
      description: "আপনার জীবনসঙ্গী খোঁজার যাত্রা শুরু করুন আজই।",
      cta: "এখনই যোগ দিন",
    },
  },
  en: {
    title: "About Nikah",
    subtitle: "Trusted Platform for Islamic Matrimony",
    mission: {
      title: "Our Mission",
      description:
        "Nikah is an Islamic matrimony platform that helps Muslim families find suitable life partners for their children. We honor Islamic values and traditions while using modern technology to facilitate marriages in accordance with Islamic principles.",
    },
    values: {
      title: "Our Values",
      items: [
        {
          icon: "shield",
          title: "Trust & Security",
          description:
            "We ensure the privacy and security of all member information with the highest standards.",
        },
        {
          icon: "heart",
          title: "Islamic Values",
          description:
            "Facilitating marriages according to the Quran and Sunnah is our primary objective.",
        },
        {
          icon: "users",
          title: "Family Involvement",
          description:
            "We highly value family consent and participation in the matrimonial process.",
        },
      ],
    },
    about: {
      title: "Nikah Platform",
      description:
        "Since 2020, we have helped thousands of Muslim families find suitable life partners for their children. Our platform features advanced profile matching systems, secure communication facilities, and professional counseling services.",
      adminInfo:
        "Our headquarters is located in Sylhet, Bangladesh, and our experienced team provides 24/7 service.",
    },
    stats: {
      title: "Our Success",
      items: [
        { number: "5000+", label: "Registered Members" },
        { number: "1200+", label: "Successful Marriages" },
        { number: "98%", label: "Satisfied Families" },
        { number: "5+", label: "Years of Experience" },
      ],
    },
    testimonials: {
      title: "Member Testimonials",
      items: [
        {
          name: "Ahmed & Fatima",
          text: "We found each other through the Nikah platform. Their professional service and Islamic guidance were exceptional.",
          location: "Dhaka, Bangladesh",
        },
        {
          name: "Karim & Ayesha",
          text: "Our family is extremely satisfied with Nikah platform's service. They found the perfect match for our child.",
          location: "Chittagong, Bangladesh",
        },
      ],
    },
    contact: {
      title: "Get in Touch",
      description: "Start your journey to find your life partner today.",
      cta: "Join Now",
    },
  },
};

export default function AboutPage() {
  const [language, setLanguage] = useState<"bn" | "en">("en");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "bn" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const t = translations[language];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return (
          <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        );
      case "heart":
        return (
          <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        );
      case "users":
        return (
          <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        );
      default:
        return (
          <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isDark ? "dark" : ""}`}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-background to-emerald-100 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
              {t.subtitle}
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>
                {language === "bn" ? "সিলেট, বাংলাদেশ" : "Sylhet, Bangladesh"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-8">
              {t.mission.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              {t.mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t.values.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.values.items.map((value, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {getIcon(value.icon)}
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Platform Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-card-foreground mb-8">
              {t.about.title}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="text-pretty">{t.about.description}</p>
              <p className="text-pretty">{t.about.adminInfo}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t.stats.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {t.stats.items.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <AllTestimony />
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t.contact.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              {t.contact.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span>+8801721972807</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>nikahlife25@gmail.com</span>
              </div>
            </div>
            <Link href={"/registration"}>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white cursor-pointer"
              >
                {t.contact.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
