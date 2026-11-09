import type {
  RazorpayCheckoutOptions,
  RazorpayInstance,
} from "@/types/payments";

const SCRIPT_ID = "razorpay-checkout-js";
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export async function loadRazorpay(): Promise<
  new (options: RazorpayCheckoutOptions) => RazorpayInstance
> {
  if (typeof window === "undefined") {
    throw new Error("Razorpay can only be loaded in the browser");
  }
  if (window.Razorpay) return window.Razorpay;

  await new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.Razorpay) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Razorpay")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Could not load Razorpay. Check your network and try again."));
    document.body.appendChild(script);
  });

  if (!window.Razorpay) {
    throw new Error("Razorpay did not initialize");
  }
  return window.Razorpay;
}

export function razorpayImageUrl(src: string | null | undefined) {
  const value = src?.trim() ?? "";
  return /^https:\/\//i.test(value) ? value : undefined;
}
