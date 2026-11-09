/**
 * Single source of truth for everything SEO needs to know about the brand.
 * Structured data, metadata, the manifest, and OG images all read from here so
 * the same name/handle/address is never spelled two different ways.
 */

export const SITE_NAME = "Mostly Acoustic";
export const SITE_SHORT_NAME = "Mostly Acoustic";
export const SITE_TAGLINE = "Online Acoustic Guitar Courses & Chord Sheets";

/** Kept under 160 characters so search engines show it in full. */
export const DEFAULT_DESCRIPTION =
  "Learn acoustic guitar online — structured beginner-to-pro video courses, free chord sheets with lyrics, and practice routines that build real progress.";

export const DEFAULT_OG_IMAGE = "/images/pr1.jpeg";

/** Locale used for og:locale and Intl formatting. */
export const SITE_LOCALE = "en_IN";
export const SITE_LANG = "en";

/** Brand colours reused by the manifest, viewport theme-color, and OG images. */
export const BRAND_COLOR = "#11C5BB";
export const BRAND_BACKGROUND = "#111111";

export const TWITTER_HANDLE = "@mostlyacoustic";

export const FOUNDING_YEAR = 2019;

/**
 * Public profiles for schema.org `sameAs`. Entity resolution in search engines
 * leans heavily on these, so keep them accurate — a dead link is worse than
 * an omitted one.
 */
export const SOCIAL_PROFILES = [
  "https://www.instagram.com/mostlyacoustic",
  "https://www.youtube.com/@mostlyacoustic",
  "https://www.facebook.com/mostlyacoustic",
  "https://x.com/mostlyacoustic",
  "https://www.linkedin.com/company/mostlyacoustic",
] as const;

export const CONTACT = {
  email: "hello@mostlyacoustic.com",
  phone: "+91 98765 43210",
  phoneE164: "+919876543210",
  hours: "Mo-Sa 10:00-19:00",
} as const;

export const ADDRESS = {
  streetAddress: "12 Melody Lane, Indiranagar",
  addressLocality: "Bengaluru",
  addressRegion: "Karnataka",
  postalCode: "560038",
  addressCountry: "IN",
  latitude: 12.9784,
  longitude: 77.6408,
} as const;

export const INSTRUCTOR = {
  name: "Deepak Mehra",
  jobTitle: "Guitar Instructor & Recording Artist",
  image: "/images/pr1.jpeg",
  description:
    "Recording artist and guitar educator, founder of Mostly Acoustic, teaching acoustic guitar to beginners and intermediate players.",
} as const;

/**
 * Topic keywords. Kept short and genuinely descriptive — keyword meta carries
 * no ranking weight, but it is read by some aggregators and internal search.
 */
export const SITE_KEYWORDS = [
  "acoustic guitar lessons",
  "learn guitar online",
  "beginner guitar course",
  "guitar chords",
  "guitar chord sheets",
  "strumming patterns",
  "fingerstyle guitar",
  "online music school",
  "guitar practice routine",
  "Mostly Acoustic",
] as const;
