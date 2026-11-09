import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "class"];

export const ARTICLE_PROSE_CLASS =
  "font-sans text-[15px] leading-7 text-[#2b2b2b] [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:leading-snug [&_h3]:mt-5 [&_h3]:text-[17px] [&_h3]:font-semibold [&_p]:mt-3 first:[&_p]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_a]:text-[#0d9488] [&_a]:underline [&_blockquote]:mt-3 [&_blockquote]:border-l-2 [&_blockquote]:border-[#11C5BB] [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold [&_b]:font-semibold [&_u]:underline [&_em]:italic";

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function htmlToPlainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmptyHtml(html: string) {
  return htmlToPlainText(html).length === 0;
}

export function sanitizeLessonHtml(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
  return isEmptyHtml(clean) ? "" : clean;
}
