"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { PaymentsAPI } from "@/api/payments";
import { acceptedPayments } from "@/data/payment";
import type { CourseDetail } from "@/data/course";
import { getApiErrorMessage } from "@/lib/axios";
import { loadRazorpay, razorpayImageUrl } from "@/lib/razorpay";
import type { CheckoutResponse } from "@/types/payments";

type PaymentCardProps = {
  course: CourseDetail;
};

export function PaymentCard({ course }: PaymentCardProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState(
    "Opening secure payment…",
  );
  const [notice, setNotice] = useState<{
    tone: "error" | "info";
    message: string;
  } | null>(null);

  const { currency, price: subtotal, originalPrice, discountPercent } = course.pricing;
  const catalogDiscount =
    originalPrice > subtotal ? originalPrice - subtotal : 0;

  function goToSuccess(
    orderId: string,
    orderNumber: string,
    amount: number,
    email: string,
  ) {
    const params = new URLSearchParams({
      orderId,
      orderNumber,
      amount: String(amount),
      email,
    });
    router.push(`/checkout/${course.slug}/success?${params.toString()}`);
  }

  async function openRazorpay(data: CheckoutResponse) {
    if (!data.keyId || !data.razorpayOrderId) {
      throw new Error("Payments are not configured");
    }

    const Razorpay = await loadRazorpay();
    const rzp = new Razorpay({
      key: data.keyId,
      order_id: data.razorpayOrderId,
      amount: data.amountInPaise,
      currency: data.currency || "INR",
      name: "Mostly Acoustic",
      description: data.course.title,
      image: razorpayImageUrl(data.course.thumbnailUrl ?? course.image),
      prefill: data.prefill,
      theme: { color: "#11C5BB" },
      handler: async (response) => {
        setProcessing(true);
        setProcessingLabel("Confirming your payment…");
        try {
          const verified = await PaymentsAPI.verify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          goToSuccess(
            verified.data.orderId,
            verified.data.orderNumber,
            data.amount,
            data.prefill.email,
          );
        } catch (error) {
          setProcessing(false);
          const message = getApiErrorMessage(error);
          setNotice({ tone: "error", message });
          toast.error(message);
        }
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
          setNotice({
            tone: "info",
            message: "Payment was cancelled. You can try again when you are ready.",
          });
        },
      },
    });
    setProcessing(false);
    rzp.open();
  }

  async function onPay() {
    setNotice(null);
    setProcessing(true);
    setProcessingLabel("Opening secure payment…");

    try {
      const { data } = await PaymentsAPI.checkout({
        courseId: course.id,
      });

      await openRazorpay(data);
    } catch (error) {
      setProcessing(false);

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.success("You already have access to this course.");
        router.replace(`/learn/${course.slug}`);
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 503) {
        const message = "Payments are not configured. Please try again later.";
        setNotice({ tone: "error", message });
        toast.error(message);
        return;
      }

      const message = getApiErrorMessage(error);
      setNotice({ tone: "error", message });
      toast.error(message);
    }
  }

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="w-full rounded-[16px] border border-[#E9EEF3] bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:rounded-[20px] sm:p-5 md:p-6 lg:sticky lg:top-24"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px]">
              Payment Details
            </h2>
            <p className="mt-1 font-sans text-[12px] leading-5 text-[#6B7280] sm:text-[13px]">
              Pay securely with Razorpay — UPI, cards, net banking, and wallets.
            </p>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="font-sans text-[11px] text-[#9CA3AF]">Due today</p>
            <p className="font-sans text-[18px] font-bold text-[#111111]">
              {currency}
              {subtotal.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {notice ? (
          <p
            role="status"
            className={`mt-4 rounded-xl px-3 py-2.5 font-sans text-[12px] leading-5 sm:text-[13px] ${
              notice.tone === "error"
                ? "bg-red-50 text-red-600"
                : "bg-[#EFFCF9] text-[#0DA694]"
            }`}
          >
            {notice.message}
          </p>
        ) : null}

        <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
          <div className="space-y-2 border-t border-[#E5E7EB] pt-3.5 sm:space-y-2.5 sm:pt-4">
            <div className="flex items-center justify-between font-sans text-[13px] text-[#6B7280] sm:text-[14px]">
              <span>Subtotal</span>
              <span>
                {currency}
                {(catalogDiscount > 0 ? originalPrice : subtotal).toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
            {catalogDiscount > 0 ? (
              <div className="flex items-center justify-between font-sans text-[13px] font-medium text-emerald-600 sm:text-[14px]">
                <span className="truncate pr-2">
                  Course offer
                  {discountPercent > 0 ? ` (${discountPercent}% off)` : ""}
                </span>
                <span className="shrink-0">
                  -{currency}
                  {catalogDiscount.toLocaleString("en-IN")}
                </span>
              </div>
            ) : null}
            <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2.5 sm:pt-3">
              <span className="font-sans text-[14px] font-bold text-[#111111] sm:text-[15px]">
                Total due today
              </span>
              <span className="font-sans text-[18px] font-bold text-[#111111] sm:text-[20px]">
                {currency}
                {subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <motion.button
            type="button"
            disabled={processing}
            onClick={() => void onPay()}
            whileHover={!processing ? { y: -1, scale: 1.01 } : undefined}
            whileTap={!processing ? { scale: 0.98 } : undefined}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#11C5BB] font-sans text-[14px] font-semibold text-white shadow-[0_10px_28px_rgba(17,197,187,0.35)] transition-colors hover:bg-[#0fb0a7] disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-[15px]"
          >
            {processing ? "Opening Razorpay…" : "Pay securely"}
          </motion.button>

          <div className="space-y-2.5 sm:space-y-3">
            <p className="inline-flex w-full items-center justify-center gap-1.5 text-center font-sans text-[11px] leading-4 text-[#6B7280] sm:text-[12px]">
              <Lock
                size={12}
                className="shrink-0 sm:h-[13px] sm:w-[13px]"
                aria-hidden
              />
              Secured by Razorpay. Instant access after payment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {acceptedPayments.map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-wide text-[#6B7280] opacity-80 sm:px-2 sm:py-1 sm:text-[10px]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {processing ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm sm:px-5"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="processing-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
            <Loader2
              className="mx-auto h-9 w-9 animate-spin text-[#11C5BB] sm:h-10 sm:w-10"
              aria-hidden
            />
            <h2
              id="processing-title"
              className="mt-4 font-sans text-[16px] font-bold text-[#111111] sm:text-[18px]"
            >
              {processingLabel}
            </h2>
            <p className="mt-2 font-sans text-[13px] text-[#6B7280] sm:text-[14px]">
              Complete the payment in the Razorpay window. Don&apos;t close this tab.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
