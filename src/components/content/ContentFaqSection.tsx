"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PublicContentFaq } from "@/types/content-faq";

type ContentFaqSectionProps = {
  faqs: PublicContentFaq[];
  title?: string;
  className?: string;
};

export function ContentFaqSection({
  faqs,
  title = "Frequently Asked Questions",
  className,
}: ContentFaqSectionProps) {
  if (!faqs.length) return null;

  return (
    <section
      className={
        className ??
        "rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
      }
    >
      <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px] md:text-[22px]">
        {title}
      </h2>
      <Accordion type="multiple" className="mt-3 w-full sm:mt-4">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="py-3 text-left text-[13px] sm:py-4 sm:text-[14px]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap font-sans text-[13px] leading-6 text-[#6B7280] sm:text-[14px] sm:leading-7">
                {faq.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
