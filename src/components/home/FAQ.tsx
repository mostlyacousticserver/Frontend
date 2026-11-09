"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { faqs } from "@/data/faqs";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function FAQ() {
  const { formattedPrice, showcaseCtaUrl } = useSiteSettings();
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <section
      id="faq"
      className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 xl:gap-12">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-md text-start lg:mx-0 lg:text-left"
        >
          <h2 className="font-montserrat text-[26px] font-bold uppercase leading-[1.1] tracking-[0.01em] sm:text-[30px] md:text-[36px] lg:text-[40px]">
            <span className="block text-[#1a1a1a]">Read Our</span>
            <span className="block text-[#6B8CAE]">Faqs</span>
          </h2>

          <p className="mt-3 font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-4 sm:text-[14px] sm:leading-7 md:text-[15px]">
            We are here to help with any questions about our plans pricing or
            features
          </p>

          <motion.a
            href={showcaseCtaUrl}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 font-sans text-[13px] font-semibold text-white shadow-[0_8px_22px_rgba(45,212,191,0.32)] transition-colors hover:bg-brand-teal-hover sm:mt-6 sm:h-11 sm:w-auto sm:px-6 sm:text-[14px]"
          >
            Start Learning Today — Just {" "}{formattedPrice}
            <ArrowRight size={15} strokeWidth={2.25} />
          </motion.a>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="rounded-2xl bg-[#F7F8FA] p-3 sm:rounded-[22px] sm:p-4 md:p-5"
        >
          <div className="space-y-2 sm:space-y-2.5">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <motion.div
                  key={faq.question}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl bg-white shadow-[0_6px_18px_rgba(17,17,17,0.04)] sm:rounded-2xl"
                >
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 px-3.5 py-3 text-left sm:items-center sm:gap-4 sm:px-4 sm:py-3.5 md:px-5 md:py-4"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? -1 : index)}
                  >
                    <span className="font-sans text-[13px] font-bold leading-snug text-[#1a1a1a] sm:text-[14px] md:text-[15px]">
                      {faq.question}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:mt-0 sm:h-8 sm:w-8 ${
                        open
                          ? "bg-brand-teal text-white"
                          : "bg-[#F1F2F4] text-[#555555]"
                      }`}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <p className="px-3.5 pb-3.5 font-sans text-[12px] leading-6 text-[#6B7280] sm:px-4 sm:pb-4 sm:text-[13px] sm:leading-6 md:px-5 md:pb-4 md:text-[14px]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
