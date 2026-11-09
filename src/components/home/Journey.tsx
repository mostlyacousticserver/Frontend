"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionCurve } from "@/components/ui/SectionCurve";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function Journey() {
  const { formattedPrice, showcaseCtaUrl } = useSiteSettings();

  return (
    <section
      id="about"
      className="relative overflow-x-clip bg-white py-12 sm:py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0 }}
          className="flex items-center justify-start gap-1.5 sm:gap-2"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand-teal sm:h-2 sm:w-2"
            aria-hidden
          />
          <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px] md:text-[14px]">
            (My Story)
          </p>
        </motion.div>

        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="mt-3 text-left font-montserrat text-[22px] font-bold uppercase leading-[1.15] tracking-[0.02em] text-[#1a1a1a] sm:mt-4 sm:text-[28px] md:text-[36px] lg:text-[44px]"
        >
          Journey Behind The Strings
        </motion.h2>

        {/* Intro: text + overlapping portraits */}
        <div className="mt-8 grid items-start gap-8 sm:mt-10 sm:gap-10 md:mt-14 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:gap-16">
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.16 }}
            className="order-2 text-left lg:order-1"
          >
            <h3 className="font-montserrat text-[18px] font-bold uppercase tracking-[0.02em] text-[#1a1a1a] sm:text-[20px] md:text-[30px] lg:text-[35px]">
              Hi, I Am Deepak Mehra
            </h3>

            <div className="mt-4 space-y-3.5 font-sans text-[12px] leading-6 text-[#5c5c5c] sm:mt-5 sm:space-y-4 sm:text-[13px] sm:leading-7 md:text-[15px] md:leading-8">
              <p>
                Born and brought up in Delhi, I've extensively travelled across
                India and studied at the prestigious Kendriya Vidyalaya, and I'm
                a proud alumnus of Allahabad University.
              </p>
              <p>
                {" "}
                Since childhood, I've been passionate about playing the guitar
                and singing.
              </p>
              <p>
                My music teacher introduced me to the guitar when I was just 10
                years old, and since then it has become my passion and an
                integral part of my life.
              </p>

              <p>
                After mastering the skills, I began my teaching journey,
                starting with offline guitar classes before stepping into the
                online world. I discovered that while many were performing, very
                few were teaching the basics properly. On that note, I started
                posting quick guitar tutorials in super easy and fun ways.
              </p>
              <p>
                Within a short period, more than{" "}
                <span className="font-semibold text-[#406e8e]">
                  1 Lakh active learners
                </span>{" "}
                became part of the Mostly Acoustic family. Today, our community
                has grown to over{" "}
                <span className="font-semibold text-[#406e8e]">
                  3 Lakhs+ learners
                </span>{" "}
                and continues to expand every day.
              </p>
              <p>
                Throughout this journey, I have taught more than{" "}
                <span className="font-semibold text-[#406e8e]">
                  10,000+ students
                </span>{" "}
                through both offline and online platforms. I've also worked with
                renowned music, tech, and lifestyle brands including Samsung,
                Lava Music, Enya Music, Hollyland, Aeroband Guitars, Garnier,
                Merida Guitars, Lakme, Kadence, Lollapalooza, and Ulanzi.
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.24 }}
            className="order-1 mx-auto w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:order-2 lg:mx-0 lg:max-w-none"
          >
            {/* Collage stays inside the column — no negative X overflow */}
            <div className="relative w-full pb-[18%] sm:pb-[16%] md:pb-[14%]">
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.35 }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] shadow-[0_14px_36px_rgba(0,0,0,0.1)] sm:rounded-[22px] md:rounded-[24px]"
              >
                <Image
                  src="/images/pr3.jpeg"
                  alt="Deepak Mehra with guitar case"
                  fill
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 420px"
                  className="object-cover object-top"
                  priority
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35 }}
                className="absolute bottom-0 right-5 w-[52%] overflow-hidden rounded-[14px] border-2 border-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] sm:w-[54%] sm:rounded-[18px] md:w-[56%] md:rounded-[20px] lg:rounded-[22px]"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/pr2.jpeg"
                    alt="Deepak Mehra playing guitar"
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 240px"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mission */}
        <div className="mt-14 grid items-center gap-8 sm:mt-16 sm:gap-10 md:mt-20 lg:mt-24 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:mx-0 lg:max-w-none"
          >
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.35 }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] shadow-[0_14px_36px_rgba(0,0,0,0.1)] sm:rounded-[22px] md:rounded-[24px]"
            >
              <Image
                src="/images/pr1.jpeg"
                alt="Deepak Mehra practicing acoustic guitar"
                fill
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 480px"
                className="object-cover object-top"
              />
            </motion.div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.18 }}
            className="text-left"
          >
            <h3 className="font-montserrat text-[18px] font-bold uppercase tracking-[0.02em] text-[#1a1a1a] sm:text-[20px] md:text-[30px] lg:text-[35px]">
              My Mission
            </h3>

            <div className="mt-4 space-y-3.5 font-sans text-[12px] leading-6 text-[#5c5c5c] sm:mt-5 sm:space-y-4 sm:text-[13px] sm:leading-7 md:text-[15px] md:leading-8">
              <p>
                Many people shun their passion like guitar, singing etc due to
                many circumstances like lack of time, economic constraints but
                now this is the time to pick your Guitar and follow your
                passion.
              </p>
              <p>
                My mission is to make guitar learning simple, enjoyable and
                accessible to everyone across India and the Indian subcontinent
                regardless of age and musical experience helping aspiring
                musicians build a strong foundation and grow with confidence.
              </p>
              <p>
                My courses are for everyone, from beginners to advanced. You may
                be on any stage of your Guitar journey be it beginner,
                intermediate or advanced, you can take my course.
              </p>
              <p>
                Now It's time to play your favourite tunes for your loved one's so why to take a back seat ? Buckle up pick your guitar and show the world what you are ...

              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <p className="font-sans text-[13px] text-[#5c5c5c] sm:text-[15px]">
                With warm regards
              </p>
              <p className="mt-1 font-sans text-[15px] font-bold text-[#1a1a1a] sm:text-[16px]">
                Deepak Mehra
              </p>
            </div>


            <motion.a
              href={showcaseCtaUrl}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl bg-brand-teal px-6 font-sans text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(45,212,191,0.35)] transition-colors hover:bg-brand-teal-hover sm:mt-8 sm:h-12 sm:w-auto sm:px-7 sm:text-[14px] md:h-[52px] md:px-8 md:text-[15px]"
            >
              <span className="sm:hidden">
                Start Learning — {formattedPrice}
              </span>
              <span className="hidden sm:inline">
                Start Learning Today — Just {formattedPrice}
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      <SectionCurve fillColor="#f6f6f6" />
    </section>
  );
}
