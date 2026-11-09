"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        {children}
        <ScrollToTop />
        <Toaster position="top-right" />
      </SiteSettingsProvider>
    </AuthProvider>
  );
}
