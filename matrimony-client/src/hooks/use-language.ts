// "use client";

// import { Language } from "@/dictionary/banner";
// import { useState, useEffect } from "react";

// export function useLanguage() {
//   const [language, setLanguage] = useState<Language>("bn");

//   useEffect(() => {
//     const saved = localStorage.getItem("language") as Language;
//     if (saved && (saved === "en" || saved === "bn")) {
//       setLanguage(saved);
//     }
//   }, []);

//   const changeLanguage = (lang: Language) => {
//     setLanguage(lang);
//     localStorage.setItem("language", lang);
//   };

//   return { language, changeLanguage };
// }


import { useEffect, useState } from "react";

export function useLanguage() {
  const [language, setLanguage] = useState<"en" | "bn">("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as "en" | "bn" | null;
    setLanguage(storedLang || "bn");
  }, []);

  const changeLanguage = (lang: "en" | "bn") => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
    window.location.reload();
  };

  return { language, changeLanguage };
}
