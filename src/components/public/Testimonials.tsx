"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { SectionCurve } from "@/components/ui/SectionCurve";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

const testimonials = [
  {
    name: "Aritra Sen",
    role: "Beginner Guitar Student",
    quote:
      "Perfect for beginners starting from zero, this course makes learning guitar simple, structured, and highly motivating.",
    summary:
      "This fun, beginner-friendly course made learning guitar so easy that I was confidently playing my favorite songs within just a few weeks.",
    image: "/images/testimonial-1.jpg",
    rating: 5,
  },
  {
    name: "Swastika Choudhury",
    role: "Student Guitarist",
    quote:
      "Perfect for beginners starting from zero, this course makes learning guitar simple, structured, and highly motivating.",
    summary:
      "Clear lessons and guided practice helped me stay consistent. I finally feel confident with chords and rhythm.",
    image: "/images/testimonial-2.jpg",
    rating: 5,
  },
  {
    name: "Rohan Patel",
    role: "Beginner Guitar Student",
    quote:
      "The step-by-step structure kept me motivated every week. I went from muted strings to full songs faster than I expected.",
    summary:
      "Warm teaching and song-based lessons made practice enjoyable. I started playing with friends within a month.",
    image: "/images/student-1.jpg",
    rating: 5,
  },
  {
    name: "Ananya Das",
    role: "Hobby Musician",
    quote:
      "I loved how practical every lesson felt. No overwhelm — just clear guidance, great demos, and real musical progress.",
    summary:
      "A supportive course that made guitar feel approachable. The practice plans fit perfectly into my busy schedule.",
    image: "/images/student-2.jpg",
    rating: 5,
  },
  {
    name: "Kabir Singh",
    role: "Adult Beginner",
    quote:
      "Starting as an adult felt intimidating, but this course made every step clear. Now I play songs I always wanted to learn.",
    summary:
      "Patient teaching and structured modules helped me build real confidence from the first chord onward.",
    image: "/images/student-3.jpg",
    rating: 5,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -20 : 20,
  }),
};

function Stars({
  count,
  className = "",
  size = 14,
}: {
  count: number;
  className?: string;
  size?: number;
}) {
  return (
    <div className={`flex gap-0.5 sm:gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className="fill-amber-400 text-amber-400"
          aria-hidden
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const { formattedPrice, showcaseCtaUrl } = useSiteSettings();
  const [[activeIndex, direction], setSlide] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const active = testimonials[activeIndex];

  const paginate = useCallback((newDirection: number) => {
    setSlide(([index]) => {
      const next =
        (index + newDirection + testimonials.length) % testimonials.length;
      return [next, newDirection];
    });
  }, []);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      paginate(1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused, paginate, activeIndex]);

  return (
    <section
      id="testimonials"
      className="relative bg-[#f6f6f6] py-12 sm:py-16 md:py-20 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <SectionCurve fillColor="#ffffff" position="top" className="z-0" />

      <div className="relative z-10 my-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-start gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <motion.div {...fadeUp} className="max-w-xl">
            <h2 className="font-sans text-[26px] font-bold uppercase leading-[1.12] tracking-[0.01em] sm:text-[30px] md:text-[36px] lg:text-[40px]">
              <span className="block text-[#1a1a1a]">What Our Students</span>
              <span className="block text-[#6B8CAE]">Have To Say</span>
            </h2>
            <p className="mt-3 max-w-lg font-sans text-[13px] leading-6 text-[#6B7280] sm:mt-4 sm:text-[14px] sm:leading-7 md:text-[15px]">
              Helping beginners confidently start their guitar journey with
              simple lessons, structured guidance, and real progress.
            </p>
          </motion.div>

          <motion.a
            {...fadeUp}
            href={showcaseCtaUrl}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-xl bg-brand-teal px-5 font-sans text-[13px] font-semibold text-white shadow-[0_8px_22px_rgba(45,212,191,0.32)] transition-colors hover:bg-brand-teal-hover sm:h-11 sm:w-auto sm:px-6 sm:text-[14px]"
          >
            Start Learning Today — Just{" "} {formattedPrice}
          </motion.a>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-[0.95fr_1.3fr_0.8fr] lg:items-stretch lg:gap-5">
          {/* Photo card */}
          <motion.article
            {...fadeUp}
            whileHover={{ y: -3 }}
            className="group relative aspect-[4/5] min-h-[240px] overflow-hidden rounded-2xl sm:min-h-[280px] sm:rounded-[22px] md:aspect-auto md:min-h-[300px] lg:min-h-[320px]"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.name}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={active.image}
                    alt={active.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white sm:p-5">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`overlay-${active.name}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Stars count={active.rating} className="mb-2 sm:mb-3" size={13} />
                  <p className="line-clamp-3 font-sans text-[12px] font-semibold leading-5 sm:text-[13px] sm:leading-6 md:text-[14px]">
                    {active.summary}
                  </p>
                  <p className="mt-3 font-sans text-[13px] font-bold sm:mt-3.5 sm:text-[14px]">
                    {active.name}
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] text-white/75 sm:text-[12px]">
                    {active.role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.article>

          {/* Quote card */}
          <motion.article
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.06 }}
            whileHover={{ y: -3 }}
            className="flex min-h-[220px] flex-col justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(17,17,17,0.05)] sm:min-h-[260px] sm:rounded-[22px] sm:p-5 md:p-6 lg:min-h-[320px] lg:p-7"
          >
            <div>
              <Stars count={active.rating} className="mb-3 sm:mb-4" size={14} />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.p
                  key={`quote-${active.name}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="font-sans text-[16px] font-bold leading-7 text-[#1a1a1a] sm:text-[18px] sm:leading-7 md:text-[22px] md:leading-8 lg:text-[24px] lg:leading-9"
                >
                  “{active.quote}”
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-end justify-between gap-3 sm:mt-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`meta-${active.name}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-sans text-[13px] font-bold text-[#1a1a1a] sm:text-[14px] md:text-[15px]">
                    {active.name}
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] text-gray-400 sm:text-[12px] md:text-[13px]">
                    {active.role}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex shrink-0 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => paginate(-1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F2F4] text-[#333333] transition-all hover:bg-[#E6E8EB] sm:h-10 sm:w-10"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => paginate(1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F2F4] text-[#333333] transition-all hover:bg-[#E6E8EB] sm:h-10 sm:w-10"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.article>

          {/* Stats card */}
          <motion.article
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            whileHover={{ y: -3 }}
            className="flex min-h-[160px] flex-col justify-between rounded-2xl bg-[#0B1F3A] p-4 text-white sm:min-h-[180px] sm:rounded-[22px] sm:p-5 md:col-span-2 md:min-h-[160px] md:flex-row md:items-end md:gap-8 md:p-6 lg:col-span-1 lg:min-h-[320px] lg:flex-col lg:items-stretch lg:gap-0 lg:p-7"
          >
            <p className="font-sans text-[12px] font-bold text-white/85 sm:text-[13px] md:text-[18px]">
              Facts & 
              <br />
              Numbers
            </p>
            <div className="mt-4 md:mt-0 lg:mt-auto">
              <p className="font-sans text-[40px] font-bold leading-none tracking-tight sm:text-[48px] md:text-[52px] lg:text-[56px]">
                92%
              </p>
              <p className="mt-2 max-w-[300px] font-sans text-[13px] leading-5 text-white/80 sm:mt-3 sm:text-[12px] sm:leading-6 md:max-w-[260px] md:text-[13px]">
                Students felt more confident playing within the first month
              </p>
            </div>
          </motion.article>
        </div>
      </div>

      <SectionCurve fillColor="#ffffff" className="z-0" />
    </section>
  );
}
