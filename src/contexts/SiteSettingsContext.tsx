"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SiteSettingsAPI } from "@/api/site-settings";
import {
  DEFAULT_SITE_SETTINGS,
  formatShowcasePrice,
  type PublicSiteSettings,
} from "@/types/site-settings";

/**
 * The hero src is deliberately absent here. It is resolved on the server by
 * `homeHeroSrc` in `lib/site-settings` and passed into `HomePage` as a prop:
 * deriving it from this client-fetched value meant the homepage always painted
 * the fallback first and swapped once the request landed.
 */
type SiteSettingsContextValue = PublicSiteSettings & {
  formattedPrice: string;
  formattedOriginalPrice: string | null;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  ...DEFAULT_SITE_SETTINGS,
  formattedPrice: formatShowcasePrice(DEFAULT_SITE_SETTINGS.showcasePrice),
  formattedOriginalPrice: formatShowcasePrice(
    DEFAULT_SITE_SETTINGS.showcaseOriginalPrice ?? 0,
  ),
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings>(
    DEFAULT_SITE_SETTINGS,
  );

  useEffect(() => {
    let cancelled = false;
    SiteSettingsAPI.getPublic()
      .then((response) => {
        if (!cancelled) {
          setSettings({
            ...DEFAULT_SITE_SETTINGS,
            ...response.data,
            featuredCourseBullets:
              response.data.featuredCourseBullets?.length
                ? response.data.featuredCourseBullets
                : DEFAULT_SITE_SETTINGS.featuredCourseBullets,
            heroBadges: response.data.heroBadges?.length
              ? response.data.heroBadges
              : DEFAULT_SITE_SETTINGS.heroBadges,
          });
        }
      })
      .catch(() => {
        // Keep the public fallback image and default ₹999 showcase price.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SiteSettingsContextValue>(() => {
    const formattedPrice = formatShowcasePrice(
      settings.showcasePrice,
      settings.currency,
    );
    const formattedOriginalPrice =
      settings.showcaseOriginalPrice != null &&
      settings.showcaseOriginalPrice > settings.showcasePrice
        ? formatShowcasePrice(
            settings.showcaseOriginalPrice,
            settings.currency,
          )
        : null;
    return {
      ...settings,
      formattedPrice,
      formattedOriginalPrice,
    };
  }, [settings]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
