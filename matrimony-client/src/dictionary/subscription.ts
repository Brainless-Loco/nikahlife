export const subscribeTranslation = {
  en: {
    title: "Get Marriage Tips & Success Stories",
    subtitle:
      "Join and get weekly relationship advice and inspiring love stories",
    placeholder: "Enter your email address",
    button: "Subscribe Free",
  },

  bn: {
    title: "বিয়ে সম্পর্কিত টিপস ও সফলতার গল্প পান",
    subtitle:
      "যোগ দিন এবং সাপ্তাহিক সম্পর্ক বিষয়ক পরামর্শ ও অনুপ্রেরণামূলক ভালোবাসার গল্প পান",
    placeholder: "আপনার ইমেইল ঠিকানা লিখুন",
    button: "ফ্রি সাবস্ক্রাইব করুন",
  },
};

export type SubscribeLanguage = keyof typeof subscribeTranslation;
export type SubscribeTranslationKey = keyof typeof subscribeTranslation.en;
