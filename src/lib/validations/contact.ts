import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.replace(/\D/g, "").length >= 10,
      "Enter a valid phone number",
    ),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(20, "Please write at least 20 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
