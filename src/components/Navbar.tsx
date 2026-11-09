"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { isAdminRole } from "@/lib/roles";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/free-courses", label: "Free Courses" },
  { href: "/songs", label: "Songs" },
  { href: "/about", label: "About Me" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

type NavbarProps = {
  variant?: "transparent" | "solid" | "light";
};

export function Navbar({ variant = "transparent" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isHydrated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const isLight = variant === "light";
  const solid = variant === "solid" || (!isLight && scrolled);
  const lightSolid = isLight && scrolled;

  const textClass = isLight
    ? "text-[#1a1a1a]"
    : "text-white";
  const mutedTextClass = isLight
    ? "text-[#1a1a1a]/80 hover:text-[#0DA694] transition-colors"
    : "text-white/80 hover:text-[#11C5BB] transition-colors";
  const loginClass = isLight
    ? "text-[#1a1a1a] hover:opacity-70 transition-opacity"
    : "text-white hover:opacity-80 transition-opacity";
  const menuBtnClass = isLight ? "text-[#1a1a1a]" : "text-white";

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isLight
            ? lightSolid
              ? "border-b border-black/8 bg-white/95 shadow-sm backdrop-blur-lg"
              : "bg-transparent"
            : solid
              ? "border-b border-white/12 bg-black/70 shadow-lg backdrop-blur-lg"
              : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-5 md:px-8 lg:px-10"
          aria-label="Primary"
        >
          <Link
            href="/"
            className={`flex shrink-0 items-center gap-2.5 ${textClass}`}
            aria-label="Mostly Acoustic - home"
          >
            <Image
              src="/images/Logo.png"
              alt=""
              width={104}
              height={104}
              loading="eager"
              className="h-11 w-11 shrink-0 object-contain sm:h-[52px] sm:w-[52px] xl:h-[58px] xl:w-[58px]"
            />
            <span className="whitespace-nowrap text-lg font-semibold sm:text-xl">
              Mostly Acoustic
            </span>
          </Link>

          <ul className="hidden items-center gap-5 xl:flex xl:gap-6 2xl:gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`whitespace-nowrap font-sans text-[13px] font-medium uppercase tracking-wide 2xl:text-sm 2xl:tracking-wider ${mutedTextClass}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-3 xl:flex xl:gap-4 2xl:gap-6">
            {!user ? (
              <>
                <PrimaryCta
                  isHydrated={isHydrated}
                  loggedIn={false}
                  isAdmin={false}
                  className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-brand-teal px-5 font-sans text-[13px] font-semibold text-white shadow-lg shadow-brand-teal/30 transition-all duration-200 hover:scale-[1.05] hover:shadow-xl hover:shadow-brand-teal/40 hover:bg-brand-teal-hover 2xl:px-6 2xl:text-sm"
                />
                <AuthAction
                  className={`whitespace-nowrap font-sans text-xs font-semibold uppercase tracking-wide ${loginClass}`}
                  isHydrated={isHydrated}
                  showDashboard={false}
                  onLogout={logout}
                />
              </>
            ) : (
              <AuthAction
                className={`whitespace-nowrap font-sans text-xs font-semibold uppercase tracking-wide ${loginClass}`}
                isHydrated={isHydrated}
                userName={user.name}
                showDashboard={isAdminRole(user.role)}
                onLogout={logout}
              />
            )}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 xl:hidden ${menuBtnClass}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              id="mobile-nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              data-no-scroll-top
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed left-0 top-0 z-40 h-screen w-full max-w-[280px] overflow-y-auto backdrop-blur-lg xl:hidden ${
                isLight
                  ? "border-r border-black/8 bg-white/98 shadow-xl"
                  : "border-r border-white/12 bg-black/95 shadow-2xl"
              }`}
            >
              <div className="flex h-[78px] items-center justify-between px-4">
                <Link
                  href="/"
                  className={`flex items-center gap-2 ${textClass}`}
                  aria-label="Mostly Acoustic - home"
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src="/images/Logo.png"
                    alt=""
                    width={88}
                    height={88}
                    className="h-11 w-11 shrink-0 object-contain"
                  />
                  <span className="whitespace-nowrap text-lg font-semibold tracking-[-0.02em]">
                    Mostly Acoustic
                  </span>
                </Link>
                {/* <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 ${menuBtnClass}`}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button> */}
              </div>
              <div className="flex flex-col gap-2 px-4 py-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg font-sans text-sm font-medium uppercase tracking-wide transition-all hover:bg-white/10 ${textClass}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/10 px-4 py-6">
                <div className="flex flex-col gap-3">
                  {!user ? (
                    <>
                      <PrimaryCta
                        isHydrated={isHydrated}
                        loggedIn={false}
                        isAdmin={false}
                        className="inline-flex h-10 w-full items-center justify-center rounded-full bg-brand-teal font-sans text-sm font-semibold text-white shadow-lg shadow-brand-teal/30 transition-all hover:bg-brand-teal-hover"
                        onNavigate={() => setMobileOpen(false)}
                      />
                      <AuthAction
                        className={`font-sans text-xs font-semibold uppercase tracking-wide px-4 py-2 w-full text-center ${loginClass}`}
                        isHydrated={isHydrated}
                        showDashboard={false}
                        onLogout={() => {
                          setMobileOpen(false);
                          void logout();
                        }}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    </>
                  ) : (
                    <>
                      <Link
                        href={isAdminRole(user.role) ? "/admin" : "/learning"}
                        className="block rounded-full bg-brand-teal px-4 py-2.5 text-center font-sans text-sm font-semibold text-white transition-all hover:bg-brand-teal-hover"
                        onClick={() => setMobileOpen(false)}
                      >
                        {isAdminRole(user.role) ? "Dashboard" : "My Learning"}
                      </Link>
                      <button
                        type="button"
                        className={`rounded-lg px-4 py-2.5 text-center font-sans text-sm font-semibold uppercase tracking-wide transition-all hover:bg-white/10 ${textClass}`}
                        onClick={() => {
                          setMobileOpen(false);
                          void logout();
                        }}
                      >
                        Log Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

type AuthActionProps = {
  className: string;
  isHydrated: boolean;
  userName?: string;
  showDashboard?: boolean;
  onLogout: () => void | Promise<void>;
  onNavigate?: () => void;
};

function AuthAction({
  className,
  isHydrated,
  userName,
  showDashboard = false,
  onLogout,
  onNavigate,
}: AuthActionProps) {
  if (!isHydrated) {
    return <span className="inline-block min-w-16" aria-hidden />;
  }

  if (userName) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href={showDashboard ? "/admin" : "/learning"}
          className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-brand-teal px-5 font-sans text-[13px] font-semibold text-white shadow-lg shadow-brand-teal/30 transition-all duration-200 hover:scale-[1.05] hover:shadow-xl hover:shadow-brand-teal/40 hover:bg-brand-teal-hover 2xl:px-6 2xl:text-sm"
          onClick={onNavigate}
        >
          {showDashboard ? "Dashboard" : "My Learning"}
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className={className}
          onClick={() => void onLogout()}
        >
          Log Out
        </motion.button>
      </div>
    );
  }

  return (
    <Link href="/login" className={className} onClick={onNavigate}>
      Log In
    </Link>
  );
}

function PrimaryCta({
  isHydrated,
  loggedIn,
  isAdmin = false,
  className,
  onNavigate,
}: {
  isHydrated: boolean;
  loggedIn: boolean;
  isAdmin?: boolean;
  className: string;
  onNavigate?: () => void;
}) {
  const { showcaseCtaUrl } = useSiteSettings();

  if (!isHydrated) {
    return <span className="inline-block h-10 min-w-24" aria-hidden />;
  }
  if (loggedIn && isAdmin) {
    return (
      <Link href="/admin" className={className} onClick={onNavigate}>
        Dashboard
      </Link>
    );
  }
  if (loggedIn) {
    return (
      <Link href="/learning" className={className} onClick={onNavigate}>
        My learning
      </Link>
    );
  }
  return (
    <a href={showcaseCtaUrl} className={className} onClick={onNavigate}>
      Enroll Now
    </a>
  );
}

