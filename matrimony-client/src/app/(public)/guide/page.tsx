"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Book, CheckCircle, Users, Heart, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideSection {
  title: string;
  description: string;
  steps: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

interface Translation {
  title: string;
  subtitle: string;
  sections: {
    [key: string]: GuideSection;
  };
}

const translations: Record<string, Translation> = {
  en: {
    title: "Getting Started Guide",
    subtitle: "Learn how to use NikahLife to find your perfect match",
    sections: {
      getting_started: {
        title: "Getting Started",
        description: "Begin your journey on NikahLife",
        steps: [
          {
            title: "Create Your Account",
            description:
              "Sign up with your email or phone number. Verify your OTP and set up a secure password. Your account is now ready to use.",
            icon: "user",
          },
          {
            title: "Complete Your Profile",
            description:
              "Add your personal information including name, age, education, profession, and a profile photo. The more complete your profile, the better your matches will be.",
            icon: "edit",
          },
          {
            title: "Create Your Biodata",
            description:
              "Fill out your comprehensive biodata with personal, family, educational, and occupational information. This helps us find better matches for you.",
            icon: "file",
          },
          {
            title: "Set Your Preferences",
            description:
              "Define your preferences for a life partner including age range, education, profession, and other important qualities.",
            icon: "settings",
          },
        ],
      },
      finding_matches: {
        title: "Finding Your Match",
        description: "Strategies for finding compatible profiles",
        steps: [
          {
            title: "Browse Profiles",
            description:
              "Explore profiles that appear in your matches section. These are suggested based on compatibility. You can also use advanced search.",
            icon: "search",
          },
          {
            title: "Use Advanced Filters",
            description:
              "Filter profiles by age, location, education, profession, and other criteria. This helps you narrow down to your ideal matches.",
            icon: "filter",
          },
          {
            title: "Send Interest",
            description:
              "When you find someone interesting, send them an interest request. If they accept, you will both see each other's contact information.",
            icon: "heart",
          },
          {
            title: "Connect & Chat",
            description:
              "Once interests are mutual, you can exchange contact information and communicate to get to know each other better.",
            icon: "message",
          },
        ],
      },
      safety: {
        title: "Safety & Security",
        description: "Tips for staying safe while using NikahLife",
        steps: [
          {
            title: "Protect Your Information",
            description:
              "Never share sensitive information like bank details or passwords. Be cautious about personal details in early conversations.",
            icon: "lock",
          },
          {
            title: "Verify Profiles",
            description:
              "Check for verified badges and look for complete profiles with clear photos. Be wary of requests for money or suspicious behavior.",
            icon: "check",
          },
          {
            title: "Meet Safely",
            description:
              "Always meet in public places. Inform a trusted friend or family member about your plans. Never meet alone initially.",
            icon: "location",
          },
          {
            title: "Report Issues",
            description:
              "If you encounter suspicious activity or inappropriate behavior, use the report function. Our team investigates all reports seriously.",
            icon: "alert",
          },
        ],
      },
      etiquette: {
        title: "Islamic Etiquette",
        description: "Guidelines for respectful communication",
        steps: [
          {
            title: "Be Respectful",
            description:
              "Treat others with respect and dignity. Remember that on the other end is someone's daughter, son, or family member.",
            icon: "handshake",
          },
          {
            title: "Be Honest",
            description:
              "Provide accurate information about yourself. Honesty is the foundation of trust and Islamic principles. Never mislead or misrepresent.",
            icon: "truth",
          },
          {
            title: "Maintain Islamic Values",
            description:
              "Keep interactions appropriate and aligned with Islamic principles. Avoid inappropriate conversations or content.",
            icon: "star",
          },
          {
            title: "Involve Your Family",
            description:
              "Keep your parents or guardians informed about your matrimonial journey. Seek their guidance and blessing.",
            icon: "users",
          },
        ],
      },
      premium: {
        title: "Premium Features",
        description: "Unlock advanced features with premium membership",
        steps: [
          {
            title: "Advanced Search",
            description:
              "Access detailed filters and search criteria. Save your searches and get notified when new matching profiles appear.",
            icon: "search-premium",
          },
          {
            title: "Unlimited Interests",
            description:
              "Send unlimited interest requests to other profiles. Basic members have monthly limits, but premium members enjoy unlimited access.",
            icon: "unlimited",
          },
          {
            title: "View Full Profiles",
            description:
              "Access complete biodata and personal information immediately. No waiting for mutual interests to see contact details.",
            icon: "eye",
          },
          {
            title: "Priority Support",
            description:
              "Get dedicated support from our team. Premium members receive priority responses and assistance with any questions.",
            icon: "headset",
          },
        ],
      },
    },
  },
  bn: {
    title: "শুরু করার গাইড",
    subtitle: "নিকাহলাইফ ব্যবহার করে আপনার নিখুঁত ম্যাচ খুঁজে বের করুন",
    sections: {
      getting_started: {
        title: "শুরু করুন",
        description: "নিকাহলাইফে আপনার যাত্রা শুরু করুন",
        steps: [
          {
            title: "আপনার অ্যাকাউন্ট তৈরি করুন",
            description:
              "আপনার ইমেইল বা ফোন নম্বর দিয়ে সাইন আপ করুন। আপনার ওটিপি যাচাই করুন এবং একটি নিরাপদ পাসওয়ার্ড সেট করুন। আপনার অ্যাকাউন্ট এখন ব্যবহারের জন্য প্রস্তুত।",
            icon: "user",
          },
          {
            title: "আপনার প্রোফাইল সম্পূর্ণ করুন",
            description:
              "আপনার ব্যক্তিগত তথ্য যোগ করুন যার মধ্যে নাম, বয়স, শিক্ষা, পেশা এবং প্রোফাইল ফটো রয়েছে। আপনার প্রোফাইল যত বেশি সম্পূর্ণ হবে, আপনার ম্যাচগুলি তত ভাল হবে।",
            icon: "edit",
          },
          {
            title: "আপনার বায়োডাটা তৈরি করুন",
            description:
              "ব্যক্তিগত, পারিবারিক, শিক্ষামূলক এবং পেশাগত তথ্য সহ আপনার ব্যাপক বায়োডাটা পূরণ করুন।",
            icon: "file",
          },
          {
            title: "আপনার পছন্দ নির্ধারণ করুন",
            description:
              "একজন জীবনসঙ্গীর জন্য আপনার পছন্দগুলি সংজ্ঞায়িত করুন যার মধ্যে বয়স, শিক্ষা, পেশা এবং অন্যান্য গুরুত্বপূর্ণ গুণ রয়েছে।",
            icon: "settings",
          },
        ],
      },
      finding_matches: {
        title: "আপনার ম্যাচ খুঁজে পাওয়া",
        description: "সামঞ্জস্যপূর্ণ প্রোফাইল খুঁজে পাওয়ার কৌশল",
        steps: [
          {
            title: "প্রোফাইল ব্রাউজ করুন",
            description:
              "আপনার ম্যাচ বিভাগে প্রদর্শিত প্রোফাইলগুলি অন্বেষণ করুন। এগুলি সামঞ্জস্যের উপর ভিত্তি করে পরামর্শ করা হয়।",
            icon: "search",
          },
          {
            title: "উন্নত ফিল্টার ব্যবহার করুন",
            description:
              "বয়স, অবস্থান, শিক্ষা, পেশা এবং অন্যান্য মানদণ্ড দ্বারা প্রোফাইলগুলি ফিল্টার করুন।",
            icon: "filter",
          },
          {
            title: "আগ্রহ পাঠান",
            description:
              "যখন আপনি কাউকে আকর্ষণীয় খুঁজে পান, তাদের একটি আগ্রহের অনুরোধ পাঠান। যদি তারা গ্রহণ করে, আপনি উভয়ে যোগাযোগ তথ্য দেখতে পারবেন।",
            icon: "heart",
          },
          {
            title: "সংযোগ স্থাপন করুন",
            description:
              "একবার আগ্রহ পারস্পরিক হলে, আপনি যোগাযোগ তথ্য বিনিময় করতে এবং একে অপরকে জানতে পারেন।",
            icon: "message",
          },
        ],
      },
      safety: {
        title: "নিরাপত্তা এবং সুরক্ষা",
        description: "নিকাহলাইফ ব্যবহার করার সময় নিরাপদ থাকার টিপস",
        steps: [
          {
            title: "আপনার তথ্য রক্ষা করুন",
            description:
              "কখনও সংবেদনশীল তথ্য যেমন ব্যাংক বিবরণ বা পাসওয়ার্ড শেয়ার করবেন না। প্রাথমিক কথোপকথনে ব্যক্তিগত বিবরণ সম্পর্কে সতর্ক থাকুন।",
            icon: "lock",
          },
          {
            title: "প্রোফাইল যাচাই করুন",
            description:
              "যাচাইকৃত ব্যাজগুলি পরীক্ষা করুন এবং পরিষ্কার ছবি সহ সম্পূর্ণ প্রোফাইলগুলি দেখুন।",
            icon: "check",
          },
          {
            title: "নিরাপদে দেখা করুন",
            description:
              "সর্বদা জনসাধারণের জায়গায় দেখা করুন। একজন বিশ্বস্ত বন্ধু বা পরিবারের সদস্যকে আপনার পরিকল্পনা সম্পর্কে জানান।",
            icon: "location",
          },
          {
            title: "সমস্যার রিপোর্ট করুন",
            description:
              "যদি আপনি সন্দেহজনক কার্যকলাপ বা অনুপযুক্ত আচরণ সম্পর্কে জানেন তবে রিপোর্ট ফাংশন ব্যবহার করুন।",
            icon: "alert",
          },
        ],
      },
      etiquette: {
        title: "ইসলামিক শিষ্টাচার",
        description: "সম্মানজনক যোগাযোগের জন্য নির্দেশিকা",
        steps: [
          {
            title: "সম্মানজনক হন",
            description:
              "অন্যদের সাথে শ্রদ্ধা এবং মর্যাদার সাথে আচরণ করুন। মনে রাখুন যে অন্য দিকে কাউকে এবং তার পরিবার রয়েছে।",
            icon: "handshake",
          },
          {
            title: "সৎ হন",
            description:
              "নিজের সম্পর্কে সঠিক তথ্য প্রদান করুন। সততা বিশ্বাস এবং ইসলামিক নীতির ভিত্তি।",
            icon: "truth",
          },
          {
            title: "ইসলামিক মূল্যবোধ বজায় রাখুন",
            description:
              "যোগাযোগকে উপযুক্ত এবং ইসলামিক নীতির সাথে সামঞ্জস্যপূর্ণ রাখুন।",
            icon: "star",
          },
          {
            title: "আপনার পরিবারকে জড়িত করুন",
            description:
              "আপনার পিতামাতা বা অভিভাবকদের আপনার ম্যাট্রিমনিয়াল যাত্রা সম্পর্কে অবহিত রাখুন।",
            icon: "users",
          },
        ],
      },
      premium: {
        title: "প্রিমিয়াম বৈশিষ্ট্য",
        description: "প্রিমিয়াম সদস্যপদের সাথে উন্নত বৈশিষ্ট্য আনলক করুন",
        steps: [
          {
            title: "উন্নত অনুসন্ধান",
            description:
              "বিস্তারিত ফিল্টার এবং অনুসন্ধান মানদণ্ড অ্যাক্সেস করুন। আপনার অনুসন্ধান সংরক্ষণ করুন এবং নতুন ম্যাচিং প্রোফাইল প্রদর্শিত হলে বিজ্ঞপ্তি পান।",
            icon: "search-premium",
          },
          {
            title: "সীমাহীন আগ্রহ",
            description:
              "অন্যান্য প্রোফাইলগুলিতে সীমাহীন আগ্রহ অনুরোধ পাঠান। মৌলিক সদস্যদের মাসিক সীমা রয়েছে।",
            icon: "unlimited",
          },
          {
            title: "সম্পূর্ণ প্রোফাইল দেখুন",
            description:
              "সম্পূর্ণ বায়োডাটা এবং ব্যক্তিগত তথ্যে অবিলম্বে অ্যাক্সেস করুন।",
            icon: "eye",
          },
          {
            title: "অগ্রাধিকার সহায়তা",
            description:
              "আমাদের টিম থেকে ডেডিকেটেড সহায়তা পান। প্রিমিয়াম সদস্যরা অগ্রাধিকার প্রতিক্রিয়া পান।",
            icon: "headset",
          },
        ],
      },
    },
  },
};

const iconMap: Record<string, React.ReactNode> = {
  user: <Users className="w-8 h-8" />,
  edit: <Book className="w-8 h-8" />,
  file: <Book className="w-8 h-8" />,
  settings: <Zap className="w-8 h-8" />,
  search: <Users className="w-8 h-8" />,
  filter: <Zap className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  message: <Book className="w-8 h-8" />,
  lock: <Shield className="w-8 h-8" />,
  check: <CheckCircle className="w-8 h-8" />,
  location: <Users className="w-8 h-8" />,
  alert: <Zap className="w-8 h-8" />,
  handshake: <Users className="w-8 h-8" />,
  truth: <CheckCircle className="w-8 h-8" />,
  star: <Heart className="w-8 h-8" />,
  "search-premium": <Zap className="w-8 h-8" />,
  unlimited: <Zap className="w-8 h-8" />,
  eye: <Users className="w-8 h-8" />,
  headset: <Book className="w-8 h-8" />,
};

export default function GuidePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeSection, setActiveSection] = useState<string>("getting_started");

  const sections = Object.entries(t.sections);
  const currentSection = t.sections[activeSection];

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl pt-2 md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-pink-600 dark:from-emerald-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {sections.map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={cn(
                  "px-6 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer",
                  activeSection === key
                    ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 dark:hover:border-emerald-700"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Current Section Content */}
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {currentSection.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {currentSection.description}
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {currentSection.steps.map((step, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {step.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                      {iconMap[step.icon]}
                    </div>
                  </div>

                  {/* Step Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-16">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Tips Section */}
          <div className="mt-16 bg-gradient-to-r from-emerald-100 to-pink-100 dark:from-emerald-950/30 dark:to-pink-950/30 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-900">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400">
                  <li>
                    • Keep your profile updated with recent information for better matches
                  </li>
                  <li>
                    • Be patient and positive - finding the right match takes time
                  </li>
                  <li>
                    • Always involve your family in important decisions
                  </li>
                  <li>
                    • Use our search filters wisely to find compatible profiles
                  </li>
                  <li>
                    • Remember the Islamic principles of respect and honesty
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
