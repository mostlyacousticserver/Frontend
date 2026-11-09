import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactView } from "@/components/contact/ContactView";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactFaqs } from "@/data/contact";
import { contactJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION = `Get in touch with ${SITE_NAME} for course questions, technical support, partnerships, and studio visits in Bengaluru. We usually reply within one business day.`;

export const metadata: Metadata = buildPageMetadata({
  title: `Contact ${SITE_NAME}`,
  description: DESCRIPTION,
  path: "/contact",
  image: "/og",
  keywords: ["contact guitar school", "guitar lessons Bengaluru", "support"],
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactRoutePage() {
  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd data={contactJsonLd(DESCRIPTION, contactFaqs)} id="ld-contact" />
      <Navbar variant="light" />
      <BreadcrumbBar items={BREADCRUMBS} />
      <ContactView />
      <Footer />
    </main>
  );
}
