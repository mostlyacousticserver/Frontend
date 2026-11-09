"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { officeLocation } from "@/data/contact";

const ease = [0.22, 1, 0.36, 1] as const;

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  officeLocation.address,
)}`;

export function ContactMap() {
  return (
    <section className="mt-10 overflow-x-clip sm:mt-12 md:mt-14 lg:mt-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease }}
        className="mb-4 sm:mb-5 md:mb-6"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#11C5BB] sm:h-2 sm:w-2"
            aria-hidden
          />
          <p className="font-sans text-[11px] font-medium tracking-[0.04em] text-[#6B7280] sm:text-[12px]">
            Studio Location
          </p>
        </div>

        <h2 className="mt-2.5 font-sans text-[20px] font-bold leading-[1.15] tracking-[-0.02em] text-[#111111] sm:mt-3 sm:text-[24px] md:text-[28px]">
          {officeLocation.title}
        </h2>

        <p className="mt-2 max-w-2xl font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-2.5 sm:text-[14px] sm:leading-7 md:text-[15px]">
          {officeLocation.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.06, ease }}
        className="overflow-hidden rounded-2xl border border-[#E9EEF3] bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)] sm:rounded-[18px] md:rounded-[20px]"
      >
        {/* Address bar */}
        <div className="flex flex-col gap-3 border-b border-[#E9EEF3] bg-[#F8FAFB] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 md:px-5 md:py-4">
          <div className="flex min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E6F8F5] text-[#0DA694] sm:h-10 sm:w-10">
              <MapPin size={16} className="sm:h-[18px] sm:w-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] sm:text-[11px]">
                Address
              </p>
              <p className="mt-0.5 break-words font-sans text-[12px] font-medium leading-snug text-[#111111] sm:text-[13px] sm:leading-5">
                {officeLocation.address}
              </p>
            </div>
          </div>

          <motion.a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#11C5BB] px-4 font-sans text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(17,197,187,0.28)] transition-colors hover:bg-[#0fb0a7] sm:h-11 sm:w-auto sm:px-5"
          >
            <Navigation size={14} aria-hidden />
            Get Directions
            <ExternalLink size={13} className="opacity-80" aria-hidden />
          </motion.a>
        </div>

        {/* Map */}
        <div className="relative aspect-[4/3] w-full bg-[#F3F4F6] sm:aspect-[16/10] md:aspect-[21/9] lg:aspect-[2.4/1]">
          <iframe
            title="Mostly Acoustic studio location"
            src={officeLocation.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
      </motion.div>
    </section>
  );
}
