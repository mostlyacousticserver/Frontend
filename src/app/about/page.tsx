import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutMe } from "@/components/about/AboutMe";
import { WhyChooseCourse } from "@/components/about/WhyChooseCourse";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/public/Testimonials";
import { FinalCTA } from "@/components/public/FinalCTA";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { INSTRUCTOR, SITE_NAME } from "@/lib/site-config";

const DESCRIPTION = `Meet ${INSTRUCTOR.name} — recording artist, guitar educator, and founder of ${SITE_NAME}. Learn how our acoustic guitar courses are built and who they are for.`;

export const metadata: Metadata = buildPageMetadata({
  title: `About ${SITE_NAME}`,
  description: DESCRIPTION,
  path: "/about",
  image: INSTRUCTOR.image,
  imageAlt: `${INSTRUCTOR.name}, founder of ${SITE_NAME}`,
  type: "profile",
  keywords: ["guitar instructor", "about Mostly Acoustic", INSTRUCTOR.name],
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd data={aboutJsonLd(DESCRIPTION)} id="ld-about" />
      <Navbar variant="light" />
      <BreadcrumbBar items={BREADCRUMBS} />
      <AboutHero />
      <AboutMe />
      <WhyChooseCourse />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
