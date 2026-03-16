"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/noto.css";
import "@/css/style.css";
import "quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/sonner";
import LangSwitcher from "@/components/LangSwitcher";
import { useLanguage } from "@/lib/useLanguage";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useLanguage();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang='en' className={`lang-${lang}`} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <SessionWrapper>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : <>
              <Toaster />
              {children}
              <LangSwitcher lang={lang} setLang={setLang} />
            </>}
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
