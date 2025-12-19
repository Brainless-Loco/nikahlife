"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface Translation {
  title: string;
  subtitle: string;
  categories: {
    [key: string]: {
      title: string;
      items: FAQItem[];
    };
  };
}

const translations: Record<string, Translation> = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about NikahLife",
    categories: {
      account: {
        title: "Account & Registration",
        items: [
          {
            question: "How do I create an account on NikahLife?",
            answer:
              "Creating an account is simple. Click on 'Sign Up' at the top right, fill in your basic information (name, email/phone, password), and verify your OTP. Once verified, you can start creating your biodata.",
          },
          {
            question: "Is my personal information safe on NikahLife?",
            answer:
              "Yes, your information is completely secure. We use advanced encryption and privacy protocols to protect all member data. Your privacy is our top priority and we never share your information with third parties.",
          },
          {
            question: "Can I delete my account?",
            answer:
              "Yes, you can delete your account anytime from your account settings. Once deleted, all your data will be permanently removed from our system within 30 days.",
          },
          {
            question: "How do I change my password?",
            answer:
              "Go to your Account Settings, click on 'Change Password', enter your current password and the new password, then click Save. You'll receive a confirmation email.",
          },
        ],
      },
      biodata: {
        title: "Biodata & Profiles",
        items: [
          {
            question: "What information should I include in my biodata?",
            answer:
              "Include accurate personal information, education, occupation, family background, and your preferences for a life partner. Be honest as this helps with better matches. You can also include a profile photo to increase visibility.",
          },
          {
            question: "Can I make my biodata private?",
            answer:
              "Yes, you can control your biodata visibility. You can make it public, visible to specific users, or completely private. Even if private, premium members may be able to view it based on your subscription plan.",
          },
          {
            question: "How often can I update my biodata?",
            answer:
              "You can update your biodata information anytime. Changes are reflected immediately. However, we recommend keeping it up-to-date for better matching results.",
          },
          {
            question: "What if I want to hide my contact information?",
            answer:
              "You can choose to hide your email and phone number. Only interested users who you accept will be able to see your contact details. This protects your privacy.",
          },
        ],
      },
      matching: {
        title: "Matching & Search",
        items: [
          {
            question: "How does the matching system work?",
            answer:
              "Our intelligent matching system analyzes your profile, preferences, and profile visibility to suggest compatible profiles. The system considers education, profession, location, religious values, and personal preferences.",
          },
          {
            question: "Can I search for specific profiles?",
            answer:
              "Yes, use our advanced search filters. You can filter by age, education, location, profession, and many other criteria to find your ideal match.",
          },
          {
            question: "What does 'Send Interest' mean?",
            answer:
              "Sending interest is a way to express your intent in getting to know someone. If they accept your interest, you both will be able to see each other's contact information and connect.",
          },
          {
            question: "Is there a limit to how many interests I can send?",
            answer:
              "Basic members can send limited interests per month. Premium and VIP members have higher limits. Check your subscription plan for specific details.",
          },
        ],
      },
      payment: {
        title: "Payment & Subscription",
        items: [
          {
            question: "Do I need to pay to use NikahLife?",
            answer:
              "No, creating a basic account and viewing profiles is completely free. However, premium features like viewing contact information and unlimited interests require a paid subscription.",
          },
          {
            question: "What payment methods do you accept?",
            answer:
              "We accept multiple payment methods including bKash, Nagad, credit cards, and bank transfers. All transactions are secure and encrypted.",
          },
          {
            question: "Can I cancel my subscription anytime?",
            answer:
              "Yes, you can cancel your subscription anytime from your account settings. No hidden fees or long-term commitments required.",
          },
          {
            question: "What's the difference between Premium and VIP?",
            answer:
              "Premium members get access to advanced search, unlimited interests, and priority responses. VIP members get all premium features plus dedicated support and featured profile placement.",
          },
        ],
      },
      safety: {
        title: "Safety & Etiquette",
        items: [
          {
            question: "What should I do if I receive inappropriate messages?",
            answer:
              "You can block or report users from their profile. We take safety seriously and all reports are investigated. Repeated violations result in account suspension.",
          },
          {
            question: "Is it safe to meet someone I connected with?",
            answer:
              "Always meet in public places and let a trusted friend or family member know about your plans. Verify information and be cautious about sharing personal details initially.",
          },
          {
            question: "How do I verify that a profile is genuine?",
            answer:
              "All profiles are verified with email/phone confirmation. Look for verified badges on profiles. Be cautious of requests for money and avoid sharing sensitive information early on.",
          },
          {
            question: "What is the code of conduct?",
            answer:
              "Be respectful, honest, and follow Islamic principles. Avoid inappropriate content, false information, and disrespectful behavior. Violation of our code of conduct may result in account suspension.",
          },
        ],
      },
    },
  },
  bn: {
    title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    subtitle: "নিকাহলাইফ সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন",
    categories: {
      account: {
        title: "অ্যাকাউন্ট এবং নিবন্ধন",
        items: [
          {
            question: "আমি কীভাবে নিকাহলাইফে অ্যাকাউন্ট তৈরি করি?",
            answer:
              "অ্যাকাউন্ট তৈরি করা খুবই সহজ। উপরের ডানদিকে 'একাউন্ট খুলুন' এ ক্লিক করুন, আপনার মৌলিক তথ্য (নাম, ইমেইল/ফোন, পাসওয়ার্ড) পূরণ করুন এবং আপনার ওটিপি যাচাই করুন। যাচাইকরণের পরে আপনি আপনার বায়োডাটা তৈরি করতে পারেন।",
          },
          {
            question: "নিকাহলাইফে আমার ব্যক্তিগত তথ্য কি নিরাপদ?",
            answer:
              "হ্যাঁ, আপনার তথ্য সম্পূর্ণ সুরক্ষিত। আমরা সকল সদস্যের তথ্য সুরক্ষার জন্য উন্নত এনক্রিপশন এবং গোপনীয়তা প্রোটোকল ব্যবহার করি। আপনার গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার এবং আমরা কখনও আপনার তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না।",
          },
          {
            question: "আমি কি আমার অ্যাকাউন্ট মুছতে পারি?",
            answer:
              "হ্যাঁ, আপনি যেকোনো সময় আপনার অ্যাকাউন্ট মুছতে পারেন। একবার মুছে ফেলা হলে, আপনার সমস্ত ডেটা ৩০ দিনের মধ্যে আমাদের সিস্টেম থেকে স্থায়ীভাবে সরিয়ে দেওয়া হবে।",
          },
          {
            question: "আমি কীভাবে আমার পাসওয়ার্ড পরিবর্তন করি?",
            answer:
              "আপনার অ্যাকাউন্ট সেটিংসে যান, 'পাসওয়ার্ড পরিবর্তন' এ ক্লিক করুন, আপনার বর্তমান পাসওয়ার্ড এবং নতুন পাসওয়ার্ড লিখুন, তারপর সংরক্ষণ করুন। আপনি একটি নিশ্চিতকরণ ইমেল পাবেন।",
          },
        ],
      },
      biodata: {
        title: "বায়োডাটা এবং প্রোফাইল",
        items: [
          {
            question: "আমার বায়োডাটায় কী তথ্য অন্তর্ভুক্ত করা উচিত?",
            answer:
              "নির্ভুল ব্যক্তিগত তথ্য, শিক্ষা, পেশা, পারিবারিক পটভূমি এবং একজন জীবনসঙ্গীর জন্য আপনার পছন্দ অন্তর্ভুক্ত করুন। সৎ থাকুন কারণ এটি ভাল ম্যাচিংয়ে সাহায্য করে। আপনি দৃশ্যমানতা বাড়াতে একটি প্রোফাইল ছবিও যুক্ত করতে পারেন।",
          },
          {
            question: "আমি কি আমার বায়োডাটা ব্যক্তিগত করতে পারি?",
            answer:
              "হ্যাঁ, আপনি আপনার বায়োডাটার দৃশ্যমানতা নিয়ন্ত্রণ করতে পারেন। আপনি এটি সর্বজনীন, নির্দিষ্ট ব্যবহারকারীদের জন্য দৃশ্যমান বা সম্পূর্ণ ব্যক্তিগত করতে পারেন।",
          },
          {
            question: "আমি কত বার আমার বায়োডাটা আপডেট করতে পারি?",
            answer:
              "আপনি যেকোনো সময় আপনার বায়োডাটা আপডেট করতে পারেন। পরিবর্তনগুলি অবিলম্বে প্রতিফলিত হয়। তবে, আরও ভাল ম্যাচিংয়ের ফলাফলের জন্য আমরা এটি আপডেট রাখার পরামর্শ দিই।",
          },
          {
            question: "যদি আমি আমার যোগাযোগ তথ্য লুকাতে চাই তবে কি হবে?",
            answer:
              "আপনি আপনার ইমেইল এবং ফোন নম্বর লুকাতে পছন্দ করতে পারেন। শুধুমাত্র আগ্রহী ব্যবহারকারী যাদের আপনি গ্রহণ করেছেন তারা আপনার যোগাযোগ বিস্তারিত দেখতে পারবেন।",
          },
        ],
      },
      matching: {
        title: "ম্যাচিং এবং অনুসন্ধান",
        items: [
          {
            question: "ম্যাচিং সিস্টেম কীভাবে কাজ করে?",
            answer:
              "আমাদের বুদ্ধিমান ম্যাচিং সিস্টেম আপনার প্রোফাইল, পছন্দ এবং প্রোফাইল দৃশ্যমানতা বিশ্লেষণ করে সামঞ্জস্যপূর্ণ প্রোফাইল পরামর্শ দেয়।",
          },
          {
            question: "আমি কি নির্দিষ্ট প্রোফাইল অনুসন্ধান করতে পারি?",
            answer:
              "হ্যাঁ, আমাদের উন্নত অনুসন্ধান ফিল্টার ব্যবহার করুন। আপনি বয়স, শিক্ষা, অবস্থান, পেশা এবং অন্যান্য অনেক মানদণ্ড দ্বারা ফিল্টার করতে পারেন।",
          },
          {
            question: "'আগ্রহ পাঠান' মানে কি?",
            answer:
              "আগ্রহ পাঠানো হল কাউকে চেনার আপনার অভিপ্রায় প্রকাশ করার একটি উপায়। যদি তারা আপনার আগ্রহ গ্রহণ করে, তবে আপনি উভয়ে একে অপরের যোগাযোগ তথ্য দেখতে এবং সংযোগ করতে পারবেন।",
          },
          {
            question: "আমি কত আগ্রহ পাঠাতে পারি?",
            answer:
              "মৌলিক সদস্যরা প্রতি মাসে সীমিত আগ্রহ পাঠাতে পারেন। প্রিমিয়াম এবং ভিআইপি সদস্যদের উচ্চতর সীমা রয়েছে। নির্দিষ্ট বিবরণের জন্য আপনার সাবস্ক্রিপশন পরিকল্পনা পরীক্ষা করুন।",
          },
        ],
      },
      payment: {
        title: "পেমেন্ট এবং সাবস্ক্রিপশন",
        items: [
          {
            question: "নিকাহলাইফ ব্যবহার করার জন্য আমার কি অর্থ প্রদান করতে হবে?",
            answer:
              "না, একটি মৌলিক অ্যাকাউন্ট তৈরি করা এবং প্রোফাইল দেখা সম্পূর্ণ বিনামূল্যে। তবে, যোগাযোগ তথ্য দেখার এবং সীমাহীন আগ্রহ পাঠানোর মতো প্রিমিয়াম বৈশিষ্ট্যের জন্য একটি অর্থপ্রদত্ত সাবস্ক্রিপশন প্রয়োজন।",
          },
          {
            question: "আপনি কী পেমেন্ট পদ্ধতি গ্রহণ করেন?",
            answer:
              "আমরা একাধিক পেমেন্ট পদ্ধতি গ্রহণ করি যার মধ্যে রয়েছে বিকাশ, নগদ, ক্রেডিট কার্ড এবং ব্যাংক স্থানান্তর। সমস্ত লেনদেন সুরক্ষিত এবং এনক্রিপ্ট করা।",
          },
          {
            question: "আমি কি যেকোনো সময় আমার সাবস্ক্রিপশন বাতিল করতে পারি?",
            answer:
              "হ্যাঁ, আপনার অ্যাকাউন্ট সেটিংস থেকে যেকোনো সময় আপনার সাবস্ক্রিপশন বাতিল করতে পারেন। কোনো লুকানো ফি বা দীর্ঘমেয়াদী প্রতিশ্রুতি নেই।",
          },
          {
            question: "প্রিমিয়াম এবং ভিআইপি এর মধ্যে পার্থক্য কি?",
            answer:
              "প্রিমিয়াম সদস্যরা উন্নত অনুসন্ধান, সীমাহীন আগ্রহ এবং অগ্রাধিকার প্রতিক্রিয়ার অ্যাক্সেস পান। ভিআইপি সদস্যরা সমস্ত প্রিমিয়াম বৈশিষ্ট্য প্লাস ডেডিকেটেড সাপোর্ট এবং বৈশিষ্ট্যযুক্ত প্রোফাইল স্থাপন পান।",
          },
        ],
      },
      safety: {
        title: "নিরাপত্তা এবং শিষ্টাচার",
        items: [
          {
            question: "যদি আমি অনুপযুক্ত বার্তা পাই তবে আমার কি করা উচিত?",
            answer:
              "আপনি তাদের প্রোফাইল থেকে ব্যবহারকারীদের ব্লক বা রিপোর্ট করতে পারেন। আমরা নিরাপত্তাকে গুরুত্বের সাথে নিই এবং সমস্ত রিপোর্ট তদন্ত করা হয়।",
          },
          {
            question: "আমি যার সাথে সংযোগ করেছি তার সাথে দেখা করা কি নিরাপদ?",
            answer:
              "সর্বদা জনসাধারণের জায়গায় দেখা করুন এবং একটি বিশ্বস্ত বন্ধু বা পরিবারের সদস্যকে আপনার পরিকল্পনা সম্পর্কে জানান। তথ্য যাচাই করুন এবং প্রাথমিকভাবে সংবেদনশীল তথ্য ভাগ করার ব্যাপারে সতর্ক থাকুন।",
          },
          {
            question: "আমি কীভাবে যাচাই করতে পারি যে একটি প্রোফাইল সত্যিকার?",
            answer:
              "সমস্ত প্রোফাইল ইমেইল/ফোন নিশ্চিতকরণের সাথে যাচাই করা হয়। প্রোফাইলগুলিতে যাচাইকৃত ব্যাজগুলি সন্ধান করুন। অর্থের অনুরোধগুলি সম্পর্কে সতর্ক থাকুন এবং প্রাথমিকভাবে সংবেদনশীল তথ্য শেয়ার করা এড়ান।",
          },
          {
            question: "আচরণের কোড কি?",
            answer:
              "সম্মানজনক, সৎ এবং ইসলামিক নীতি অনুসরণ করুন। অনুপযুক্ত সামগ্রী, মিথ্যা তথ্য এবং অসম্মানজনক আচরণ এড়ান। আমাদের আচরণের কোডের লঙ্ঘন অ্যাকাউন্ট স্থগিতিতে পরিণত হতে পারে।",
          },
        ],
      },
    },
  },
};

export default function FAQPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [openCategory, setOpenCategory] = useState<string>("account");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(["0"]));

  const toggleItem = (categoryKey: string, itemIndex: number) => {
    const key = `${categoryKey}-${itemIndex}`;
    const newOpen = new Set(openItems);
    if (newOpen.has(key)) {
      newOpen.delete(key);
    } else {
      newOpen.add(key);
    }
    setOpenItems(newOpen);
  };

  const categories = Object.entries(t.categories);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 ">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl pt-2 md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-pink-600 dark:from-emerald-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(([key, category]) => (
              <button
                key={key}
                onClick={() => {
                  setOpenCategory(key);
                  setOpenItems(new Set(["0"]));
                }}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer",
                  openCategory === key
                    ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 dark:hover:border-emerald-700"
                )}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {categories.map(([categoryKey, category]) => (
              <div key={categoryKey} className={openCategory !== categoryKey ? "hidden" : ""}>
                  {category.items.map((item, index) => {
                  const itemKey = `${categoryKey}-${index}`;
                  const isOpen = openItems.has(itemKey);

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-emerald-900 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md mt-5"
                    >
                      <button
                        onClick={() => toggleItem(categoryKey, index)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors duration-200 cursor-pointer"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-left">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-4 transition-transform duration-300",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 py-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-emerald-100 to-pink-100 dark:from-emerald-950/30 dark:to-pink-950/30 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-900">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Still Have Questions?
              </h3>
              <p className="text-gray-700 dark:text-gray-400 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
