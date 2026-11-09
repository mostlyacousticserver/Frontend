import type { BlogAuthor, BlogContentV1, EditorBlogBlock } from "@/types/blog";
import type { PublicContentFaq } from "@/types/content-faq";

export type FreeCourseListItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
};

export type FreeCourseDetail = FreeCourseListItem & {
  content: BlogContentV1;
  authorId?: string;
  faqs?: PublicContentFaq[];
};

export type PaginatedFreeCourses = {
  items: FreeCourseListItem[];
  total: number;
  page: number;
  limit: number;
};

export type ListFreeCoursesQuery = {
  page?: number;
  limit?: number;
  q?: string;
  isPublished?: boolean;
};

export type CreateFreeCourseFaqInput = {
  question: string;
  answer: string;
  position?: number;
  isActive?: boolean;
};

export type CreateFreeCourseRequest = {
  title: string;
  shortDescription: string;
  coverImageUrl: string;
  content: BlogContentV1;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  faqs?: CreateFreeCourseFaqInput[];
};

export type UpdateFreeCourseRequest = Partial<
  Omit<CreateFreeCourseRequest, "faqs">
>;

export type { EditorBlogBlock };
