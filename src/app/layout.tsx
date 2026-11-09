import type { Metadata, Viewport } from "next";
import { Poppins, Libre_Baskerville, Montserrat } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  INDEX_ROBOTS,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/seo";
import {
  BRAND_BACKGROUND,
  BRAND_COLOR,
  INSTRUCTOR,
  SITE_LANG,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
} from "@/lib/site-config";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  // Every relative URL in metadata (OG images, canonicals) resolves against
  // this, so it must be the real production origin — see NEXT_PUBLIC_SITE_URL.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  applicationName: SITE_NAME,
  category: "education",
  authors: [{ name: INSTRUCTOR.name, url: absoluteUrl("/about") }],
  creator: INSTRUCTOR.name,
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  robots: INDEX_ROBOTS,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
  // Icons and the manifest come from the app/ file conventions
  // (favicon.ico, icon.tsx, apple-icon.tsx, manifest.ts) so the emitted
  // <link> tags always match the files that actually exist.
  appleWebApp: {
    capable: true,
    title: SITE_SHORT_NAME,
    statusBarStyle: "black-translucent",
  },
  // Phone-number auto-linking rewrites copy on iOS and can break layouts.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    url: absoluteUrl("/"),
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    // Set these in the environment once the properties are claimed; Next omits
    // the tags entirely when the values are undefined.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom: it is an accessibility failure and a Lighthouse
  // audit item.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND_COLOR },
    { media: "(prefers-color-scheme: dark)", color: BRAND_BACKGROUND },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={SITE_LANG}
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${libreBaskerville.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#111111] focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-white"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
