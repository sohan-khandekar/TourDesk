"use client";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import {
  Camera,
  ChevronRight,
  Church,
  CreditCard,
  FerrisWheel,
  Globe2,
  Landmark,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Star,
  Tent,
  Ticket,
  TreePine,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* ── Data ─────────────────────────────────────────────────────── */
const CITIES = [
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "City of Pearls",
    places: 34,
    active: true,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Maximum City",
    places: 38,
    active: false,
  },
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    tagline: "Heart of India",
    places: 55,
    active: false,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "Pink City",
    places: 29,
    active: false,
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    tagline: "Spiritual Capital",
    places: 24,
    active: false,
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    tagline: "Beach Paradise",
    places: 31,
    active: false,
  },
];

const CATEGORIES = [
  {
    id: "historical",
    label: "Historical",
    icon: Landmark,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  {
    id: "devotional",
    label: "Devotional",
    icon: Church,
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  {
    id: "water_parks",
    label: "Water Parks",
    icon: Waves,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  {
    id: "amusement",
    label: "Amusement",
    icon: FerrisWheel,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  {
    id: "food",
    label: "Food & Dining",
    icon: UtensilsCrossed,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  {
    id: "nature",
    label: "Nature",
    icon: TreePine,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    id: "photography",
    label: "Photography",
    icon: Camera,
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  {
    id: "adventure",
    label: "Adventure",
    icon: Tent,
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
];

const STATS = [
  { value: "34+", label: "Hyderabad Places", icon: Globe2 },
  { value: "8", label: "Categories", icon: Landmark },
  { value: "0%", label: "TourDesk Commission", icon: CreditCard },
  { value: "4.7★", label: "Avg. Rating", icon: Star },
];

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Official Redirects",
    desc: "Ticket payments happen only on official destination portals.",
  },
  {
    icon: Ticket,
    title: "Price Structure First",
    desc: "See indicative adult/child pricing before opening the portal.",
  },
  {
    icon: PhoneCall,
    title: "Food Guide Mode",
    desc: "Restaurants show famous dishes only — no table or food booking.",
  },
];

/* ── Component ───────────────────────────────────────────────── */
export default function HomePage() {
  const [query, setQuery] = useState("");

  const filtered = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.state.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* ════════════════════════════════════════
          HERO — background image
      ════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex flex-col"
        style={{
          backgroundImage: "url(/hero-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      >
        {/* dark overlay — fades left so text is readable */}
        <div className="absolute inset-0 gradient-hero-overlay" />

        <Navbar />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
            <div className="max-w-xl fade-up">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-semibold mb-6 backdrop-blur-sm">
                <Star size={11} className="fill-orange-300 text-orange-300" />
                Official ticket redirects
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight">
                Discover &amp; Plan
                <br />
                <span className="text-orange-400">India&apos;s Best</span>
                <br />
                Experiences
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
                Monuments, temples, parks and food trails — compare location,
                timings and price structure, then continue to official
                destination portals.
              </p>

              {/* Search bar */}
              <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md">
                <Search
                  size={18}
                  className="ml-4 text-slate-400 flex-shrink-0"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a city…"
                  className="flex-1 px-3 py-4 text-slate-800 text-sm focus:outline-none placeholder-slate-400"
                />
                <Link href="/places?city=hyderabad">
                  <span className="m-1.5 btn-primary flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-xl">
                    Explore <ChevronRight size={14} />
                  </span>
                </Link>
              </div>

              <p className="text-white/50 text-xs mt-3 ml-1">
                Currently available:{" "}
                <span className="text-orange-300 font-semibold">Hyderabad</span>{" "}
                &mdash; more cities coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar at bottom of hero */}
        <div className="relative z-10 glass-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg leading-none">
                      {value}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CITY SELECTOR
      ════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
            Choose Your City
          </span>
          <h2 className="text-4xl font-black text-navy-900 dark:text-white mt-2">
            Where do you want to explore?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto">
            Pick a destination — browse tourist spots, filter by your interests,
            and continue to the official ticket portal where available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((city) =>
            city.active ? (
              <Link
                key={city.id}
                href={`/places?city=${city.id}`}
                className="group relative rounded-2xl overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 card-lift cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-black text-navy-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {city.state}
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-orange-500 text-white px-2.5 py-1 rounded-full">
                      LIVE
                    </span>
                  </div>
                  <p className="text-orange-600 font-semibold text-sm italic mb-4">
                    &ldquo;{city.tagline}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {city.places} tourist places
                    </span>
                    <span className="flex items-center gap-1 text-orange-500 text-sm font-bold group-hover:gap-2 transition-all">
                      Explore <ChevronRight size={15} />
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400 w-0 group-hover:w-full transition-all duration-500" />
              </Link>
            ) : (
              <div
                key={city.id}
                className="relative rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/30 p-6 opacity-60 cursor-not-allowed"
              >
                <span className="absolute top-3 right-3 text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
                <h3 className="text-xl font-black text-slate-500 dark:text-slate-400 mb-1">
                  {city.name}
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  {city.state}
                </p>
                <p className="text-slate-400 italic text-sm mt-1">
                  &ldquo;{city.tagline}&rdquo;
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
              Browse by Category
            </span>
            <h2 className="text-4xl font-black text-navy-900 dark:text-white mt-2">
              Every kind of experience
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(({ id, label, icon: Icon, bg, text, border }) => (
              <Link
                key={id}
                href={`/places?city=hyderabad&category=${id}`}
                className={cn(
                  "flex flex-col items-center gap-2.5 p-4 rounded-2xl border dark:border-slate-800 card-lift bg-white dark:bg-slate-900 text-center",
                  border,
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    bg,
                  )}
                >
                  <Icon size={20} className={text} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="text-4xl font-black text-navy-900 dark:text-white mt-2">
            Plan in 3 easy steps
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              title: "Pick Your City",
              desc: "Choose from our growing list of Indian cities. Hyderabad is live right now.",
              icon: MapPin,
            },
            {
              n: "02",
              title: "Browse & Filter",
              desc: "Filter places by category, search by name, and mark ones you have already visited.",
              icon: Search,
            },
            {
              n: "03",
              title: "Use Official Portal",
              desc: "Open the official venue portal for payment, live slots, refunds and final confirmation.",
              icon: Ticket,
            },
          ].map(({ n, title, desc, icon: Icon }) => (
            <div
              key={n}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 card-lift"
            >
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-100 dark:shadow-none">
                  <Icon size={26} className="text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-900 text-white text-[10px] font-black flex items-center justify-center">
                  {n}
                </span>
              </div>
              <h3 className="text-lg font-black text-navy-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST BADGES
      ════════════════════════════════════════ */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-orange-400" />
                </div>
                <div>
                  <p className="font-black text-white text-base">{title}</p>
                  <p className="text-white/50 text-sm mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="bg-navy-900 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <MapPin size={15} className="text-white" />
            </div>
            <div>
              <span className="font-black text-white">TourDesk</span>
              <span className="text-white/40 text-sm ml-2">— India Awaits</span>
            </div>
          </div>
          <p className="text-white/30 text-xs text-center">
            &copy; 2025 TourDesk. Built with love for Indian travellers.
          </p>
        </div>
      </footer>
    </div>
  );
}
