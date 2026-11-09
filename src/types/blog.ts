import type { PublicContentFaq } from "@/types/content-faq";

export type BlogContentMark = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
};

export type BlogTextNode = BlogContentMark & {
  text: string;
};

export type BlogLinkNode = {
  type: "link";
  href: string;
  children: BlogTextNode[];
};

export type BlogInlineNode = BlogTextNode | BlogLinkNode;

export type BlogHeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3;
  children: BlogInlineNode[];
};

export type BlogParagraphBlock = {
  type: "paragraph";
  children: BlogInlineNode[];
};

export type BlogImageBlock = {
  type: "image";
  url: string;
  alt?: string;
  caption?: string;
};

export type BlogListEntry = {
  children: BlogInlineNode[];
};

export type BlogListBlock = {
  type: "list";
  style: "unordered" | "ordered";
  items: BlogListEntry[];
};

export type BlogQuoteBlock = {
  type: "quote";
  children: BlogInlineNode[];
  cite?: string;
};

export type BlogCodeBlock = {
  type: "code";
  code: string;
  language?: string;
};

export type BlogDividerBlock = {
  type: "divider";
};

export type BlogBlock =
  | BlogHeadingBlock
  | BlogParagraphBlock
  | BlogImageBlock
  | BlogListBlock
  | BlogQuoteBlock
  | BlogCodeBlock
  | BlogDividerBlock;

export type BlogContentV1 = {
  version: 1;
  blocks: BlogBlock[];
};

export type EditorBlogBlock = BlogBlock & { id: string };

export type BlogAuthor = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
};

export type BlogDetail = BlogListItem & {
  content: BlogContentV1;
  authorId?: string;
  faqs?: PublicContentFaq[];
};

export type PaginatedBlogs = {
  items: BlogListItem[];
  total: number;
  page: number;
  limit: number;
};

export type ListBlogsQuery = {
  page?: number;
  limit?: number;
  q?: string;
  isPublished?: boolean;
};

export type CreateBlogFaqInput = {
  question: string;
  answer: string;
  position?: number;
  isActive?: boolean;
};

export type CreateBlogRequest = {
  title: string;
  coverImageUrl: string;
  content: BlogContentV1;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  faqs?: CreateBlogFaqInput[];
};

export type UpdateBlogRequest = Partial<Omit<CreateBlogRequest, "faqs">>;

export const BLOG_BLOCK_KINDS = [
  "paragraph",
  "heading",
  "image",
  "list",
  "quote",
  "code",
  "divider",
] as const;

export type BlogBlockKind = (typeof BLOG_BLOCK_KINDS)[number];
