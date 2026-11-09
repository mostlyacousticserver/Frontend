# SEO implementation

Everything SEO-facing in this app is derived from two files:

| File | Owns |
| --- | --- |
| [`src/lib/site-config.ts`](src/lib/site-config.ts) | Brand facts: name, tagline, locale, colours, social profiles, contact details, address, instructor, topic keywords. |
| [`src/lib/seo.ts`](src/lib/seo.ts) | Metadata construction: `buildPageMetadata`, canonical URLs, robots directives, title/description truncation. |

Change a fact once in `site-config.ts` and it propagates to metadata, structured
data, the manifest, the RSS feed, and the OG images.

---

## Required configuration

`NEXT_PUBLIC_SITE_URL` **must** be set to the production origin (no trailing
slash). Canonical tags, Open Graph URLs, `sitemap.xml`, `robots.txt`, and the
RSS feed are all built from it.

```bash
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

Without it the app falls back to `VERCEL_PROJECT_PRODUCTION_URL` on Vercel, and
to `http://localhost:3000` everywhere else — which would publish localhost
canonicals to Google.

Optional, once the properties are claimed:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
NEXT_PUBLIC_BING_SITE_VERIFICATION=...
```

The verification `<meta>` tags are omitted entirely while these are unset.

---

## What each route emits

Every public page gets, via `buildPageMetadata`:

- a self-referencing `<link rel="canonical">`
- title (≤ 60 chars) and description (≤ 160 chars), truncated on word boundaries
- Open Graph tags with image dimensions and alt text
- `summary_large_image` Twitter card
- `index, follow` plus `max-image-preview:large`, `max-snippet:-1`,
  `max-video-preview:-1` for Googlebot (inherited from the root layout)

Account-gated routes (`/admin`, `/learn`, `/learning`, `/checkout`, auth) set
`NOINDEX_ROBOTS` instead, and are also disallowed in `robots.txt`.

---

## Structured data

`src/lib/json-ld.ts` emits **one connected `@graph` per page** rather than
isolated snippets. Stable `@id` anchors (`#organization`, `#website`,
`#instructor`) let search engines resolve a single brand entity site-wide.

| Route | Types |
| --- | --- |
| `/` | Organization + EducationalOrganization, WebSite, Person, WebPage, FAQPage |
| `/about` | + AboutPage, BreadcrumbList |
| `/contact` | + ContactPage, LocalBusiness with geo, FAQPage, BreadcrumbList |
| `/courses`, `/blog`, `/songs` | + CollectionPage, ItemList, BreadcrumbList |
| `/courses/[slug]` | + Course, CourseInstance, Offer, AggregateRating, Review, Syllabus |
| `/blog/[slug]` | + BlogPosting with wordCount, author, section |
| `/songs/[slug]` | + MusicComposition with composer, musicalKey, genre |

Validate with the [Rich Results Test](https://search.google.com/test/rich-results)
and the [Schema Markup Validator](https://validator.schema.org/).

> `AggregateRating` and `Review` are emitted **only** when a course actually has
> testimonials. Never seed placeholder ratings — Google issues manual actions
> for fabricated review markup.

---

## Discovery documents

| URL | Source | Cache |
| --- | --- | --- |
| `/sitemap.xml` | [`src/app/sitemap.ts`](src/app/sitemap.ts) — static routes plus every published course, post, and song from `GET /seo/index` | revalidate 1h |
| `/robots.txt` | [`src/app/robots.ts`](src/app/robots.ts) — per-agent rules; Googlebot additionally drops `?page=`/`?sort=`/`?utm_` duplicates | static |
| `/feed.xml` | [`src/app/feed.xml/route.ts`](src/app/feed.xml/route.ts) — RSS 2.0 for the 30 latest posts | revalidate 1h |
| `/manifest.webmanifest` | [`src/app/manifest.ts`](src/app/manifest.ts) — PWA manifest with icons and shortcuts | static |

If the `/seo/index` upstream call fails, the sitemap degrades to the static
routes rather than returning an error.

---

## Social images

Deterministic, server-rendered cards from a shared template
([`src/lib/og-template.tsx`](src/lib/og-template.tsx)):

- `/og` — brand fallback
- `/og/course/[slug]`, `/og/blog/[slug]`, `/og/song/[slug]` — per-entity cards
  showing the real title plus facts (level, lesson count, key, capo, author).

Detail pages prefer the entity's own artwork (course thumbnail, blog cover, song
hero) and fall back to the generated card when none exists. Cards are cached for
an hour and take no user input from the query string.

`next/og` bundles a single font weight, so the template builds hierarchy from
size, colour, and opacity rather than bold/regular contrast.

---

## Rendering

The catalogue pages used to fetch on the client, which left crawlers an empty
shell. They now server-render the first page and hand it to the existing client
component as `initialCourses` / `initialBlogs` / `initialSongs`; the component
skips its mount-time refetch and keeps owning filters and pagination.

Detail routes declare `generateStaticParams` from the SEO index, so every
published course, post, and song is prerendered at build time. Unknown slugs
still render on demand, and an index failure leaves the route dynamic rather
than failing the build.

`fetchPublishedCourse`, `fetchPublishedBlog`, and `fetchPublishedSong` are
wrapped in React `cache`, so `generateMetadata`, the page body, and the OG route
share one upstream request per slug.

---

## Still to do (content and business decisions)

1. **Set `NEXT_PUBLIC_SITE_URL`** — nothing else on this list matters until this is done.
2. **Verify the social profile URLs** in `SOCIAL_PROFILES` (`site-config.ts`).
   They are currently plausible guesses. They feed schema.org `sameAs` and the
   footer icons, and a dead profile URL weakens entity resolution.
3. **Confirm the NAP details** (`CONTACT`, `ADDRESS` in `site-config.ts`). They
   must match Google Business Profile exactly, character for character, for the
   `LocalBusiness` markup to help.
4. **Add real legal pages** — Privacy Policy, Terms, Cancellation & Refund. The
   footer still links three of these to `#`. Google requires them for commerce
   sites, and they are trust signals for E-E-A-T.
5. **Submit the sitemap** in Google Search Console and Bing Webmaster Tools.
6. **Write meta titles and descriptions per course and post** in the admin —
   `metaTitle`/`metaDescription` take priority over the generated fallbacks.
