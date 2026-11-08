"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";
const LanguageContext = createContext<{ language: Language; toggleLanguage: () => void }>({ language: "en", toggleLanguage: () => undefined });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("baraka:language");
      if (stored === "ar") setLanguage("ar");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("baraka:language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ language, toggleLanguage: () => setLanguage((current) => current === "en" ? "ar" : "en") }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
