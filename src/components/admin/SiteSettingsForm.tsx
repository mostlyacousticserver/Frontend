"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { SiteSettingsAPI } from "@/api/site-settings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogCoverField } from "@/components/admin/BlogCoverField";
import { HomeHeroImageField } from "@/components/admin/HomeHeroImageField";
import { AdminHero, AdminSurface } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DEFAULT_FEATURED_COURSE,
  DEFAULT_HERO_CONTENT,
  type AdminSiteSettings,
} from "@/types/site-settings";


/** Shared control styling: one compact row height across every input. */
const CONTROL =
  "rounded-md border-border/80 bg-white text-sm shadow-none focus-visible:border-brand-teal focus-visible:ring-[3px] focus-visible:ring-brand-teal/15";
const FIELD = cn(CONTROL, "h-9");

/** A titled panel with a muted header strip and a right-aligned action footer. */
function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <AdminSurface>
      <div className="border-b border-border/70 bg-muted/30 px-5 py-3">
        <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="space-y-4 p-5">{children}</div>
      <div className="flex justify-end border-t border-border/70 bg-muted/20 px-5 py-3">
        {action}
      </div>
    </AdminSurface>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-medium text-brand-navy"
      >
        {label}
      </Label>
      {children}
      {hint ? (
        <p className="text-[11px] leading-4 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function SaveButton({
  saving,
  label,
  onClick,
}: {
  saving: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      disabled={saving}
      onClick={onClick}
      className="h-8 bg-brand-teal px-4 text-xs font-semibold text-white hover:bg-brand-teal/90 disabled:opacity-60"
    >
      {saving ? "Saving..." : label}
    </Button>
  );
}

/** Numbered, add/remove list used for hero badges and featured bullets. */
function Repeater({
  label,
  addLabel,
  max,
  items,
  placeholder,
  disabled,
  hint,
  onChange,
}: {
  label: string;
  addLabel: string;
  max: number;
  items: string[];
  placeholder: string;
  disabled?: boolean;
  hint?: string;
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-medium text-brand-navy">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          disabled={disabled || items.length >= max}
          onClick={() => onChange([...items, ""])}
        >
          <Plus className="size-3.5" />
          {addLabel}
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-3 shrink-0 text-[11px] tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <Input
              value={item}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
              className={FIELD}
              placeholder={`${placeholder} ${index + 1}`}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
              disabled={items.length <= 1}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
      {hint ? (
        <p className="text-[11px] leading-4 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<AdminSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [savingHeroContent, setSavingHeroContent] = useState(false);
  const [price, setPrice] = useState("999");
  const [originalPrice, setOriginalPrice] = useState("1200");
  const [ctaUrl, setCtaUrl] = useState("#enroll");
  const [heroTitle, setHeroTitle] = useState(DEFAULT_HERO_CONTENT.heroTitle);
  const [heroDescription, setHeroDescription] = useState(
    DEFAULT_HERO_CONTENT.heroDescription,
  );
  const [heroBadges, setHeroBadges] = useState<string[]>(
    DEFAULT_HERO_CONTENT.heroBadges,
  );
  const [heroCtaLabel, setHeroCtaLabel] = useState(
    DEFAULT_HERO_CONTENT.heroCtaLabel,
  );
  const [heroSocialProof, setHeroSocialProof] = useState(
    DEFAULT_HERO_CONTENT.heroSocialProof,
  );
  const [featuredBadge, setFeaturedBadge] = useState(
    DEFAULT_FEATURED_COURSE.featuredCourseBadge,
  );
  const [featuredTitle, setFeaturedTitle] = useState(
    DEFAULT_FEATURED_COURSE.featuredCourseTitle,
  );
  const [featuredDescription, setFeaturedDescription] = useState(
    DEFAULT_FEATURED_COURSE.featuredCourseDescription,
  );
  const [featuredBullets, setFeaturedBullets] = useState<string[]>(
    DEFAULT_FEATURED_COURSE.featuredCourseBullets,
  );
  const [featuredPriceNote, setFeaturedPriceNote] = useState(
    DEFAULT_FEATURED_COURSE.featuredCoursePriceNote,
  );
  const [featuredCtaLabel, setFeaturedCtaLabel] = useState(
    DEFAULT_FEATURED_COURSE.featuredCourseCtaLabel,
  );
  const [featuredImageKey, setFeaturedImageKey] = useState("");
  const [tab, setTab] = useState("hero");

  useEffect(() => {
    let cancelled = false;
    SiteSettingsAPI.getAdmin()
      .then((response) => {
        if (cancelled) return;
        const data = response.data;
        setSettings(data);
        setPrice(String(data.showcasePrice));
        setOriginalPrice(
          data.showcaseOriginalPrice != null
            ? String(data.showcaseOriginalPrice)
            : "",
        );
        setCtaUrl(data.showcaseCtaUrl || "#enroll");
        setHeroTitle(data.heroTitle || DEFAULT_HERO_CONTENT.heroTitle);
        setHeroDescription(
          data.heroDescription || DEFAULT_HERO_CONTENT.heroDescription,
        );
        setHeroBadges(
          data.heroBadges?.length
            ? data.heroBadges
            : DEFAULT_HERO_CONTENT.heroBadges,
        );
        setHeroCtaLabel(data.heroCtaLabel || DEFAULT_HERO_CONTENT.heroCtaLabel);
        setHeroSocialProof(
          data.heroSocialProof || DEFAULT_HERO_CONTENT.heroSocialProof,
        );
        setFeaturedBadge(
          data.featuredCourseBadge || DEFAULT_FEATURED_COURSE.featuredCourseBadge,
        );
        setFeaturedTitle(
          data.featuredCourseTitle || DEFAULT_FEATURED_COURSE.featuredCourseTitle,
        );
        setFeaturedDescription(
          data.featuredCourseDescription ||
            DEFAULT_FEATURED_COURSE.featuredCourseDescription,
        );
        setFeaturedBullets(
          data.featuredCourseBullets?.length
            ? data.featuredCourseBullets
            : DEFAULT_FEATURED_COURSE.featuredCourseBullets,
        );
        setFeaturedPriceNote(
          data.featuredCoursePriceNote ||
            DEFAULT_FEATURED_COURSE.featuredCoursePriceNote,
        );
        setFeaturedCtaLabel(
          data.featuredCourseCtaLabel ||
            DEFAULT_FEATURED_COURSE.featuredCourseCtaLabel,
        );
        setFeaturedImageKey(data.featuredCourseImageKey ?? "");
      })
      .catch(() => {
        // interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveHero(homeHeroImageKey: string | null) {
    const response = await SiteSettingsAPI.update({ homeHeroImageKey });
    setSettings(response.data);
    toast.success(
      homeHeroImageKey ? "Hero image updated" : "Hero image reset to public photo",
    );
  }

  async function saveHeroContent() {
    if (!heroTitle.trim()) {
      toast.error("Hero title is required.");
      return;
    }
    if (!heroDescription.trim()) {
      toast.error("Hero description is required.");
      return;
    }
    const badges = heroBadges.map((item) => item.trim()).filter(Boolean);
    if (badges.length === 0) {
      toast.error("Add at least one badge.");
      return;
    }
    if (!heroCtaLabel.trim() || !heroSocialProof.trim()) {
      toast.error("CTA label and social proof text are required.");
      return;
    }

    setSavingHeroContent(true);
    try {
      const response = await SiteSettingsAPI.updateHeroContent({
        heroTitle: heroTitle.trim(),
        heroDescription: heroDescription.trim(),
        heroBadges: badges,
        heroCtaLabel: heroCtaLabel.trim(),
        heroSocialProof: heroSocialProof.trim(),
      });
      setSettings(response.data);
      setHeroBadges(response.data.heroBadges);
      toast.success("Hero content updated");
    } catch {
      // interceptor
    } finally {
      setSavingHeroContent(false);
    }
  }

  async function savePrice() {
    const showcasePrice = Number(price);
    if (!Number.isFinite(showcasePrice) || showcasePrice < 0) {
      toast.error("Enter a valid showcase price.");
      return;
    }
    const trimmed = originalPrice.trim();
    let showcaseOriginalPrice: number | null = null;
    if (trimmed) {
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast.error("Enter a valid original price, or leave it empty.");
        return;
      }
      showcaseOriginalPrice = parsed;
    }
    const trimmedCta = ctaUrl.trim();
    if (!trimmedCta) {
      toast.error("Enter a button link (e.g. #enroll or /courses/your-course).");
      return;
    }
    setSaving(true);
    try {
      const response = await SiteSettingsAPI.updateShowcasePrice({
        showcasePrice,
        showcaseOriginalPrice,
        showcaseCtaUrl: trimmedCta,
      });
      setSettings(response.data);
      toast.success("Landing page price updated");
    } catch {
      // interceptor
    } finally {
      setSaving(false);
    }
  }

  async function saveFeaturedCourse() {
    if (!featuredTitle.trim()) {
      toast.error("Featured course title is required.");
      return;
    }
    if (!featuredDescription.trim()) {
      toast.error("Featured course description is required.");
      return;
    }
    const bullets = featuredBullets.map((item) => item.trim()).filter(Boolean);
    if (bullets.length === 0) {
      toast.error("Add at least one bullet point.");
      return;
    }
    if (!featuredBadge.trim() || !featuredCtaLabel.trim() || !featuredPriceNote.trim()) {
      toast.error("Badge, button label, and price note are required.");
      return;
    }

    setSavingFeatured(true);
    try {
      const response = await SiteSettingsAPI.updateFeaturedCourse({
        featuredCourseImageKey: featuredImageKey.trim() || null,
        featuredCourseBadge: featuredBadge.trim(),
        featuredCourseTitle: featuredTitle.trim(),
        featuredCourseDescription: featuredDescription.trim(),
        featuredCourseBullets: bullets,
        featuredCoursePriceNote: featuredPriceNote.trim(),
        featuredCourseCtaLabel: featuredCtaLabel.trim(),
      });
      setSettings(response.data);
      setFeaturedImageKey(response.data.featuredCourseImageKey ?? "");
      setFeaturedBullets(response.data.featuredCourseBullets);
      toast.success("Featured course section updated");
    } catch {
      // interceptor
    } finally {
      setSavingFeatured(false);
    }
  }

  if (loading || !settings) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-9 w-72 rounded-md" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          eyebrow="Studio"
          title="Homepage Settings"
          description="Customize the hero, showcase pricing, and featured course card on your landing page."
          actions={
            <Button asChild>
              <Link href="/" target="_blank">
                View homepage
                <ExternalLink />
              </Link>
            </Button>
          }
        />
      </AdminHero>

      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0"
        >
          <TabsTrigger value="hero" className="rounded-none px-3 py-2 text-xs">
            Hero
          </TabsTrigger>
          <TabsTrigger value="pricing" className="rounded-none px-3 py-2 text-xs">
            Pricing
          </TabsTrigger>
          <TabsTrigger value="featured" className="rounded-none px-3 py-2 text-xs">
            Featured card
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Section
            title="Hero section"
            description="Background image, headline, description, info badges, and CTA."
            action={
              <SaveButton
                saving={savingHeroContent}
                label="Save hero"
                onClick={() => void saveHeroContent()}
              />
            }
          >
            <Field label="Background image">
              <HomeHeroImageField
                storageKey={settings.homeHeroImageKey}
                resolvedUrl={settings.homeHeroImageUrl}
                onUploaded={(key) => saveHero(key)}
                onReset={() => saveHero(null)}
              />
            </Field>

            <Field label="Title" htmlFor="hero-title">
              <Input
                id="hero-title"
                value={heroTitle}
                onChange={(event) => setHeroTitle(event.target.value)}
                className={FIELD}
              />
            </Field>

            <Field label="Description" htmlFor="hero-description">
              <Textarea
                id="hero-description"
                value={heroDescription}
                onChange={(event) => setHeroDescription(event.target.value)}
                rows={3}
                className={CONTROL}
              />
            </Field>

            <Repeater
              label="Info badges"
              addLabel="Add badge"
              max={6}
              items={heroBadges}
              placeholder="Badge"
              hint="Icons cycle through clock, book, check, and star in order."
              onChange={setHeroBadges}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button label" htmlFor="hero-cta-label">
                <Input
                  id="hero-cta-label"
                  value={heroCtaLabel}
                  onChange={(event) => setHeroCtaLabel(event.target.value)}
                  className={FIELD}
                />
              </Field>
              <Field label="Social proof text" htmlFor="hero-social-proof">
                <Input
                  id="hero-social-proof"
                  value={heroSocialProof}
                  onChange={(event) => setHeroSocialProof(event.target.value)}
                  className={FIELD}
                />
              </Field>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="pricing">
          <Section
            title="Showcase pricing"
            description="Display-only price used by homepage CTAs. Checkout still uses each course's own price."
            action={
              <SaveButton
                saving={saving}
                label="Save pricing"
                onClick={() => void savePrice()}
              />
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Display price (Rs)"
                htmlFor="showcase-price"
                hint="The primary price shown in CTAs."
              >
                <Input
                  id="showcase-price"
                  inputMode="numeric"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className={FIELD}
                  placeholder="999"
                />
              </Field>
              <Field
                label="Compare-at price (Rs)"
                htmlFor="showcase-original"
                hint="Shows a strikethrough price. Optional."
              >
                <Input
                  id="showcase-original"
                  inputMode="numeric"
                  value={originalPrice}
                  onChange={(event) => setOriginalPrice(event.target.value)}
                  className={FIELD}
                  placeholder="Leave empty to hide"
                />
              </Field>
            </div>

            <Field
              label="Button link"
              htmlFor="showcase-cta-url"
              hint="Used by all homepage enroll and pricing buttons. Use #enroll to scroll to the bottom section, or a path like /checkout/course-slug."
            >
              <Input
                id="showcase-cta-url"
                value={ctaUrl}
                onChange={(event) => setCtaUrl(event.target.value)}
                className={FIELD}
                placeholder="#enroll or /courses/beginner-guitar-mastery"
              />
            </Field>
          </Section>
        </TabsContent>

        <TabsContent value="featured">
          <Section
            title="Featured course card"
            description="Content for the featured course section. Price and button link come from the Pricing tab."
            action={
              <SaveButton
                saving={savingFeatured}
                label="Save featured card"
                onClick={() => void saveFeaturedCourse()}
              />
            }
          >
            <Field
              label="Card image"
              hint="Leave empty to use the default featured course image."
            >
              <BlogCoverField
                folder="site"
                compact
                value={featuredImageKey}
                disabled={savingFeatured}
                onChange={setFeaturedImageKey}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Badge label" htmlFor="featured-badge">
                <Input
                  id="featured-badge"
                  value={featuredBadge}
                  onChange={(event) => setFeaturedBadge(event.target.value)}
                  className={FIELD}
                />
              </Field>
              <Field label="Button label" htmlFor="featured-cta">
                <Input
                  id="featured-cta"
                  value={featuredCtaLabel}
                  onChange={(event) => setFeaturedCtaLabel(event.target.value)}
                  className={FIELD}
                />
              </Field>
            </div>

            <Field label="Title" htmlFor="featured-title">
              <Input
                id="featured-title"
                value={featuredTitle}
                onChange={(event) => setFeaturedTitle(event.target.value)}
                className={FIELD}
              />
            </Field>

            <Field label="Description" htmlFor="featured-description">
              <Textarea
                id="featured-description"
                value={featuredDescription}
                onChange={(event) => setFeaturedDescription(event.target.value)}
                rows={3}
                className={CONTROL}
              />
            </Field>

            <Repeater
              label="Bullet points"
              addLabel="Add bullet"
              max={8}
              items={featuredBullets}
              placeholder="Bullet"
              disabled={savingFeatured}
              onChange={setFeaturedBullets}
            />

            <Field label="Price note" htmlFor="featured-price-note">
              <Input
                id="featured-price-note"
                value={featuredPriceNote}
                onChange={(event) => setFeaturedPriceNote(event.target.value)}
                className={FIELD}
                placeholder="One-time · No hidden charges"
              />
            </Field>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
