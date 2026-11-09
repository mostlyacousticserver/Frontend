"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionCurve } from "@/components/ui/SectionCurve";
import { SOCIAL_PROFILES } from "@/lib/site-config";

const [INSTAGRAM_URL, YOUTUBE_URL, FACEBOOK_URL] = SOCIAL_PROFILES;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

// Real routes, not in-page anchors: the footer is the site-wide internal link
// hub, and fragment links give crawlers nothing to follow.
const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/songs", label: "Chord Sheets" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const resourceLinks = [
  { href: "/#faq", label: "FAQ" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/blog", label: "Practice Tips" },
  { href: "/courses", label: "Beginner Course" },
  { href: "/contact", label: "Support" },
];

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Kept in sync with the schema.org `sameAs` list in site-config so the profiles
// search engines are told about are the ones actually linked here.
const socials = [
  { href: FACEBOOK_URL, label: "Facebook", Icon: FacebookIcon },
  { href: YOUTUBE_URL, label: "YouTube", Icon: YoutubeIcon },
  { href: INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon },
];

function FooterLink({ href, label, delay }: { href: string; label: string; delay: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
    >
      <Link
        href={href}
        className="inline-block font-sans text-[13px] font-medium text-white/75 transition-all duration-300 hover:translate-x-1 hover:text-brand-teal sm:text-[14px] md:text-[15px]"
      >
        {label}
      </Link>
    </motion.li>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#2E4F6A] text-white"
    >
      <SectionCurve fillColor="#ffffff" position="top" className="z-10" />

      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 md:px-8 md:pt-32 lg:pt-36">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-10">
          {/* Quick Links + Resources side by side on all breakpoints */}
          <div className="grid w-full grid-cols-2 gap-6 text-left sm:gap-12 md:w-auto md:gap-20 lg:gap-24">
            <motion.div {...fadeUp} className="flex flex-col items-start">
              <h3 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:mb-5 sm:text-[12px]">
                Quick Links
              </h3>
              <ul className="space-y-3 sm:space-y-3.5">
                {quickLinks.map((link, index) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    delay={0.05 * index}
                  />
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="flex flex-col items-start"
            >
              <h3 className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:mb-5 sm:text-[12px]">
                Resources
              </h3>
              <ul className="space-y-3 sm:space-y-3.5">
                {resourceLinks.map((link, index) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    delay={0.05 * index + 0.08}
                  />
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Social icons — below columns on mobile, right side on desktop */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.12 }}
            className="flex items-center justify-center gap-3 md:justify-end"
          >
            {socials.map(({ href, label, Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
              >
                <a
                  href={href}
                  aria-label={`${label} — Mostly Acoustic`}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-brand-teal hover:text-white"
                >
                  <Icon />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-16 text-center font-sans text-[13px] text-white/55 sm:mt-20 md:mt-24"
        >
          © {new Date().getFullYear()} Mostly Acoustic — All rights reserved.
        </motion.p>
      </div>

      {/* Oversized brand typography — ~75% visible, clear top, blurred bottom */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none relative z-0 mt-8 w-full select-none overflow-hidden sm:mt-10 md:mt-12"
        style={{
          fontSize: "clamp(2.6rem, 11.6vw, 11.5rem)",
          height: "0.75em",
        }}
      >
        <div className="absolute inset-x-0 top-0 text-center font-sans text-[1em] font-bold leading-none tracking-[-0.02em] text-white">
          {/* Blurred bottom layer — no glyph stretching */}
          <span
            className="absolute inset-x-0 top-0 block whitespace-nowrap"
            style={{
              filter: "blur(3px)",
              opacity: 0.9,
              maskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 35%, black 65%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 35%, black 65%, black 100%)",
            }}
          >
            Mostly Acoustic
          </span>

          {/* Sharp clear top layer */}
          <span
            className="absolute inset-x-0 top-0 block whitespace-nowrap"
            style={{
              textShadow: "0 2px 20px rgba(255,255,255,0.15)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 42%, rgba(0,0,0,0.5) 68%, transparent 92%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 42%, rgba(0,0,0,0.5) 68%, transparent 92%)",
            }}
          >
            Mostly Acoustic
          </span>
        </div>
      </motion.div>
    </footer>
  );
}
