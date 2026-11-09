import { publicMediaUrl } from "@/lib/song-utils";
import { INSTRUCTOR } from "@/lib/site-config";
import type {
  BlogBlock,
  BlogBlockKind,
  BlogContentV1,
  BlogInlineNode,
  BlogLinkNode,
  EditorBlogBlock,
} from "@/types/blog";

export const BLOG_COVER_FALLBACK = "/images/featured-course.jpg";
export const BLOG_AVATAR_FALLBACK = "/images/pr1.jpeg";

export function createStarterBlogContent(): BlogContentV1 {
  return {
    version: 1,
    blocks: [{ type: "paragraph", children: [{ text: "" }] }],
  };
}

export function newBlockId() {
  return crypto.randomUUID();
}

function textChildren(text = ""): BlogInlineNode[] {
  return [{ text }];
}

export function createParagraphBlock(): EditorBlogBlock {
  return { id: newBlockId(), type: "paragraph", children: textChildren() };
}

export function createHeadingBlock(level: 1 | 2 | 3 = 2): EditorBlogBlock {
  return { id: newBlockId(), type: "heading", level, children: textChildren() };
}

export function createImageBlock(): EditorBlogBlock {
  return { id: newBlockId(), type: "image", url: "", alt: "", caption: "" };
}

export function createListBlock(
  style: "unordered" | "ordered" = "unordered",
): EditorBlogBlock {
  return {
    id: newBlockId(),
    type: "list",
    style,
    items: [{ children: textChildren() }],
  };
}

export function createQuoteBlock(): EditorBlogBlock {
  return { id: newBlockId(), type: "quote", children: textChildren(), cite: "" };
}

export function createCodeBlock(): EditorBlogBlock {
  return { id: newBlockId(), type: "code", code: "", language: "" };
}

export function createDividerBlock(): EditorBlogBlock {
  return { id: newBlockId(), type: "divider" };
}

export function createEditorBlock(kind: BlogBlockKind): EditorBlogBlock {
  switch (kind) {
    case "heading":
      return createHeadingBlock();
    case "image":
      return createImageBlock();
    case "list":
      return createListBlock();
    case "quote":
      return createQuoteBlock();
    case "code":
      return createCodeBlock();
    case "divider":
      return createDividerBlock();
    default:
      return createParagraphBlock();
  }
}

export function normalizeBlogContent(input: unknown): BlogContentV1 {
  if (
    input &&
    typeof input === "object" &&
    "version" in input &&
    (input as BlogContentV1).version === 1 &&
    Array.isArray((input as BlogContentV1).blocks)
  ) {
    return input as BlogContentV1;
  }
  return createStarterBlogContent();
}

export function withBlockIds(content: BlogContentV1): EditorBlogBlock[] {
  return content.blocks.map((block) => ({
    ...block,
    id: newBlockId(),
  }));
}

export function toApiContent(blocks: EditorBlogBlock[]): BlogContentV1 {
  return {
    version: 1,
    blocks: blocks.map(toApiBlock).filter(isSavableBlock),
  };
}

function toApiBlock(block: EditorBlogBlock): BlogBlock {
  const { id: _id, ...rest } = block;
  void _id;
  return rest as BlogBlock;
}

function isSavableBlock(block: BlogBlock): boolean {
  if (block.type === "image") return Boolean(block.url.trim());
  return true;
}

export function isLinkNode(node: BlogInlineNode): node is BlogLinkNode {
  return "type" in node && node.type === "link";
}

export function flattenInline(nodes: BlogInlineNode[]): string {
  return nodes
    .map((node) => {
      if (isLinkNode(node)) {
        return flattenInline(node.children);
      }
      return node.text;
    })
    .join("");
}

export function setInlineText<T extends { children: BlogInlineNode[] }>(
  block: T,
  text: string,
): T {
  if (flattenInline(block.children) === text) return block;
  return { ...block, children: textChildren(text) };
}

export function countContentWords(content: BlogContentV1): number {
  const text = content.blocks
    .map((block) => {
      if (block.type === "heading" || block.type === "paragraph" || block.type === "quote") {
        return flattenInline(block.children);
      }
      if (block.type === "list") {
        return block.items.map((item) => flattenInline(item.children)).join(" ");
      }
      if (block.type === "code") return block.code;
      if (block.type === "image") return `${block.alt ?? ""} ${block.caption ?? ""}`;
      return "";
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(content: BlogContentV1): string {
  const minutes = Math.max(1, Math.round(countContentWords(content) / 200));
  return `${minutes} min read`;
}

export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function blogMediaSrc(
  stored: string | null | undefined,
  fallback = BLOG_COVER_FALLBACK,
): string {
  const url = publicMediaUrl(stored);
  if (!url) return fallback;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return fallback;
}

export function blogAvatarSrc(stored: string | null | undefined): string {
  return blogMediaSrc(stored, BLOG_AVATAR_FALLBACK);
}

export function incompleteImageCount(blocks: EditorBlogBlock[]): number {
  return blocks.filter((block) => block.type === "image" && !block.url.trim())
    .length;
}

/**
 * Content is authored from the shared admin account, so the stored author name
 * is a generic login label rather than a person. Fall back to the instructor
 * behind the site; a real author name, once set, is used as-is.
 */
export function resolveAuthorName(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed || trimmed.toLowerCase() === "admin") return INSTRUCTOR.name;
  return trimmed;
}
