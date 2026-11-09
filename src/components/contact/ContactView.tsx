import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { ContactFAQ } from "./ContactFAQ";
import { ContactMap } from "./ContactMap";
import { FinalCTA } from "@/components/public/FinalCTA";

export function ContactView() {
  return (
    <div className="overflow-x-clip bg-white pb-6 pt-3 sm:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
        <ContactHero />

        <div className="mt-7 grid items-start gap-5 sm:mt-8 sm:gap-6 md:mt-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)] lg:gap-8">
          <ContactForm />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ContactInfo />
          </div>
        </div>

        {/* <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20">
          <ContactFAQ />
        </div> */}

        <ContactMap />
      </div>

      <div className="mt-8 sm:mt-10 md:mt-12">
        <FinalCTA />
      </div>
    </div>
  );
}
