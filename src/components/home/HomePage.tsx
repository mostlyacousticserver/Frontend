"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Clock3,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionCurve } from "@/components/ui/SectionCurve";
import { Journey } from "@/components/home/Journey";
import { InstructorStats } from "@/components/home/InstructorStats";
import { Partners } from "@/components/home/Partners";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { Testimonials } from "@/components/public/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/public/FinalCTA";
import { FALLBACK_HOME_HERO } from "@/types/site-settings";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const heroBadgeIcons = [Clock3, BookOpen, BadgeCheck, Star] as const;

const studentAvatars = [
  "/images/student-1.jpg",
  "/images/student-2.jpg",
  "/images/student-3.jpg",
  "/images/testimonial-1.jpg",
  "/images/testimonial-2.jpg",
];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

/**
 * `heroSrc` is resolved on the server (see `app/page.tsx`) so the correct image
 * is in the first paint. Only a genuine load failure falls back to the bundled
 * asset — the fallback is no longer part of the normal render path.
 */
export function HomePage({ heroSrc }: { heroSrc: string }) {
  const [heroImageSrc, setHeroImageSrc] = useState(heroSrc);
  const {
    showcaseCtaUrl,
    heroTitle,
    heroDescription,
    heroBadges,
    heroCtaLabel,
    heroSocialProof,
  } = useSiteSettings();

  const badges =
    heroBadges?.length > 0
      ? heroBadges
      : ["42+ Hours", "8 Modules", "Lifetime Access", "4.9 Rating"];

  return (
    <div id="main-content" className="bg-white text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-svh items-center overflow-hidden bg-[#111111] sm:min-h-[105svh] lg:min-h-[125vh]">
        <div className="absolute inset-0">
          {/* No `key` here: keying on the src remounts the element on every
              change, which tears the painted image down before its replacement
              has decoded and flashes the section background through. */}
          <Image
            src={heroImageSrc}
            alt="Guitarist playing an acoustic guitar during a Mostly Acoustic lesson"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center scale-125"
            onError={() => {
              if (heroImageSrc !== FALLBACK_HOME_HERO) {
                setHeroImageSrc(FALLBACK_HOME_HERO);
              }
            }}
          />
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-28 pt-24 text-center text-white sm:px-6 sm:pb-32 sm:pt-28 md:px-8 md:pb-36 lg:items-end lg:text-left">
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-montserrat text-[40px] font-bold uppercase leading-[1.02] tracking-[-0.02em] md:text-[52px] lg:max-w-[620px] lg:text-[60px]"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-5xl font-sans text-[14px] leading-7 text-white/80 md:text-[15px] md:leading-7 lg:max-w-[620px]"
          >
            {heroDescription}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:mt-6 sm:gap-2.5 lg:w-[620px] lg:justify-start"
          >
            {badges.map((label, index) => {
              const Icon = heroBadgeIcons[index % heroBadgeIcons.length];
              return (
                <motion.span
                  key={`${label}-${index}`}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                  className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 font-sans text-[10px] font-medium text-white backdrop-blur-md transition-colors sm:h-9 sm:gap-2 sm:px-3.5 sm:text-[12px]"
                >
                  <Icon size={12} strokeWidth={1.8} className="sm:hidden" />
                  <Icon size={14} strokeWidth={1.8} className="hidden sm:block" />
                  {label}
                </motion.span>
              );
            })}
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5 lg:w-[620px] lg:justify-start"
          >
            <motion.a
              href={showcaseCtaUrl}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 font-sans text-[13px] font-semibold text-white shadow-[0_10px_30px_rgba(46,196,182,0.4)] transition-colors hover:bg-brand-teal-hover sm:h-12 sm:px-6 sm:text-[15px]"
            >
              {heroCtaLabel}
              <ArrowRight size={16} strokeWidth={2.2} className="sm:hidden" />
              <ArrowRight size={18} strokeWidth={2.2} className="hidden sm:block" />
            </motion.a>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex -space-x-2.5 sm:-space-x-3">
                {studentAvatars.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt="Enrolled student"
                    width={36}
                    height={36}
                    className="h-7 w-7 rounded-full border-2 border-white object-cover sm:h-9 sm:w-9"
                  />
                ))}
              </div>
              <p className="font-sans text-[11px] font-semibold text-white sm:text-[13px] md:text-[14px]">
                {heroSocialProof}
              </p>
            </div>
          </motion.div>

          <div className="flex w-full justify-center sm:w-auto lg:w-[620px] lg:justify-start">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="mt-6 inline-flex w-full max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/50 py-1.5 pl-1.5 pr-3 text-left shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:mt-8 sm:w-auto sm:max-w-none sm:gap-4 sm:py-2.5 sm:pl-2.5 sm:pr-6"
            >
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Image
                  src="/images/pr1.jpeg"
                  alt="Deepak Mehra"
                  width={44}
                  height={44}
                  className="h-8 w-8 rounded-full object-cover sm:h-11 sm:w-11"
                />
                <div className="min-w-0">
                  <p className="font-sans text-[10px] font-medium  text-white/60 sm:text-[15px]">
                    Your Instructor
                  </p>
                  <p className="font-sans text-[12px] font-semibold leading-tight text-white sm:text-[15px]">
                    Deepak Mehra
                  </p>
                </div>
              </div>

              <div className="h-5 w-px shrink-0 bg-white/25 sm:h-7" aria-hidden />

              <p className="shrink-0 whitespace-nowrap font-sans text-[11px] text-white/70 sm:text-[14px]">
                <span className="font-medium text-white">15 years on stage</span> 
              </p>

              <div className="h-5 w-px shrink-0 bg-white/25 sm:h-7" aria-hidden />

              <p className="shrink-0 whitespace-nowrap font-sans text-[11px] text-white/70 sm:text-[14px]">
                <span className="font-medium text-white">180K students trained</span> 
              </p>
            </motion.div>
          </div>
        </div>

        <SectionCurve fillColor="#ffffff" className="z-20" />
      </section>

      <Journey />
      <InstructorStats />
      <Partners />
      <FeaturedCourses />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
