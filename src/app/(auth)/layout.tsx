import type { Metadata } from "next";
import Image from "next/image";
import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { Navbar } from "@/components/Navbar";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Musician playing acoustic guitar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      </div>
      <div className="relative z-10 opacity-50 blur-sm">
        <Navbar variant="transparent" />
      </div>
      <div className="min-h-screen" aria-hidden />
      <AuthOverlay>{children}</AuthOverlay>
    </div>
  );
}
