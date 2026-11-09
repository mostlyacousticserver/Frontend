"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Map,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease },
};

type FeatureCard = {
  number: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const features: FeatureCard[] = [
  {
    number: "1",
    title: "Visual Learning Map",
    description: "See the fretboard as a unified system, not isolated boxes.",
    Icon: Map,
  },
  {
    number: "2",
    title: "Theory in Practice",
    description: "Music theory applied immediately to real playing situations.",
    Icon: Heart,
  },
  {
    number: "3",
    title: "Active Community",
    description: "Feedback and support from thousands of fellow players.",
    Icon: Users,
  },
  {
    number: "4",
    title: "Flexible Learning Pace",
    description: "Learn anytime, anywhere at your own speed with lifetime access.",
    Icon: CheckCircle,
  },
];

export function WhyChooseCourse() {
  const { formattedPrice, showcaseCtaUrl } = useSiteSettings();
  const { isAdmin } = useIsAdmin();

  return (
    <section className="overflow-x-clip bg-white py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:gap-12 xl:gap-16">
          {/* Left content */}
          <div className="flex flex-col text-left">
            <motion.div {...fadeUp} className="flex items-center gap-1.5 sm:gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#11C5BB] sm:h-2 sm:w-2"
                aria-hidden
              />
              <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px]">
                (Why choose our course)
              </p>
            </motion.div>

            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.06 }}
              className="mt-3 max-w-md font-sans text-[26px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#111111] sm:mt-4 sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[56px]"
            >
              The Acoustic
              <br />
              Difference
            </motion.h2>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.12 }}
              className="mt-3 max-w-md font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-4 sm:text-[14px] sm:leading-7 md:text-[15px] md:leading-8"
            >
              We don&apos;t just teach you where to put your fingers. We teach
              you how to think like a musician.
            </motion.p>

            {isAdmin ? null : (
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="mt-5 w-full sm:mt-6 md:mt-7 lg:w-auto"
            >
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={showcaseCtaUrl}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#11C5BB] px-5 font-sans text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(17,197,187,0.35)] transition-colors hover:bg-[#0fb0a7] sm:h-12 sm:w-auto sm:px-6 sm:text-[14px] md:px-7"
                >
                  <span className="sm:hidden">Start Learning — {formattedPrice}</span>
                  <span className="hidden sm:inline">
                    Start Learning Today — Just {formattedPrice}
                  </span>
                  <ArrowRight size={16} className="sm:h-[18px] sm:w-[18px]" aria-hidden />
                </a>
              </motion.div>
            </motion.div>
            )}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 md:gap-5">
            {features.map((feature, index) => (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                }}
                className="relative overflow-hidden rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition-shadow duration-300 sm:rounded-[20px] sm:p-5 md:rounded-[22px] md:p-6 lg:rounded-3xl"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1 select-none font-sans text-[56px] font-bold leading-none text-[#11C5BB]/15 sm:right-4 sm:top-2 sm:text-[68px] md:text-[80px]"
                >
                  {feature.number}
                </span>

                <div className="relative z-10">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#11C5BB] text-white shadow-[0_8px_20px_rgba(17,197,187,0.28)] sm:h-12 sm:w-12 sm:rounded-[14px] md:h-[52px] md:w-[52px]">
                    <feature.Icon
                      size={20}
                      className="sm:h-[22px] sm:w-[22px] md:h-6 md:w-6"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>

                  <h3 className="mt-4 font-sans text-[15px] font-bold text-[#111111] sm:mt-5 sm:text-[16px] md:text-[17px] lg:text-[18px]">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:mt-2 sm:text-[13px] sm:leading-6">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
