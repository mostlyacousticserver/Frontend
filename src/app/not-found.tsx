import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for is not available.",
  robots: NOINDEX_ROBOTS,
};

const SUGGESTIONS = [
  { href: "/courses", label: "Browse guitar courses", hint: "Beginner to pro video programmes" },
  { href: "/songs", label: "Free chord sheets", hint: "Lyrics, chords, and practice notes" },
  { href: "/blog", label: "Read the blog", hint: "Practice routines and playing tips" },
  { href: "/contact", label: "Contact us", hint: "We usually reply within a business day" },
];

/**
 * A 404 that keeps crawl equity moving: real HTTP 404 status (Next handles it),
 * noindex, and internal links so users and bots have somewhere to go.
 */
export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <Navbar variant="light" />

      <section className="mx-auto max-w-[1400px] px-4 pb-20 pt-[140px] sm:px-6 md:px-8 lg:px-10">
        <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0DA694]">
          Error 404
        </p>
        <h1 className="mt-3 max-w-2xl font-sans text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111] sm:text-[40px] md:text-[48px]">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-xl font-sans text-[14px] leading-7 text-[#6B7280] sm:text-[15px]">
          The link may be out of date or the page may have moved. Here are the
          places most people are heading.
        </p>

        <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
          {SUGGESTIONS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-2xl border border-[#E9EEF3] bg-[#F8FAFB] px-5 py-4 transition-colors hover:border-[#11C5BB]/40 hover:bg-[#EFFCF9]"
              >
                <span className="font-sans text-[15px] font-semibold text-[#111111]">
                  {item.label}
                </span>
                <span className="mt-1 block font-sans text-[13px] text-[#6B7280]">
                  {item.hint}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
