export const pricingTranslation = {
  en: {
    title: "Our Pricing Plans",
    subtitle: "Choose the right plan to find your life partner",

    free: "Free",
    freeDesc: "Perfect to get started",
    // freePrice: "0 BDT",
    freePrice: "",
    freeDuration: "Forever",
    freeFeatures: {
      create: "Profile Creating",
      view: "Profile Viewing",
      shortlist: "Profile Shortlist",
      ignore: "Profile Ignore List",
    },
    freeBtn: "Get Started",

    premium: "Premium",
    premiumDesc: "Most popular plan",
    premiumPrice: "3,000 BDT",
    premiumDuration: "3 months",
    premiumFeatures: {
      freeFeatures: "All Free features",
      featuring: "Profile Featuring",
      contactView: "Profile viewing with contact details (100 profiles)",
      interest: "Unlimited interest sending",
    },
    premiumBtn: "Get Premium",
    whatsIncluded: "What's Included",

    vip: "VIP",
    vipDesc: "Get maximum benefits",
    vipPrice: "5,000 BDT",
    vipDuration: "6 Months",
    vipFeatures: {
      premiumFeatures: "All Premium features",
      duration: "6 months duration",
      unlimited: "Unlimited profile access",
      support: "Priority customer support",
    },
    vipBtn: "Become VIP",

    contact: "Have questions? Contact us",
    supportBtn: "Talk to Support Team",
  },

  bn: {
    title: "আমাদের প্রাইসিং প্ল্যান",
    subtitle: "আপনার জীবনসঙ্গী খুঁজতে সঠিক প্ল্যানটি বেছে নিন",

    free: "ফ্রি",
    freeDesc: "শুরু করার জন্য উপযুক্ত",
    // freePrice: "০ টাকা",
    freePrice: "",
    freeDuration: "চিরকাল",
    freeFeatures: {
      create: "প্রোফাইল তৈরি",
      view: "প্রোফাইল দেখা",
      shortlist: "শর্টলিস্টে রাখা",
      ignore: "ইগনোর লিস্টে রাখা",
    },
    freeBtn: "শুরু করুন",

    premium: "Premium",
    premiumDesc: "সবচেয়ে জনপ্রিয় প্ল্যান",
    premiumPrice: "৩,০০০ টাকা",
    premiumDuration: "৩ মাস",
    premiumFeatures: {
      freeFeatures: "সব ফ্রি ফিচার",
      featuring: "প্রোফাইল ফিচারিং",
      contactView: "কনট্যাক্ট ডিটেইলসহ প্রোফাইল দেখা (১০০ প্রোফাইল)",
      interest: "আনলিমিটেড ইন্টারেস্ট পাঠানো",
    },
    premiumBtn: "প্রিমিয়াম নিন",

    vip: "VIP",
    vipDesc: "সর্বোচ্চ সুবিধা পান",
    vipPrice: "৫,০০০ টাকা",
    vipDuration: "৬ মাস",
    vipFeatures: {
      premiumFeatures: "সব প্রিমিয়াম ফিচার",
      duration: "৬ মাসের মেয়াদ",
      unlimited: "আনলিমিটেড প্রোফাইল অ্যাক্সেস",
      support: "প্রায়োরিটি কাস্টমার সাপোর্ট",
    },
    vipBtn: "ভিআইপি হোন",

    contact: "কোনো প্রশ্ন আছে? আমাদের সাথে যোগাযোগ করুন",
    supportBtn: "সাপোর্ট টিমের সাথে কথা বলুন",
  },
};

export type Language = keyof typeof pricingTranslation;
export type TranslationKey = keyof typeof pricingTranslation.en;
