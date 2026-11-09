import { faqs } from "@/data/faqs";
import { absoluteUrl, getSiteUrl, toPlainText, truncate } from "@/lib/seo";
import {
  ADDRESS,
  CONTACT,
  FOUNDING_YEAR,
  INSTRUCTOR,
  SITE_LANG,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_PROFILES,
} from "@/lib/site-config";

export type JsonLdNode = Record<string, unknown>;

/**
 * Stable @id anchors. Every page emits one connected `@graph` and refers back
 * to these, so search engines resolve a single organization entity across the
 * whole site instead of one per page.
 */
export const ORGANIZATION_ID = () => `${getSiteUrl()}/#organization`;
export const WEBSITE_ID = () => `${getSiteUrl()}/#website`;
export const INSTRUCTOR_ID = () => `${getSiteUrl()}/#instructor`;
const LOGO_ID = () => `${getSiteUrl()}/#logo`;

function graph(nodes: (JsonLdNode | null | undefined)[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean) as JsonLdNode[],
  };
}

/* -------------------------------------------------------------------------- */
/* Core entities                                                              */
/* -------------------------------------------------------------------------- */

export function organizationJsonLd(): JsonLdNode {
  const site = getSiteUrl();

  return {
    "@type": ["Organization", "EducationalOrganization"],
    "@id": ORGANIZATION_ID(),
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: `${site}/`,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID(),
      url: absoluteUrl("/images/pr1.jpeg"),
      contentUrl: absoluteUrl("/images/pr1.jpeg"),
      caption: SITE_NAME,
    },
    image: { "@id": LOGO_ID() },
    description: toPlainText(
      `${SITE_NAME} teaches acoustic guitar online through structured video courses, free chord sheets, and guided practice routines.`,
    ),
    foundingDate: String(FOUNDING_YEAR),
    founder: { "@id": INSTRUCTOR_ID() },
    email: CONTACT.email,
    telephone: CONTACT.phoneE164,
    sameAs: [...SOCIAL_PROFILES],
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.streetAddress,
      addressLocality: ADDRESS.addressLocality,
      addressRegion: ADDRESS.addressRegion,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT.email,
        telephone: CONTACT.phoneE164,
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
    ],
  };
}

export function websiteJsonLd(): JsonLdNode {
  const site = getSiteUrl();

  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID(),
    name: SITE_NAME,
    url: `${site}/`,
    description: SITE_TAGLINE,
    inLanguage: SITE_LANG,
    publisher: { "@id": ORGANIZATION_ID() },
  };
}

export function instructorJsonLd(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": INSTRUCTOR_ID(),
    name: INSTRUCTOR.name,
    jobTitle: INSTRUCTOR.jobTitle,
    description: INSTRUCTOR.description,
    image: absoluteUrl(INSTRUCTOR.image),
    url: absoluteUrl("/about"),
    worksFor: { "@id": ORGANIZATION_ID() },
    knowsAbout: [
      "Acoustic guitar",
      "Fingerstyle guitar",
      "Music theory",
      "Songwriting",
      "Guitar pedagogy",
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Page-level helpers                                                         */
/* -------------------------------------------------------------------------- */

export type Breadcrumb = { name: string; path: string };

export function breadcrumbJsonLd(items: Breadcrumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(items[items.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type WebPageInput = {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";
  image?: string | null;
  breadcrumbs?: Breadcrumb[];
  datePublished?: string | null;
  dateModified?: string | null;
};

export function webPageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  image,
  breadcrumbs,
  datePublished,
  dateModified,
}: WebPageInput): JsonLdNode {
  const url = absoluteUrl(path);

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description: truncate(description, 300),
    isPartOf: { "@id": WEBSITE_ID() },
    about: { "@id": ORGANIZATION_ID() },
    inLanguage: SITE_LANG,
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image) } } : {}),
    ...(breadcrumbs?.length
      ? { breadcrumb: { "@id": `${absoluteUrl(breadcrumbs[breadcrumbs.length - 1].path)}#breadcrumb` } }
      : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

export function faqPageJsonLd(
  entries: { question: string; answer: string }[] = faqs,
): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(faq.answer),
      },
    })),
  };
}

/**
 * ItemList for listing pages. Rich results treat this as a carousel candidate
 * and, more importantly, it makes the page's outbound links machine-readable.
 */
export function itemListJsonLd(input: {
  path: string;
  name: string;
  items: { name: string; path: string; image?: string | null }[];
}): JsonLdNode {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(input.path)}#itemlist`,
    name: input.name,
    numberOfItems: input.items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
      ...(item.image ? { image: absoluteUrl(item.image) } : {}),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* Page graphs                                                                */
/* -------------------------------------------------------------------------- */

export function baseGraph(nodes: (JsonLdNode | null | undefined)[] = []) {
  return graph([organizationJsonLd(), websiteJsonLd(), instructorJsonLd(), ...nodes]);
}

export function homeJsonLd(description: string): JsonLdNode {
  return baseGraph([
    webPageJsonLd({
      path: "/",
      name: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description,
    }),
    faqPageJsonLd(),
  ]);
}

export function aboutJsonLd(description: string): JsonLdNode {
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return baseGraph([
    breadcrumbJsonLd(breadcrumbs),
    webPageJsonLd({
      path: "/about",
      name: `About ${SITE_NAME}`,
      description,
      type: "AboutPage",
      image: INSTRUCTOR.image,
      breadcrumbs,
    }),
  ]);
}

export function contactJsonLd(
  description: string,
  contactFaqs: { question: string; answer: string }[],
): JsonLdNode {
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];

  return baseGraph([
    breadcrumbJsonLd(breadcrumbs),
    webPageJsonLd({
      path: "/contact",
      name: `Contact ${SITE_NAME}`,
      description,
      type: "ContactPage",
      breadcrumbs,
    }),
    faqPageJsonLd(contactFaqs),
    {
      "@type": "LocalBusiness",
      "@id": `${getSiteUrl()}/#studio`,
      name: `${SITE_NAME} Studio`,
      parentOrganization: { "@id": ORGANIZATION_ID() },
      url: absoluteUrl("/contact"),
      email: CONTACT.email,
      telephone: CONTACT.phoneE164,
      openingHours: CONTACT.hours,
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.streetAddress,
        addressLocality: ADDRESS.addressLocality,
        addressRegion: ADDRESS.addressRegion,
        postalCode: ADDRESS.postalCode,
        addressCountry: ADDRESS.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: ADDRESS.latitude,
        longitude: ADDRESS.longitude,
      },
    },
  ]);
}

export function collectionPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
  breadcrumbLabel: string;
  items: { name: string; path: string; image?: string | null }[];
}): JsonLdNode {
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: input.breadcrumbLabel, path: input.path },
  ];

  return baseGraph([
    breadcrumbJsonLd(breadcrumbs),
    webPageJsonLd({
      path: input.path,
      name: input.name,
      description: input.description,
      type: "CollectionPage",
      breadcrumbs,
    }),
    ...(input.items.length
      ? [itemListJsonLd({ path: input.path, name: input.name, items: input.items })]
      : []),
  ]);
}

/* -------------------------------------------------------------------------- */
/* Detail-page entities                                                       */
/* -------------------------------------------------------------------------- */

export function courseJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image: string;
  price: number;
  currency: string;
  level?: string | null;
  durationMinutes?: number | null;
  lessonCount?: number | null;
  enrollmentCount?: number | null;
  instructorName?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  ratingValue?: number;
  reviewCount?: number;
  reviews?: { author: string; rating: number; body?: string | null }[];
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: input.name, path: input.path },
  ];

  const course: JsonLdNode = {
    "@type": "Course",
    "@id": `${url}#course`,
    name: input.name,
    description: truncate(input.description, 500),
    url,
    image: absoluteUrl(input.image),
    inLanguage: SITE_LANG,
    isAccessibleForFree: input.price === 0,
    provider: { "@id": ORGANIZATION_ID() },
    publisher: { "@id": ORGANIZATION_ID() },
    educationalLevel: input.level ?? undefined,
    teaches: "Acoustic guitar performance, chords, strumming, and rhythm",
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    // Google's Course rich result requires at least one CourseInstance with a
    // mode and repeat frequency for on-demand content.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload:
        input.durationMinutes && input.durationMinutes > 0
          ? `PT${Math.round(input.durationMinutes)}M`
          : undefined,
      instructor: input.instructorName
        ? { "@type": "Person", name: input.instructorName }
        : { "@id": INSTRUCTOR_ID() },
    },
    offers: {
      "@type": "Offer",
      "@id": `${url}#offer`,
      url,
      price: input.price.toFixed(2),
      priceCurrency: input.currency || "INR",
      availability: "https://schema.org/InStock",
      category: "Paid",
    },
    ...(input.lessonCount && input.lessonCount > 0
      ? {
          hasPart: {
            "@type": "Syllabus",
            name: `${input.name} syllabus`,
            description: `${input.lessonCount} video lessons.`,
          },
        }
      : {}),
  };

  if (input.enrollmentCount && input.enrollmentCount > 0) {
    course.totalHistoricalEnrollment = input.enrollmentCount;
  }

  if (input.reviewCount && input.ratingValue) {
    course.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.ratingValue.toFixed(1),
      reviewCount: input.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (input.reviews?.length) {
    course.review = input.reviews.slice(0, 10).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(review.body ? { reviewBody: toPlainText(review.body) } : {}),
    }));
  }

  return baseGraph([
    breadcrumbJsonLd(breadcrumbs),
    webPageJsonLd({
      path: input.path,
      name: input.name,
      description: input.description,
      image: input.image,
      breadcrumbs,
    }),
    course,
  ]);
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  wordCount?: number | null;
  section?: string | null;
  tags?: string[];
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: input.headline, path: input.path },
  ];

  return baseGraph([
    breadcrumbJsonLd(breadcrumbs),
    webPageJsonLd({
      path: input.path,
      name: input.headline,
      description: input.description,
      image: input.image,
      breadcrumbs,
      datePublished: input.datePublished,
      dateModified: input.dateModified ?? input.datePublished,
    }),
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      // Google caps displayed headlines at 110 characters.
      headline: truncate(input.headline, 110),
      description: truncate(input.description, 300),
      image: input.image ? [absoluteUrl(input.image)] : undefined,
      url,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      isPartOf: { "@id": WEBSITE_ID() },
      inLanguage: SITE_LANG,
      datePublished: input.datePublished ?? undefined,
      dateModified: input.dateModified ?? input.datePublished ?? undefined,
      author: input.authorName
        ? { "@type": "Person", name: input.authorName }
        : { "@id": INSTRUCTOR_ID() },
      publisher: { "@id": ORGANIZATION_ID() },
      ...(input.wordCount ? { wordCount: input.wordCount } : {}),
      ...(input.section ? { articleSection: input.section } : {}),
      ...(input.tags?.length ? { keywords: input.tags.join(", ") } : {}),
    },
  ]);
}

export function songJsonLd(input: {
  title: string;
  artist: string;
  description: string;
  path: string;
  image?: string | null;
  musicalKey?: string | null;
  genre?: string | null;
  tags?: string[];
  datePublished?: string | null;
  dateModified?: string | null;
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "Songs", path: "/songs" },
    { name: `${input.title} — ${input.artist}`, path: input.path },
  ];

  return baseGraph([
    breadcrumbJsonLd(breadcrumbs),
    webPageJsonLd({
      path: input.path,
      name: `${input.title} — ${input.artist} guitar chords`,
      description: input.description,
      image: input.image,
      breadcrumbs,
      datePublished: input.datePublished,
      dateModified: input.dateModified,
    }),
    {
      // MusicComposition is the precise type for a chord/lyric sheet; the
      // generic CreativeWork loses the composer/key/genre signals.
      "@type": "MusicComposition",
      "@id": `${url}#composition`,
      name: input.title,
      url,
      description: truncate(input.description, 300),
      composer: { "@type": "Person", name: input.artist },
      musicArrangement: {
        "@type": "MusicComposition",
        name: `${input.title} — acoustic guitar arrangement`,
      },
      ...(input.musicalKey ? { musicalKey: input.musicalKey } : {}),
      ...(input.genre ? { genre: input.genre } : {}),
      ...(input.image ? { image: absoluteUrl(input.image) } : {}),
      ...(input.tags?.length ? { keywords: input.tags.join(", ") } : {}),
      publisher: { "@id": ORGANIZATION_ID() },
      inLanguage: SITE_LANG,
    },
  ]);
}
