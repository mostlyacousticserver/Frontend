"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { EnquiriesAPI } from "@/api/enquiries";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";

const fieldClass =
  "min-h-11 w-full rounded-xl border bg-white px-3 font-sans text-base leading-normal text-[#111111] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#11C5BB] focus:ring-2 focus:ring-[#11C5BB]/20 sm:min-h-12 sm:px-3.5 sm:text-[14px]";

const labelClass =
  "mb-1.5 block font-sans text-[12px] font-medium text-[#374151] sm:text-[13px]";

const errorClass =
  "mt-1 font-sans text-[11px] leading-4 text-red-500 sm:text-[12px]";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");
    await EnquiriesAPI.create({
      name: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || undefined,
      subject: values.subject.trim(),
      message: values.message.trim(),
    });
    setStatus("success");
    reset();
  };

  return (
    <motion.section
      id="contact-form"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-24 rounded-2xl border border-[#E9EEF3] bg-white p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:scroll-mt-28 sm:rounded-[20px] sm:p-5 md:p-6 lg:p-7"
    >
      <div className="min-w-0">
        <h2 className="font-sans text-[17px] font-bold leading-tight text-[#111111] sm:text-[20px] md:text-[22px]">
          Send Us a Message
        </h2>
        <p className="mt-1.5 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px] sm:leading-6">
          Fill out the form and we&apos;ll reply within one business day.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4 md:mt-6"
        noValidate
      >
        <div className="min-w-0">
          <label htmlFor="fullName" className={labelClass}>
            Full Name
          </label>
          <input
            id="fullName"
            placeholder="Your full name"
            autoComplete="name"
            enterKeyHint="next"
            className={`${fieldClass} ${errors.fullName ? "border-red-400" : "border-[#E5E7EB]"}`}
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className={errorClass} role="alert">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        {/* Stack on mobile, 2 columns from sm */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          <div className="min-w-0">
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              autoComplete="email"
              enterKeyHint="next"
              className={`${fieldClass} ${errors.email ? "border-red-400" : "border-[#E5E7EB]"}`}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className={errorClass} role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <label htmlFor="phone" className={labelClass}>
              Phone{" "}
              <span className="font-normal text-[#9CA3AF]">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              autoComplete="tel"
              enterKeyHint="next"
              className={`${fieldClass} ${errors.phone ? "border-red-400" : "border-[#E5E7EB]"}`}
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
            {errors.phone ? (
              <p className={errorClass} role="alert">
                {errors.phone.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <input
            id="subject"
            placeholder="Course inquiry, support…"
            enterKeyHint="next"
            className={`${fieldClass} ${errors.subject ? "border-red-400" : "border-[#E5E7EB]"}`}
            aria-invalid={Boolean(errors.subject)}
            {...register("subject")}
          />
          {errors.subject ? (
            <p className={errorClass} role="alert">
              {errors.subject.message}
            </p>
          ) : null}
        </div>

        <div className="min-w-0">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Tell us how we can help…"
            className={`min-h-[120px] w-full resize-y rounded-xl border bg-white px-3 py-2.5 font-sans text-base leading-6 text-[#111111] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#11C5BB] focus:ring-2 focus:ring-[#11C5BB]/20 sm:min-h-[140px] sm:px-3.5 sm:py-3 sm:text-[14px] sm:leading-7 md:min-h-[160px] ${
              errors.message ? "border-red-400" : "border-[#E5E7EB]"
            }`}
            aria-invalid={Boolean(errors.message)}
            {...register("message")}
          />
          {errors.message ? (
            <p className={errorClass} role="alert">
              {errors.message.message}
            </p>
          ) : null}
        </div>

        {status === "success" ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 sm:gap-2.5 sm:px-4 sm:py-3"
          >
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600 sm:h-[18px] sm:w-[18px]"
              aria-hidden
            />
            <p className="min-w-0 font-sans text-[12px] leading-5 text-emerald-700 sm:text-[13px] sm:leading-6">
              Message sent successfully. We&apos;ll get back to you soon.
            </p>
          </div>
        ) : null}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { y: -1 } : undefined}
          whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#11C5BB] font-sans text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(17,197,187,0.32)] transition-colors hover:bg-[#0fb0a7] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:text-[14px] md:text-[15px]"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={16}
                className="animate-spin sm:h-[18px] sm:w-[18px]"
                aria-hidden
              />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} className="sm:h-4 sm:w-4" aria-hidden />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </motion.section>
  );
}
