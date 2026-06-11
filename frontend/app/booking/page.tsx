"use client";
import Navbar from "@/components/navbar";
import { PLACES_DATA } from "@/data/places";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  IndianRupee,
  Info,
  MapPin,
  ShieldCheck,
  Star,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Stars({ r }: { r: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={cn(
            "fill-current",
            i <= Math.round(r) ? "text-amber-400" : "text-slate-200",
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-500">{r}</span>
    </span>
  );
}

function BookingContent() {
  const sp = useSearchParams();
  const placeId = sp.get("place") || "";
  const city = sp.get("city") || "hyderabad";
  const place = (PLACES_DATA[city] ?? []).find((p) => p.id === placeId);

  if (!place)
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-48 text-slate-400">
          <Ticket size={52} className="mb-4 opacity-20" />
          <p className="text-2xl font-black text-slate-600 mb-2">
            Place not found
          </p>
          <Link
            href="/"
            className="mt-2 text-orange-500 text-sm font-semibold hover:underline"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    );

  const isFood = place.category === "food";
  const childPrice =
    place.ticketPriceChild ?? Math.round(place.ticketPrice * 0.6);
  const officialUrl = place.bookingLink || place.officialInfoLink;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href={`/places?city=${city}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-600 mb-8 font-semibold transition-colors"
          >
            <ArrowLeft size={15} /> Back to{" "}
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-56 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[80px] select-none shadow-inner">
                {place.emoji}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
                <div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full capitalize">
                    {place.category.replace("_", " ")}
                  </span>
                  <h1 className="text-xl font-black text-navy-900 mt-2 leading-tight">
                    {place.name}
                  </h1>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin size={11} /> {place.location}
                  </div>
                </div>

                <Stars r={place.rating} />
                <p className="text-slate-600 text-sm leading-relaxed">
                  {place.description}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Timings", val: place.timings, icon: Clock },
                    {
                      label: "Best Time",
                      val: place.bestTimeToVisit,
                      icon: Calendar,
                    },
                  ].map(({ label, val, icon: Icon }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                        <Icon size={10} /> {label}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 leading-snug">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {isFood ? "Why visit" : "Highlights"}
                  </p>
                  <ul className="space-y-1.5">
                    {place.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-xs text-slate-600"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-emerald-500 mt-0.5 flex-shrink-0"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isFood ? "bg-rose-100" : "bg-orange-100",
                    )}
                  >
                    {isFood ? (
                      <UtensilsCrossed size={20} className="text-rose-600" />
                    ) : (
                      <Ticket size={20} className="text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-black text-navy-900 text-lg">
                      {isFood
                        ? "Popular dishes to try"
                        : "Official ticket redirect"}
                    </h2>
                    <p className="text-slate-400 text-xs">
                      {isFood
                        ? "No booking on TourDesk — just food recommendations"
                        : "TourDesk shows details, then sends you to the official portal"}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {isFood ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(place.dishesToTry ?? place.highlights).map((dish) => (
                          <div
                            key={dish}
                            className="rounded-xl border border-rose-100 bg-rose-50 p-4"
                          >
                            <p className="font-black text-rose-800 text-sm flex items-center gap-2">
                              <UtensilsCrossed size={14} /> {dish}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                        <Info
                          size={13}
                          className="flex-shrink-0 mt-0.5 text-slate-400"
                        />
                        Restaurants and street-food places are shown as
                        discovery guides only. TourDesk does not reserve tables,
                        collect money, or place food orders.
                      </div>

                      {place.officialInfoLink && (
                        <a
                          href={place.officialInfoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline w-full py-4 text-base rounded-xl flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={18} />
                          Open Official / Info Page
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                        <p className="text-xs font-black text-orange-500 uppercase tracking-wider mb-3">
                          Price structure
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">
                          {place.priceDetails}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl border border-orange-100 p-4">
                            <p className="text-xs text-slate-400 font-bold mb-1">
                              Adult starts from
                            </p>
                            {place.ticketPrice === 0 ? (
                              <p className="text-xl font-black text-emerald-600">
                                Free
                              </p>
                            ) : (
                              <p className="text-xl font-black text-orange-600 flex items-center gap-1">
                                <IndianRupee size={16} /> {place.ticketPrice}
                              </p>
                            )}
                          </div>
                          <div className="bg-white rounded-xl border border-orange-100 p-4">
                            <p className="text-xs text-slate-400 font-bold mb-1">
                              Child starts from
                            </p>
                            {place.ticketPrice === 0 ? (
                              <p className="text-xl font-black text-emerald-600">
                                Free
                              </p>
                            ) : (
                              <p className="text-xl font-black text-orange-600 flex items-center gap-1">
                                <IndianRupee size={16} /> {childPrice}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                            Location
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {place.location}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                            Timings
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {place.timings}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                        <ShieldCheck
                          size={13}
                          className="flex-shrink-0 mt-0.5 text-emerald-500"
                        />
                        TourDesk does not collect ticket payments. Final ticket
                        availability, slot timing, rules, discounts and taxes
                        are handled only by the official destination portal.
                      </div>

                      {officialUrl ? (
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full py-4 text-base rounded-xl flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={20} />
                          Continue to Official Portal
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full py-4 text-base rounded-xl flex items-center justify-center gap-2 bg-slate-200 text-slate-500 font-bold cursor-not-allowed"
                        >
                          Official online portal not available
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
