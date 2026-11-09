"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease },
};

const storyParagraphs = [
  "When I first picked up a guitar, the fretboard looked like a chaotic grid of endless possibilities and frustrating dead ends. I spent years memorizing shapes without understanding the language behind them. It wasn't until I started breaking down the underlying theory into digestible, visual patterns that the instrument truly opened up to me.",
  "Acoustic was born from a simple desire: to save you those years of frustration. We've synthesized decades of playing, touring, and teaching into a curriculum that prioritizes 'aha' moments over rote memorization.",
  "Our approach is deeply rooted in the belief that anyone can master the guitar if they're shown the right map. We're not just teaching you songs; we're giving you the vocabulary to write your own, to improvise freely, and to speak the language of music fluently.",
];

const socialCards = [
  {
    label: "Instagram",
    value: "210K",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id="about-me-ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f58529" />
            <stop offset="50%" stopColor="#dd2a7b" />
            <stop offset="100%" stopColor="#8134af" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#about-me-ig)" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "103K",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
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
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="white" />
      </svg>
    ),
  },
];

export function AboutMe() {
  return (
    <section className="overflow-x-clip bg-white py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          {...fadeUp}
          className="flex items-center gap-1.5 sm:gap-2"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand-teal sm:h-2 sm:w-2"
            aria-hidden
          />
          <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px]">
            (About me)
          </p>
        </motion.div>

        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="mt-2.5 max-w-xl text-left font-sans text-[22px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#1a1a1a] sm:mt-3 sm:text-[28px] md:text-[34px] lg:text-[40px]"
        >
          The Story Behind
          <br />
          Mostly Acoustic
        </motion.h2>

        <div className="mt-6 grid items-start gap-6 sm:mt-8 sm:gap-8 md:mt-10 lg:grid-cols-[380px_1fr] lg:gap-12 xl:grid-cols-[420px_1fr] xl:gap-14">
          {/* Image + socials */}
          <div className="mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:mx-0 xl:max-w-[420px]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="relative aspect-[629/565] w-full overflow-hidden rounded-[16px] sm:rounded-2xl md:rounded-[20px]"
            >
              <Image
                src="/images/pr3.jpeg"
                alt="Deepak Mehra with guitar case"
                fill
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 420px"
                className="object-cover object-top"
              />
            </motion.div>

            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:mt-4 sm:gap-2 md:gap-2.5">
              {socialCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.94, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.22 + index * 0.07, ease }}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F3F4F6] px-2 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:px-2.5"
                >
                  <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center sm:h-4 sm:w-4">
                    {card.icon}
                  </span>
                  <span className="font-sans text-[10px] leading-none sm:text-[11px] md:text-[12px]">
                    <span className="font-bold text-[#1a1a1a]">{card.value}</span>{" "}
                    <span className="font-medium text-[#9CA3AF]">{card.label}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Story + quote */}
          <div className="flex flex-col text-left">
            <div className="space-y-4 sm:space-y-5">
              {storyParagraphs.map((paragraph, index) => (
                <motion.p
                  key={paragraph.slice(0, 32)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.14 + index * 0.08, ease }}
                  className="font-sans text-[13px] leading-[1.75] text-[#6B7280] sm:text-[13px] sm:leading-[1.85] md:text-[14px] md:leading-[1.9]"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.blockquote
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.4, ease }}
              className="mt-6 border-l-2 border-brand-orange pl-3.5 sm:mt-8 sm:pl-4 md:mt-10 md:pl-5"
            >
              <p className="font-serif text-[14px] italic leading-[1.65] text-[#8B909A] sm:text-[15px] sm:leading-[1.7] md:text-[16px] lg:text-[17px]">
                &ldquo;The goal isn&apos;t just to play the right notes, but to
                understand why they&apos;re right.&rdquo;{" "}
                <span className="font-serif font-bold not-italic text-[#6B7280]">
                  — Deepak Mehra
                </span>
              </p>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
