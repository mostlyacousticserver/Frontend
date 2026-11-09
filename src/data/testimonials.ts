export type CheckoutTestimonial = {
  quote: string;
  name: string;
  avatar: string;
};

export const checkoutTestimonials: Record<string, CheckoutTestimonial> = {
  default: {
    quote:
      "This course changed my life! I went from zero to playing my favorite songs in weeks.",
    name: "Sarah J.",
    avatar: "/images/testimonial-2.jpg",
  },
};

export function getCheckoutTestimonial(
  key = "default",
): CheckoutTestimonial {
  return checkoutTestimonials[key] ?? checkoutTestimonials.default;
}
