export const bannerContent = {
  en: {
    banner: {
      tagLine: "Trusted by Happy Couples",
      title: "Find Your Match Perfect Today",
      description:
        "“And marry those among you who are single, and the righteous among your male and female servants. If they are poor, Allah will enrich them out of His bounty. And Allah is All-Encompassing, All-Knowing.”(Surah An-Nur, Ayah 32)",
      badgeVerify: "100% Verified",
      privacy: "Privacy Protected",
      privacyDesc: "All profiles are manually verified for your safety",
    },
  },
  bn: {
    banner: {
      tagLine: "সুখী দম্পতিদের দ্বারা বিশ্বস্ত",
      title: "আপনার কাঙ্ক্ষিত জীবনসঙ্গী খোঁজার নির্ভরযোগ্য প্ল্যাটফর্ম",
      description:
        "“তোমাদের মধ্যে যারা বিবাহহীন, তাদের বিবাহ সম্পাদন করে দাও। আর তোমাদের দাস-দাসীদের মধ্যে যারা সৎ, তাদেরও (বিয়ে করাও)। তারা যদি দরিদ্রও হয়, তবে আল্লাহ্‌ নিজ অনুগ্রহে তাদের সচ্ছল করে দেবেন। আল্লাহ্‌ প্রশস্ত দানশীল ও সর্বজ্ঞ।”(সূরা নূর, আয়াত-৩২)",
      badgeVerify: "১০০% যাচাইকৃত",
      privacy: "গোপনীয়তা সুরক্ষিত",
      privacyDesc:
        "আপনার নিরাপত্তার জন্য সমস্ত প্রোফাইল ম্যানুয়ালি যাচাই করা হয়",
    },
  },
};

export type Language = keyof typeof bannerContent;
export type TranslationKey = keyof typeof bannerContent.en;
