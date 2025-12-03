export const navbarTranslation = {
  en: {
    home: "Home",
    findMatch: "Find Match",
    successStories: "Success Stories",
    about: "About",
    contact: "Contact",
    login: "Login",
    registration: "Sign Up",
  },
  bn: {
    home: "হোম",
    findMatch: "বায়োডাটা খুজুন",
    successStories: "সফল গল্প",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    login: "লগইন",
    registration: "একাউন্ট খুলুন",
  },
};

export type Language = keyof typeof navbarTranslation;
export type TranslationKey = keyof typeof navbarTranslation.en;
