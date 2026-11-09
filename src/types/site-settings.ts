export type FeaturedCourseSettings = {
  featuredCourseImageUrl: string | null;
  featuredCourseBadge: string;
  featuredCourseTitle: string;
  featuredCourseDescription: string;
  featuredCourseBullets: string[];
  featuredCoursePriceNote: string;
  featuredCourseCtaLabel: string;
};

export type HeroContentSettings = {
  heroTitle: string;
  heroDescription: string;
  heroBadges: string[];
  heroCtaLabel: string;
  heroSocialProof: string;
};

export type PublicSiteSettings = {
  homeHeroImageUrl: string | null;
  showcasePrice: number;
  showcaseOriginalPrice: number | null;
  showcaseCtaUrl: string;
  currency: string;
} & FeaturedCourseSettings &
  HeroContentSettings;

export type AdminSiteSettings = PublicSiteSettings & {
  homeHeroImageKey: string | null;
  featuredCourseImageKey: string | null;
  updatedAt: string;
};

export const DEFAULT_FEATURED_COURSE: FeaturedCourseSettings = {
  featuredCourseImageUrl: null,
  featuredCourseBadge: "Featured course",
  featuredCourseTitle: "Beginner Guitar Mastery",
  featuredCourseDescription:
    "Go from your first chord to performing full songs with Deepak Mehra's structured, step-by-step guitar curriculum.",
  featuredCourseBullets: [
    "8 structured modules · 42+ hours of HD video",
    "Downloadable tabs, chord sheets & practice guides",
    "Private student community · completion certificate",
    "Lifetime access · all future updates included free",
  ],
  featuredCoursePriceNote: "One-time · No hidden charges",
  featuredCourseCtaLabel: "Enroll Now",
};

export const DEFAULT_HERO_CONTENT: HeroContentSettings = {
  heroTitle: "Beginner Guitar Mastery",
  heroDescription:
    "A structured, beginner-to-intermediate guitar course by multi-platinum artist Marcus Reed. Eight modules, 42+ hours of HD video, and a step-by-step roadmap — from your very first chord to performing full songs in 30 days.",
  heroBadges: ["42+ Hours", "8 Modules", "Lifetime Access", "4.9 Rating"],
  heroCtaLabel: "Begin Your Journey",
  heroSocialProof: "500+ Students already enrolled",
};

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  homeHeroImageUrl: null,
  showcasePrice: 999,
  showcaseOriginalPrice: 1200,
  showcaseCtaUrl: "#enroll",
  currency: "INR",
  ...DEFAULT_FEATURED_COURSE,
  ...DEFAULT_HERO_CONTENT,
};

export const FALLBACK_HOME_HERO = "/images/hero-bg.jpg";
export const FALLBACK_FEATURED_COURSE_IMAGE = "/images/featured-course.jpg";

export function formatShowcasePrice(
  amount: number,
  currency = "INR",
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
