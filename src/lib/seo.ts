import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
} from "@/lib/site-config";

export {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
};

/** Google truncates around these lengths; staying under avoids ellipsised SERPs. */
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Private/transactional routes. `follow: false` too, because these pages link
 * into account-only areas we never want crawled.
 */
export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;

/**
 * Default directives for public pages. `max-image-preview: large` is what
 * unlocks large thumbnails in Google Discover and image-rich SERPs; the -1
 * values remove Google's default snippet/preview length caps.
 */
export const INDEX_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
  },
} as const;

type OpenGraphType = "website" | "article" | "profile";

type BuildPageMetadataInput = {
  title?: string;
  /** Overrides the social-card title when it should differ from the SERP title. */
  ogTitle?: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: OpenGraphType;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  section?: string;
  tags?: string[];
  keywords?: string[];
  noIndex?: boolean;
  /** Attach an RSS `<link rel="alternate">` (blog routes). */
  rssPath?: string;
};

export function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    "http://localhost:3000";

  return configured.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${getSiteUrl()}/`;
  return `${getSiteUrl()}${normalized}`;
}

/** Collapse whitespace and strip any HTML so descriptions never leak markup. */
export function toPlainText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate on a word boundary and append an ellipsis. */
export function truncate(value: string, max: number) {
  const text = toPlainText(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

export function seoTitle(value: string) {
  return truncate(value, MAX_TITLE_LENGTH);
}

/**
 * Google ignores descriptions shorter than roughly 50 characters and writes its
 * own snippet instead, so a very short one is topped up with the site
 * description — joined with real punctuation so the result reads as prose.
 */
export function seoDescription(value: string, fallback = DEFAULT_DESCRIPTION) {
  const text = toPlainText(value || "");
  if (!text) return truncate(fallback, MAX_DESCRIPTION_LENGTH);
  if (text.length >= 50) return truncate(text, MAX_DESCRIPTION_LENGTH);

  const joined = /[.!?…]$/.test(text) ? `${text} ${fallback}` : `${text}. ${fallback}`;
  return truncate(joined, MAX_DESCRIPTION_LENGTH);
}

/**
 * Presigned S3/CloudFront URLs carry a short expiry (`X-Amz-Expires`), so they
 * are useless as an `og:image` or a schema.org `image`: by the time a social
 * scraper or Googlebot fetches them they return 403. Anything expiring is
 * rejected here so callers fall back to a durable image instead.
 */
export function stableImageUrl(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value) return null;
  if (/[?&](X-Amz-Signature|X-Amz-Expires|Signature|Expires|token)=/i.test(value)) {
    return null;
  }
  return value;
}

export function buildPageMetadata({
  title,
  ogTitle: ogTitleOverride,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  keywords,
  noIndex = false,
  rssPath,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const resolvedDescription = seoDescription(description);
  const ogImage = image?.trim() || DEFAULT_OG_IMAGE;
  const pageTitle = title ? seoTitle(title) : undefined;
  const ogTitle =
    ogTitleOverride ?? (pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME);
  const alt = imageAlt ?? `${pageTitle ?? SITE_NAME} — ${SITE_NAME}`;

  return {
    ...(pageTitle ? { title: pageTitle } : {}),
    description: resolvedDescription,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      // `alternates` replaces the parent's object wholesale during metadata
      // merging, so the feed link has to be re-declared on every page.
      types: { "application/rss+xml": absoluteUrl(rssPath ?? "/feed.xml") },
    },
    // Public pages inherit INDEX_ROBOTS from the root layout; only override to
    // opt a route out of the index.
    ...(noIndex ? { robots: NOINDEX_ROBOTS } : {}),
    openGraph: {
      title: ogTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: type === "profile" ? "profile" : type,
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt,
        },
      ],
      ...(type === "article"
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(authors?.length ? { authors } : {}),
            ...(section ? { section } : {}),
            ...(tags?.length ? { tags } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: ogTitle,
      description: resolvedDescription,
      images: [{ url: ogImage, alt }],
    },
  };
}
