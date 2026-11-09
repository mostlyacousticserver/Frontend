import { api } from "@/lib/axios";
import type {
  AdminSiteSettings,
  PublicSiteSettings,
} from "@/types/site-settings";

export const SiteSettingsAPI = {
  getPublic() {
    return api.get<PublicSiteSettings>("/site-settings", {
      skipErrorToast: true,
    });
  },

  getAdmin() {
    return api.get<AdminSiteSettings>("/admin/site-settings");
  },

  update(payload: {
    homeHeroImageKey?: string | null;
    showcasePrice?: number;
    showcaseOriginalPrice?: number | null;
    showcaseCtaUrl?: string;
    featuredCourseImageKey?: string | null;
    featuredCourseBadge?: string;
    featuredCourseTitle?: string;
    featuredCourseDescription?: string;
    featuredCourseBullets?: string[];
    featuredCoursePriceNote?: string;
    featuredCourseCtaLabel?: string;
  }) {
    return api.patch<AdminSiteSettings>("/admin/site-settings", payload);
  },

  updateShowcasePrice(payload: {
    showcasePrice: number;
    showcaseOriginalPrice?: number | null;
    showcaseCtaUrl?: string;
  }) {
    return api.patch<AdminSiteSettings>(
      "/admin/site-settings/showcase-price",
      payload,
    );
  },

  updateFeaturedCourse(payload: {
    featuredCourseImageKey?: string | null;
    featuredCourseBadge: string;
    featuredCourseTitle: string;
    featuredCourseDescription: string;
    featuredCourseBullets: string[];
    featuredCoursePriceNote: string;
    featuredCourseCtaLabel: string;
  }) {
    return api.patch<AdminSiteSettings>(
      "/admin/site-settings/featured-course",
      payload,
    );
  },

  updateHeroContent(payload: {
    homeHeroImageKey?: string | null;
    heroTitle: string;
    heroDescription: string;
    heroBadges: string[];
    heroCtaLabel: string;
    heroSocialProof: string;
  }) {
    return api.patch<AdminSiteSettings>("/admin/site-settings/hero", payload);
  },
};
