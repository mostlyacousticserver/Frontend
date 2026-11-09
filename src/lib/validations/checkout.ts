import { z } from "zod";

export const checkoutSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z
      .string()
      .min(10, "Enter a valid phone number")
      .max(15, "Enter a valid phone number"),
    paymentMethod: z.enum(["card", "paypal"]),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(3, "ZIP / PIN is required"),
  })
  .superRefine((values, ctx) => {
    if (values.paymentMethod === "card") {
      const digits = (values.cardNumber ?? "").replace(/\s/g, "");
      if (digits.length < 15) {
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Enter a valid card number",
        });
      }
      if (!/^\d{2}\/\d{2}$/.test(values.expiry ?? "")) {
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "Use MM/YY format",
        });
      }
      if (!/^\d{3,4}$/.test(values.cvc ?? "")) {
        ctx.addIssue({
          code: "custom",
          path: ["cvc"],
          message: "Enter a valid CVC",
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
