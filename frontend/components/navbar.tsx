"use client";

import { cn } from "@/lib/utils";
import { Compass, Menu, Moon, Sun, Ticket, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [{ href: "/places?city=hyderabad", label: "Explore Hyderabad" }];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);

    // Initial theme detection
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const transparent = isLanding && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md group-hover:bg-orange-600 transition-colors">
            <Compass size={18} className="text-white" />
          </div>
          <div className="leading-none">
            <span
              className={cn(
                "block font-black text-lg tracking-tight",
                transparent ? "text-white" : "text-navy-900 dark:text-white",
              )}
            >
              TourDesk
            </span>
            <span
              className={cn(
                "block text-[9px] font-semibold tracking-widest uppercase",
                transparent
                  ? "text-white/60"
                  : "text-slate-400 dark:text-slate-400",
              )}
            >
              India Awaits
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                transparent
                  ? "text-white/85 hover:text-white hover:bg-white/10"
                  : "text-slate-600 dark:text-slate-350 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-900",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "p-2.5 rounded-xl transition-colors",
              transparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-900",
            )}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/places?city=hyderabad">
            <span className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <Ticket size={15} />
              Official Tickets
            </span>
          </Link>
        </div>

        {/* Mobile burger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-lg transition-colors",
              transparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-900",
            )}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              "p-2 rounded-lg",
              transparent ? "text-white" : "text-slate-700 dark:text-slate-200",
            )}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-250 hover:bg-orange-50 dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/places?city=hyderabad"
                onClick={() => setOpen(false)}
                className="btn-primary flex items-center justify-center gap-2 py-3 w-full text-sm"
              >
                <Ticket size={15} /> Official Tickets
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
