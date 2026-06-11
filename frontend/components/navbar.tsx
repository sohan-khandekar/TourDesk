"use client";
import { cn } from "@/lib/utils";
import { Compass, Menu, Ticket, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [{ href: "/places?city=hyderabad", label: "Explore Hyderabad" }];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isLanding && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100",
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
                transparent ? "text-white" : "text-navy-900",
              )}
            >
              TourDesk
            </span>
            <span
              className={cn(
                "block text-[9px] font-semibold tracking-widest uppercase",
                transparent ? "text-white/60" : "text-slate-400",
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
                  : "text-slate-600 hover:text-orange-600 hover:bg-orange-50",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/places?city=hyderabad">
            <span className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <Ticket size={15} />
              Official Tickets
            </span>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "md:hidden p-2 rounded-lg",
            transparent ? "text-white" : "text-slate-700",
          )}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100">
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
