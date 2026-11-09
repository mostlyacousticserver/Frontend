"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Button size in px — keep in sync with the h-11/w-11 classes below. */
const SIZE = 44;
/** Gap the button keeps from its scroll area's bottom-right corner. */
const GAP = 20;
/** Panes shorter than this aren't worth a jump-to-top control. */
const MIN_PANE_HEIGHT = 240;

/**
 * Scrollers we never attach to. Popovers, menus, dialogs and the mobile nav
 * drawer own their own corner, so a floating button there is just clutter.
 */
const OPT_OUT = [
  "[data-no-scroll-top]",
  "[data-slot='select-content']",
  "[data-slot='dropdown-menu-content']",
  "[data-radix-popper-content-wrapper]",
  "[role='menu']",
  "[role='listbox']",
  "[role='dialog']",
].join(",");

type Placement = { left: number; top: number } | null;

/** Show the button once you're this far down — half a screen, within reason. */
function triggerFor(viewport: number) {
  return Math.min(400, Math.max(160, viewport * 0.5));
}

/**
 * `null` means the page itself scrolls, an element means that pane scrolls,
 * and `undefined` means the event came from something we ignore.
 */
function scrollerFromEvent(target: EventTarget | null) {
  if (!target || target === document || target === window) return null;
  if (!(target instanceof HTMLElement)) return undefined;
  if (target === document.documentElement || target === document.body) return null;
  if (target.closest(OPT_OUT)) return undefined;
  if (target.scrollHeight - target.clientHeight <= 8) return undefined;
  return target;
}

function measure(el: HTMLElement | null): { visible: boolean; placement: Placement } {
  // The page scroller is placed with CSS so it can pick up --scroll-top-offset.
  if (!el) {
    return {
      visible: window.scrollY > triggerFor(document.documentElement.clientHeight),
      placement: null,
    };
  }

  if (!el.isConnected) return { visible: false, placement: null };

  const viewport = el.clientHeight;
  if (viewport < MIN_PANE_HEIGHT || el.scrollTop <= triggerFor(viewport)) {
    return { visible: false, placement: null };
  }

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return { visible: false, placement: null };

  const offset = Number(el.dataset.scrollTopOffset) || 0;
  // clientWidth/clientHeight leave the scrollbars out, so the button never
  // ends up sitting underneath one.
  return {
    visible: true,
    placement: {
      left: rect.left + el.clientWidth - GAP - SIZE,
      top: rect.top + el.clientHeight - GAP - SIZE - offset,
    },
  };
}

/**
 * A single back-to-top button for the whole app. It follows whichever area was
 * scrolled last — the page, an admin pane, the classroom lesson body — and
 * parks itself in that area's bottom-right corner.
 *
 * Containers can tune it with `data-scroll-top-offset="<px>"` (lift it above a
 * floating control) or opt out entirely with `data-no-scroll-top`.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const targetRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<Placement>(null);

  const sync = useCallback(() => {
    const next = measure(targetRef.current);
    setVisible(next.visible);
    setPlacement(next.placement);
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      sync();
    });
  }, [sync]);

  useEffect(() => {
    const onScroll = (event: Event) => {
      const scroller = scrollerFromEvent(event.target);
      if (scroller === undefined) return;
      targetRef.current = scroller;
      schedule();
    };

    // Scroll events from nested panes don't bubble, so capture them at the
    // document instead — that catches every scroll container on the page.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [schedule]);

  // A route change swaps the tree out, so forget the pane we were following and
  // re-read the page position (browsers restore it on back/forward).
  useEffect(() => {
    targetRef.current = null;
    sync();
  }, [pathname, sync]);

  const scrollToTop = useCallback(() => {
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    const el = targetRef.current;

    if (el?.isConnected) el.scrollTo({ top: 0, behavior });
    else window.scrollTo({ top: 0, behavior });

    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Back to top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={placement ?? undefined}
          className={cn(
            "fixed z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#11C5BB] text-white shadow-[0_10px_28px_rgba(17,197,187,0.38)] transition-colors hover:bg-[#0fb0a7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11C5BB] cursor-pointer",
            !placement && "bottom-[calc(20px+var(--scroll-top-offset,0px))] right-5",
          )}
        >
          <ArrowUp size={20} strokeWidth={2.5} aria-hidden />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
