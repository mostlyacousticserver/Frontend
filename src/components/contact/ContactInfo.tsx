"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  contactInfoItems,
  contactSocialLinks,
  type ContactInfoItem,
  type SocialLink,
} from "@/data/contact";

const icons = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
  clock: Clock3,
  globe: Globe,
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactInfo() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.06, ease }}
      className="space-y-3.5 sm:space-y-4 md:space-y-5"
    >
      {/* Contact details */}
      <div className="rounded-2xl border border-[#E9EEF3] bg-white p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:rounded-[20px] sm:p-5 md:p-6">
        <h2 className="font-serif text-[17px] font-bold tracking-tight text-[#111111] sm:text-[20px] md:text-[22px]">
          Mostly Acoustic
        </h2>
        <p className="mt-1.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:mt-2 sm:text-[13px] sm:leading-6">
          Reach out anytime — whether you&apos;re choosing your first course,
          need technical help, or want to explore a partnership.
        </p>

        <ul className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1 lg:gap-2.5">
          {contactInfoItems.map((item, index) => (
            <InfoCard key={item.id} item={item} index={index} />
          ))}
        </ul>
      </div>

      {/* Social */}
      <div className="rounded-2xl border border-[#E9EEF3] bg-white p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:rounded-[20px] sm:p-5 md:p-6">
        <h2 className="font-sans text-[14px] font-bold text-[#111111] sm:text-[15px] md:text-[16px]">
          Follow Us
        </h2>
        <p className="mt-1 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
          Practice tips, student stories, and new releases.
        </p>

        <div className="mt-3.5 grid grid-cols-5 gap-2 sm:mt-4 sm:flex sm:flex-wrap sm:gap-2.5">
          {contactSocialLinks.map((social) => (
            <SocialButton key={social.id} social={social} />
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

function InfoCard({
  item,
  index,
}: {
  item: ContactInfoItem;
  index: number;
}) {
  const Icon = icons[item.icon];

  const content = (
    <>
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${item.bg} ${item.color}`}
      >
        <Icon size={15} className="sm:h-[17px] sm:w-[17px]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] sm:text-[11px]">
          {item.label}
        </span>
        <span className="mt-0.5 block break-words font-sans text-[12px] font-medium leading-snug text-[#111111] sm:text-[13px] sm:leading-5">
          {item.value}
        </span>
      </span>
    </>
  );

  const className =
    "flex h-full min-w-0 items-start gap-2.5 rounded-xl border border-[#E9EEF3] bg-[#F8FAFB] p-2.5 transition-all hover:border-[#11C5BB]/35 hover:bg-white hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11C5BB] sm:gap-3 sm:rounded-2xl sm:p-3.5 active:scale-[0.99]";

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.05 + index * 0.04, ease }}
      className="min-w-0"
    >
      {item.href ? (
        <a
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          className={className}
        >
          {content}
        </a>
      ) : (
        <div className={className}>{content}</div>
      )}
    </motion.li>
  );
}

function SocialButton({ social }: { social: SocialLink }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="min-w-0"
    >
      <Link
        href={social.href}
        target="_blank"
        rel="noreferrer"
        aria-label={social.label}
        title={social.label}
        className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] transition-colors hover:border-[#11C5BB] hover:bg-[#EFFCF9] hover:text-[#0DA694] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11C5BB] sm:h-10 sm:w-10 sm:rounded-full"
      >
        <SocialIcon network={social.network} />
      </Link>
    </motion.div>
  );
}

function SocialIcon({ network }: { network: SocialLink["network"] }) {
  const className = "h-3.5 w-3.5 sm:h-4 sm:w-4";

  if (network === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" />
      </svg>
    );
  }
  if (network === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    );
  }
  if (network === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (network === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d="M6.5 9H3.5v12h3V9zM5 3.5A1.8 1.8 0 1 0 5 7.1 1.8 1.8 0 0 0 5 3.5zM20.5 13.3c0-2.7-1.5-4.4-4-4.4a3.6 3.6 0 0 0-3.2 1.7h-.1V9H10.4v12h3v-6.1c0-1.6.3-3.2 2.3-3.2s2 1.9 2 3.3V21h3v-7.7z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.3-6.3L6 22H3.2l7-8L2 2h6.3l3.9 5.8L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z" />
    </svg>
  );
}
