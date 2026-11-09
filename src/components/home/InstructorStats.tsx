"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { SectionCurve } from "@/components/ui/SectionCurve";
import { BlogMedia } from "@/components/blog/BlogMedia";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { FALLBACK_FEATURED_COURSE_IMAGE } from "@/types/site-settings";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
};

function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
  duration = 1.8,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(() =>
    decimals > 0 ? (0).toFixed(decimals) : "0",
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (decimals > 0) {
          setDisplay(latest.toFixed(decimals));
        } else {
          setDisplay(Math.round(latest).toLocaleString("en-US"));
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, decimals, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const socialBadges = [
  {
    label: "210K Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f58529" />
            <stop offset="50%" stopColor="#dd2a7b" />
            <stop offset="100%" stopColor="#8134af" />
          </linearGradient>
        </defs>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="url(#ig-gradient)"
        />
        <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
      </svg>
    ),
  },
  {
    label: "103K Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#1877F2" />
        <path
          d="M13.5 8.2h1.7V5.8H13.3c-2 0-3.4 1.3-3.4 3.5v1.5H8.2v2.5h1.7V18h2.7v-4.7h2l.4-2.5h-2.4V9.5c0-.7.3-1.3 1.2-1.3z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    label: "10.2K YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="white" />
      </svg>
    ),
  },
];

const stats = [
  {
    value: 180,
    suffix: "K+",
    label: "Global Students",
    description: "Join a thriving worldwide community.",
    delay: 0.12,
  },
  {
    value: 320,
    suffix: "K+",
    label: "Followers",
    description: "Trusted by guitar learners worldwide",
    delay: 0.18,
  },
  {
    value: 4.9,
    suffix: "",
    decimals: 1,
    label: "Average rating",
    description: "Highly trusted by real learners.",
    delay: 0.24,
    showStar: true,
  },
  {
    value: 42,
    suffix: "+",
    label: "Hours of Video",
    description: "In-depth, comprehensive lessons.",
    delay: 0.3,
  },
] as const;

export function InstructorStats() {
  const {
    formattedPrice,
    formattedOriginalPrice,
    showcaseCtaUrl,
    featuredCourseImageUrl,
    featuredCourseBadge,
    featuredCourseTitle,
    featuredCourseDescription,
    featuredCourseBullets,
    featuredCoursePriceNote,
    featuredCourseCtaLabel,
  } = useSiteSettings();
  const { isAdmin } = useIsAdmin();
  const bullets =
    featuredCourseBullets?.length > 0
      ? featuredCourseBullets
      : [
          "8 structured modules · 42+ hours of HD video",
          "Downloadable tabs, chord sheets & practice guides",
          "Private student community · completion certificate",
          "Lifetime access · all future updates included free",
        ];

  return (
    <section className="relative bg-[#f6f6f6] py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <motion.div
          {...fadeUp}
          className="mb-6 flex items-center justify-start gap-1.5 sm:mb-8 sm:gap-2 md:mb-10"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand-teal sm:h-2 sm:w-2"
            aria-hidden
          />
          <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px] md:text-[14px]">
            (Meet Your Instructor)
          </p>
        </motion.div>

        {/* <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.04 }}
          className="text-left font-sans text-[22px] font-bold uppercase leading-[1.15] tracking-[0.02em] text-[#111111] sm:text-[26px] md:text-[32px] lg:text-[36px]"
        >
          Deepak Mehra
        </motion.h2> */}

        {/* <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="mt-2 max-w-[520px] text-left font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-3 sm:text-[14px] sm:leading-7 md:text-[15px]"
        >
          Guitar educator, performer, and founder of Mostly Acoustic — helping
          learners play with confidence through structured, song-first teaching.
        </motion.p> */}

        <div className="mt-8 grid items-start gap-5 sm:mt-10 sm:gap-6 lg:mt-12 lg:grid-cols-[540px_1fr] lg:items-stretch lg:gap-5">
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:w-[540px] lg:max-w-none"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.35 }}
              className="relative h-[280px] w-full overflow-hidden rounded-[18px] shadow-[0_16px_40px_rgba(0,0,0,0.1)] sm:h-[340px] sm:rounded-[22px] md:h-[380px] lg:h-[420px] lg:rounded-[24px] lg:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            >
              <Image
                src="/images/pr1.jpeg"
                alt="Deepak Mehra portrait"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 500px, 540px"
                className="object-cover object-top"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
              />

              <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap gap-1.5 sm:bottom-4 sm:left-4 sm:right-auto sm:flex-col sm:gap-2">
                {socialBadges.map((badge, index) => (
                  <motion.a
                    key={badge.label}
                    href={badge.href}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                    whileHover={{ scale: 1.04, x: 2 }}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-2 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.12)] sm:px-2.5 sm:py-1.5 sm:shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
                  >
                    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center sm:h-4 sm:w-4 [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4">
                      {badge.icon}
                    </span>
                    <span className="font-sans text-[10px] font-semibold leading-none text-[#1a1a1a] sm:text-[11px] md:text-[12px]">
                      {badge.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-4 lg:h-[420px] lg:grid-rows-2 lg:gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: stat.delay }}
                whileHover={{ y: -4 }}
                className="flex h-full min-h-[120px] flex-col justify-end rounded-[16px] bg-[#ebecef] px-3 py-3.5 shadow-[0_6px_24px_rgba(17,17,17,0.04)] sm:min-h-0 sm:rounded-[20px] sm:px-5 sm:py-5 md:rounded-[24px] md:px-6 md:py-6"
              >
                <p className="flex items-center gap-1.5 font-sans text-[24px] font-bold leading-none text-[#111111] sm:gap-2 sm:text-[32px] md:text-[38px] lg:text-[42px]">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={"decimals" in stat ? stat.decimals : 0}
                    duration={1.8 + (stat.delay - 0.12) * 0.4}
                  />
                  {"showStar" in stat && stat.showStar ? (
                    <Star
                      className="h-5 w-5 fill-amber-400 text-amber-400 sm:h-6 sm:w-6 md:h-7 md:w-7"
                      aria-hidden
                    />
                  ) : null}
                </p>
                <p className="mt-2 font-sans text-[12px] font-bold leading-tight text-[#1a1a1a] sm:mt-3 sm:text-[14px] md:text-[16px]">
                  {stat.label}
                </p>
                <p className="mt-1 font-sans text-[11px] leading-snug text-gray-400 sm:mt-2 sm:text-[12px] md:text-[14px]">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-6 rounded-[18px] bg-[#ebecef] p-4 sm:mt-8 sm:rounded-[22px] sm:p-5 md:mt-10 md:rounded-[24px] lg:p-6"
        >
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.9fr_1.2fr_0.75fr] lg:items-center lg:gap-8">
            <div className="relative overflow-hidden rounded-[14px] sm:rounded-[16px] md:rounded-[18px]">
              <div className="relative aspect-[16/10] min-h-[160px] sm:aspect-[16/11] sm:min-h-[200px]">
                {featuredCourseImageUrl?.trim() ? (
                  <BlogMedia
                    stored={featuredCourseImageUrl}
                    alt={featuredCourseTitle}
                    rounded="rounded-none"
                  />
                ) : (
                  <Image
                    src={FALLBACK_FEATURED_COURSE_IMAGE}
                    alt={featuredCourseTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                )}
              </div>
              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-md sm:left-3 sm:top-3 sm:gap-2 sm:px-3 sm:py-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                  aria-hidden
                />
                <span className="font-sans text-[11px] font-semibold text-[#1a1a1a] sm:text-[12px]">
                  {featuredCourseBadge}
                </span>
              </span>
            </div>

            <div>
              <h3 className="font-montserrat text-[20px] font-bold text-[#111111] sm:text-[24px] md:text-[28px]">
                {featuredCourseTitle}
              </h3>
              <p className="mt-2 font-sans text-[13px] leading-6 text-[#666666] sm:mt-3 sm:text-[14px] sm:leading-7 md:text-[15px]">
                {featuredCourseDescription}
              </p>
              <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
                {bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 sm:gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 sm:mt-2"
                      aria-hidden
                    />
                    <span className="font-sans text-[12px] leading-5 text-[#555555] sm:text-[13px] sm:leading-6 md:text-[14px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#d8dbe0] pt-4 sm:gap-0 sm:border-t-0 sm:pt-0 lg:items-stretch">
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-sans text-[20px] font-bold text-[#111111] sm:text-[22px] md:text-[24px]">
                    At just {formattedPrice}
                  </p>
                  {formattedOriginalPrice ? (
                    <p className="font-sans text-[14px] text-gray-400 line-through sm:text-[15px]">
                      {formattedOriginalPrice}
                    </p>
                  ) : null}
                </div>
                <p className="mt-1 font-sans text-[12px] text-gray-400 sm:text-[13px]">
                  {featuredCoursePriceNote}
                </p>
              </div>
              {isAdmin ? null : (
                <motion.a
                  href={showcaseCtaUrl}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-teal px-6 font-sans text-[14px] font-semibold text-white shadow-[0_10px_28px_rgba(45,212,191,0.35)] transition-colors hover:bg-brand-teal-hover sm:mt-5 sm:h-12 sm:text-[15px] lg:w-full"
                >
                  {featuredCourseCtaLabel}
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <SectionCurve fillColor="#ffffff" />
    </section>
  );
}
