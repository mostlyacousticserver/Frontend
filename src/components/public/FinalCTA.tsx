"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

const PROMO_LABEL = "(One-Time Purchase · 50% Off · Limited Time)";

const FEATURES = [
  "30-day money-back guarantee",
  "42+ hours of content",
  "Private student community",
  "Completion certificate",
] as const;

const PRICE_LABEL = "Lifetime Access";
const CTA_LABEL = "Enroll Now";

export function FinalCTA() {
  const { formattedPrice, showcaseCtaUrl } = useSiteSettings();
  const { isAdmin } = useIsAdmin();
  return (
    <section id="enroll" className="relative isolate bg-white">
      {/*
        Image in normal flow at natural aspect — full banner, never cropped.
        Content overlays in the same grid cell and stays centered.
      */}
      <div className="relative grid w-full">
        <div className="col-start-1 row-start-1 w-full min-w-0">
          <Image
            src="/images/guitar-main.jpeg"
            alt="Close-up of an acoustic guitar being played"
            width={1600}
            height={558}
            sizes="100vw"
            className="block h-auto w-full select-none"
            priority={false}
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none col-start-1 row-start-1 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.82)_0%,_rgba(255,255,255,0.4)_40%,_transparent_70%)] md:bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.55)_0%,_rgba(255,255,255,0.15)_45%,_transparent_70%)]"
        />

        <div className="col-start-1 row-start-1 flex w-full min-w-0 items-center justify-center self-stretch px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:py-16">
          <div className="mx-auto flex w-full min-w-0 max-w-[440px] flex-col items-center text-center sm:max-w-[560px] md:max-w-[820px] lg:max-w-[920px]">
            <motion.div
              {...fadeUp}
              className="inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-[2px] sm:px-3.5 sm:py-2"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal"
                aria-hidden
              />
              <p className="min-w-0 break-words font-sans text-[10px] font-medium leading-snug text-[#8B8B8B] sm:text-[11px] md:text-[12px]">
                {PROMO_LABEL}
              </p>
            </motion.div>

            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="mt-4 w-full font-sans text-[20px] font-bold uppercase leading-[1.2] tracking-[0.01em] text-[#1a1a1a] sm:mt-5 sm:text-[28px] md:text-[34px] lg:text-[38px]"
            >
              <span className="block whitespace-nowrap">
                The Guitar Journey You
              </span>
              <span className="block whitespace-nowrap">
                Always Wanted{" "}
                <span className="text-brand-teal ">Starts Here.</span>
              </span>
            </motion.h2>

            <motion.ul
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-5 grid w-full min-w-0 grid-cols-2 gap-x-3 gap-y-3 sm:mt-6 md:hidden"
            >
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="min-w-0 break-words text-center font-sans text-[11px] font-medium leading-snug text-[#6B6B6B] sm:text-[12px]"
                >
                  {feature}
                </li>
              ))}
            </motion.ul>

            <motion.ul
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-6 hidden w-full min-w-0 items-center justify-center md:flex md:flex-nowrap"
            >
              {FEATURES.map((feature, index) => (
                <li key={feature} className="flex shrink-0 items-center">
                  {index > 0 ? (
                    <span
                      className="mx-2.5 h-3 w-px shrink-0 bg-brand-orange/60 lg:mx-3.5"
                      aria-hidden
                    />
                  ) : null}
                  <span className="whitespace-nowrap font-sans text-[12px] font-medium text-[#6B6B6B] lg:text-[13px]">
                    {feature}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="mt-7 flex w-full min-w-0 max-w-[280px] flex-col items-center gap-4 sm:mt-8 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5 md:mt-10"
            >
              <div className="text-center sm:text-right">
                <p className="font-sans text-[12px] font-medium text-[#8B8B8B]">
                  {PRICE_LABEL}
                </p>
                <p className="mt-1.5 font-sans text-[22px] font-bold leading-none text-[#1a1a1a] sm:text-[24px]">
                  Only {formattedPrice}
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-teal px-8 font-sans text-[14px] font-semibold text-white shadow-[0_8px_22px_rgba(45,212,191,0.32)] transition-colors hover:bg-brand-teal-hover sm:w-auto sm:px-9 sm:text-[15px]"
                  >
                    Go to dashboard
                  </Link>
                ) : (
                  <a
                    href={showcaseCtaUrl}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-teal px-8 font-sans text-[14px] font-semibold text-white shadow-[0_8px_22px_rgba(45,212,191,0.32)] transition-colors hover:bg-brand-teal-hover sm:w-auto sm:px-9 sm:text-[15px]"
                  >
                    {CTA_LABEL}
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
