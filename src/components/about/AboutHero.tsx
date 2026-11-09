"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const ease = [0.22, 1, 0.36, 1] as const;

const badges = ["Recording Artist", "Guitar Educator"];

const studentAvatars = [
  "/images/student-1.jpg",
  "/images/student-2.jpg",
  "/images/student-3.jpg",
  "/images/testimonial-1.jpg",
  "/images/testimonial-2.jpg",
];

const socialCards = [
  {
    label: "Instagram",
    value: "210K",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id="about-ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f58529" />
            <stop offset="50%" stopColor="#dd2a7b" />
            <stop offset="100%" stopColor="#8134af" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#about-ig)" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "103K",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#1877F2" />
        <path
          d="M13.5 8.2h1.7V5.8H13.3c-2 0-3.4 1.3-3.4 3.5v1.5H8.2v2.5h1.7V18h2.7v-4.7h2l.4-2.5h-2.4V9.5c0-.7.3-1.3 1.2-1.3z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    value: "10.2K",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="white" />
      </svg>
    ),
  },
];


function StatsMarquee() {
  const stats = [
    "200M+ Streams",
    "180,000 Students",
    "4.9★ Rating",
    "30-Day Guarantee",
    "Lifetime Access",
    "Beginner Friendly",
  ];

  return (
    <div className="relative overflow-hidden border-t border-black/[0.08] bg-[#F5F5F7] py-4 sm:py-5 md:py-6">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#F5F5F7] to-transparent sm:w-20 md:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#F5F5F7] to-transparent sm:w-20 md:w-32"
        aria-hidden
      />

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-animate {
          animation: marquee 40s linear infinite;
        }
      `}</style>

      <div className="marquee-animate flex w-max items-center gap-8 sm:gap-10 md:gap-12">
        {[...stats, ...stats, ...stats].map((stat, index) => (
          <div
            key={`${stat}-${index}`}
            className="flex shrink-0 items-center gap-6 sm:gap-8"
          >
            <span className="whitespace-nowrap font-montserrat text-[12px] font-medium uppercase tracking-[0.05em] text-[#555555] sm:text-[13px] md:text-[12px]">
              {stat}
            </span>
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-[#CCCCCC]"
              aria-hidden
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutHero() {
  const { showcaseCtaUrl } = useSiteSettings();
  const { isAdmin } = useIsAdmin();
  return (
    <section className="relative overflow-x-clip bg-white pt-3">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[calc(100svh-78px)] lg:grid-cols-2">
        {/* Image first on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="relative order-1 aspect-[4/5] w-full max-h-[420px] sm:aspect-[16/11] sm:max-h-none md:aspect-[16/10] lg:order-2 lg:aspect-auto lg:min-h-[calc(100svh-78px)] lg:max-h-none"
        >
          <Image
            src="/images/pr1.jpeg"
            alt="Deepak Mehra playing guitar"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_20%]"
          />

          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/40 to-transparent px-3 pb-3 pt-8 sm:px-5 sm:pb-5 sm:pt-10 md:px-6 md:pb-6">
            <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 md:gap-2.5">
              {socialCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 + index * 0.08, ease }}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-[0_6px_18px_rgba(0,0,0,0.14)] sm:gap-1.5 sm:px-2.5 sm:py-1.5 md:gap-2 md:px-3 md:py-2"
                >
                  <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center sm:h-4 sm:w-4 md:h-5 md:w-5">
                    {card.icon}
                  </span>
                  <span className="font-sans text-[10px] leading-none sm:text-[11px] md:text-[13px]">
                    <span className="font-bold text-[#111111]">{card.value}</span>{" "}
                    <span className="font-medium text-[#9CA3AF]">{card.label}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="order-2 flex flex-col justify-center px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 md:px-8 lg:order-1 lg:px-12 lg:pb-14 lg:pt-10 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand-teal sm:h-2 sm:w-2"
              aria-hidden
            />
            <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px] md:text-[14px]">
              (The Instructor)
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="mt-3 font-sans text-[32px] font-bold uppercase leading-[1.02] tracking-[-0.03em] text-[#111111] sm:mt-4 sm:text-[42px] md:text-[52px] lg:text-[50px] xl:text-[65px]"
          >
            Deepak Mehra
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
            }}
            className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-2.5"
          >
            {badges.map((badge) => (
              <motion.span
                key={badge}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
                }}
                whileHover={{ y: -2, scale: 1.03 }}
                className="inline-flex rounded-full bg-[#EEF0F3] px-3 py-1.5 font-sans text-[11px] font-medium text-[#1a1a1a] transition-colors hover:bg-[#E4E7EB] sm:px-4 sm:py-2 sm:text-[12px] md:text-[13px]"
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease }}
            className="mt-5 border-l-[3px] border-brand-orange pl-3.5 text-left sm:mt-6 sm:pl-4 md:mt-7 md:pl-5 lg:mt-9"
          >
            <p className="font-serif text-[14px] italic leading-[1.65] text-[#9CA3AF] sm:text-[16px] md:text-[18px] lg:text-[22px]">
              {`"I didn't set out to become a teacher. I set out to solve the problem I had at 14, and 180,000 students later, it's become the most meaningful thing I do."`}
            </p>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42, ease }}
            className="mt-5 flex flex-col gap-3.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-8"
          >
            {isAdmin ? null : (
            <motion.div
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <a
                href={showcaseCtaUrl}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-teal px-6 font-sans text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(45,212,191,0.35)] transition-colors hover:bg-brand-teal-hover sm:h-12 sm:w-auto sm:text-[14px] md:text-[15px]"
              >
                Enroll Now
                <ArrowRight size={16} className="sm:h-[18px] sm:w-[18px]" aria-hidden />
              </a>
            </motion.div>
            )}

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex -space-x-2 sm:-space-x-2.5">
                {studentAvatars.map((src, index) => (
                  <div
                    key={src}
                    className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm sm:h-8 sm:w-8 md:h-9 md:w-9"
                    style={{ zIndex: studentAvatars.length - index }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="font-sans text-[11px] font-medium leading-snug text-[#9CA3AF] sm:text-[12px] md:text-[14px]">
                500+ Students already enrolled
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        <StatsMarquee />
      </motion.div>
    </section>
  );
}
