import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  categoryId: z.string().uuid("Select a category"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((value) => Number(value) >= 0 && !Number.isNaN(Number(value)), {
      message: "Price cannot be negative",
    }),
  discountPrice: z.string().optional(),
  currency: z.string().min(1).max(3),
  level: z.string().optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isComingSoon: z.boolean(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const titleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
});

export type TitleFormValues = z.infer<typeof titleSchema>;

export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  contentType: z.enum(["video", "file", "text"]),
  videoStorageKey: z.string().optional(),
  videoDurationSeconds: z.string().optional(),
  fileStorageKey: z.string().optional(),
  fileType: z.string().max(20).optional(),
  textContent: z.string().max(100000).optional(),
  isPreview: z.boolean().optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  fileStorageKey: z.string().min(1, "File storage key is required"),
  fileType: z.string().min(1, "File type is required").max(20),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
