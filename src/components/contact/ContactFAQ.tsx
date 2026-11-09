"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { contactFaqs } from "@/data/contact";

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactFAQ() {
  return (
    <section className="overflow-x-clip rounded-2xl bg-[#F7F8FA] px-3.5 py-7 sm:rounded-[20px] sm:px-6 sm:py-10 md:rounded-[24px] md:px-8 md:py-12 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease }}
        className="max-w-3xl text-left"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#11C5BB] sm:h-2 sm:w-2"
            aria-hidden
          />
          <p className="font-sans text-[11px] font-medium tracking-[0.04em] text-[#6B7280] sm:text-[12px]">
            Support Center
          </p>
        </div>

        <h2 className="mt-2.5 font-sans text-[20px] font-bold leading-[1.15] tracking-[-0.02em] text-[#111111] sm:mt-3 sm:text-[24px] md:text-[28px] lg:text-[32px]">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 max-w-xl font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-3 sm:text-[14px] sm:leading-7 md:text-[15px]">
          Quick answers about course access, payments, refunds, certificates,
          and support.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.06, ease }}
        className="mt-5 w-full max-w-3xl rounded-2xl border border-[#E9EEF3] bg-white p-2.5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:mt-7 sm:rounded-[20px] sm:p-4 md:mt-8 md:p-5 lg:p-6"
      >
        <Accordion type="single" collapsible className="w-full">
          {contactFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="px-1 sm:px-2">
              <AccordionTrigger className="items-start gap-3 py-3.5 text-left font-sans text-[13px] font-semibold leading-snug text-[#111111] hover:text-[#0DA694] sm:gap-4 sm:py-4 sm:text-[14px] md:text-[15px] md:leading-6 [&[data-state=open]]:text-[#0DA694]">
                <span className="min-w-0 flex-1 pr-1">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-3.5 sm:pb-4">
                <p className="pr-2 font-sans text-[13px] leading-6 text-[#6B7280] sm:pr-6 sm:text-[14px] sm:leading-7">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
