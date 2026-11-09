"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

type PartnerLogo = {
  name: string;
  slug: string;
};

/**
 * Every file in /logos/partners is rendered into the same box by
 * scripts/build-partner-logos.py, so a single height class gives the whole
 * wall one optical weight — no per-logo width tuning. Half the intrinsic size
 * is plenty for a mark that never draws wider than ~140px.
 */
const LOGO_WIDTH = 300;
const LOGO_HEIGHT = 84;

const partnerLogos: PartnerLogo[] = [
  { name: "Samsung", slug: "samsung" },
  { name: "Lava Music", slug: "lava-music" },
  { name: "Hollyland", slug: "hollyland" },
  { name: "Garnier", slug: "garnier" },
  { name: "Aeroband", slug: "aeroband" },
  { name: "Lakmé", slug: "lakme" },
  { name: "Enya Music", slug: "enya-music" },
  { name: "Tanglewood Guitars", slug: "tanglewood" },
  { name: "Mérida Guitars", slug: "merida" },
  { name: "Lollapalooza", slug: "lollapalooza" },
  { name: "Kadence", slug: "kadence" },
  { name: "Tonic", slug: "tonic" },
  { name: "Openhagen", slug: "openhagen" },
  { name: "Ulanzi", slug: "ulanzi" },
  { name: "Lensgo", slug: "lensgo" },
  { name: "Skyvik", slug: "skyvik" },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function LogoItem({ logo, duplicate }: { logo: PartnerLogo; duplicate: boolean }) {
  return (
    <div
      // The track carries a second copy of every logo purely to make the loop
      // seamless, so hide that copy from assistive tech.
      aria-hidden={duplicate || undefined}
      className=" flex shrink-0 items-center justify-center px-5 sm:px-7 md:px-9 lg:px-11"
    >
      <Image
        src={`/logos/partners/${logo.slug}.png`}
        alt={duplicate ? "" : `${logo.name} logo`}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        draggable={false}
        // Muted by default so the wall reads as one texture, full strength on
        // hover. 65% is the floor at which the thin script marks (Mérida,
        // Openhagen) stay legible.
        className="h-6 w-auto select-none opacity-65 transition-opacity duration-300 hover:opacity-100 sm:h-7 md:h-8 lg:h-9"
      />
    </div>
  );
}

function LogoMarquee({
  logos,
  speed = 36,
  reverse = false,
  offset = 0,
  decorative = false,
}: {
  logos: PartnerLogo[];
  speed?: number;
  reverse?: boolean;
  /** Head start as a fraction of one full pass, 0–1. */
  offset?: number;
  /** Hide the whole row from assistive tech when it repeats another row. */
  decorative?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);
  const x = useMotionValue(0);
  const marqueeSpeed = isMobile ? speed * 0.75 : speed;

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return;

    const halfWidth = trackRef.current.scrollWidth / 2;
    if (!halfWidth) return;

    // Seed the starting position the first time the track can be measured.
    // Both rows carry the same logos, so without a head start they would run
    // in lockstep with the same logo sitting directly above its twin.
    if (!seeded.current) {
      seeded.current = true;
      x.set(reverse ? -halfWidth * (1 - offset) : -halfWidth * offset);
    }

    if (paused || reducedMotion) return;

    const current = x.get();

    const next = reverse
      ? current + (marqueeSpeed * delta) / 1000
      : current - (marqueeSpeed * delta) / 1000;

    // The track holds two identical copies, so shifting by exactly one copy
    // lands on the same picture. Carry the overshoot across rather than
    // snapping to the boundary, which would drop a few pixels of travel once
    // per pass and show up as a stutter.
    if (!reverse && next <= -halfWidth) {
      x.set(next + halfWidth);
      return;
    }

    if (reverse && next >= 0) {
      x.set(next - halfWidth);
      return;
    }

    x.set(next);
  });

  const loopLogos = [...logos, ...logos];

  return (
    <div
      className="relative overflow-hidden py-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/*
        Edge masks. `via-white` holds the gradient solid across its first half
        before fading, which gives each end a true dead zone — a logo goes
        fully white well before it reaches the edge instead of being sliced
        mid-word. A plain from/to gradient only hides its last sliver.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white via-white to-transparent sm:w-24 md:w-36 lg:w-52"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white via-white to-transparent sm:w-24 md:w-36 lg:w-52"
        aria-hidden
      />

      <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center">
        {loopLogos.map((logo, index) => (
          <LogoItem
            key={`${logo.slug}-${index}`}
            logo={logo}
            duplicate={decorative || index >= logos.length}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function Partners() {
  return (
    <section className="overflow-hidden bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1100px] px-4 text-center sm:px-6 md:px-8">
        <motion.div
          {...fadeUp}
          className="flex items-center justify-center gap-1.5 sm:gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-teal sm:h-2 sm:w-2" aria-hidden />
          <p className="font-sans text-[12px] font-medium text-gray-400 sm:text-[13px] md:text-[14px]">
            (Collaborations & Recognition)
          </p>
        </motion.div>

        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="mx-auto mt-3 max-w-[770px] font-montserrat text-[22px] font-bold uppercase leading-[1.18] tracking-[0.02em] text-[#111111] sm:mt-4 sm:text-[26px] md:text-[34px] md:leading-[1.15] lg:text-[40px]"
        >
          Trusted by Artists, Creators &
          <br className="hidden sm:block" /> Music Communities
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="mx-auto mt-3 max-w-[640px] font-sans text-[12px] text-[#6B7280] sm:mt-4 sm:text-[13px] md:text-[14px]"
        >
          Over the years, the journey has connected with thousands of music
          lovers, creators, and aspiring guitarists through performances,
          collaborations, and online learning.
        </motion.p>
      </div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.18 }}
        className="mt-8 space-y-5 sm:mt-10 sm:space-y-6 md:mt-12 md:space-y-8"
      >
        {/*
          Both rows run the full sequence — the second one backwards, and
          started half a pass in so the two rows never show the same logo
          stacked on top of itself.
        */}
        <LogoMarquee logos={partnerLogos} speed={32} />
        <LogoMarquee logos={partnerLogos} speed={28} reverse offset={0.5} decorative />
      </motion.div>
    </section>
  );
}
