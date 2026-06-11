'use client';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  Ticket,
  Heart,
  ExternalLink,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Place } from '@/data/places';

const CAT_STYLE: Record<string, { bg: string; text: string }> = {
  historical:  { bg: 'bg-amber-100',   text: 'text-amber-800' },
  devotional:  { bg: 'bg-orange-100',  text: 'text-orange-800' },
  water_parks: { bg: 'bg-blue-100',    text: 'text-blue-800' },
  amusement:   { bg: 'bg-purple-100',  text: 'text-purple-800' },
  food:        { bg: 'bg-rose-100',    text: 'text-rose-800' },
  nature:      { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  photography: { bg: 'bg-pink-100',    text: 'text-pink-800' },
  adventure:   { bg: 'bg-cyan-100',    text: 'text-cyan-800' },
};

const CAT_EMOJI: Record<string, string> = {
  historical: '🏛️', devotional: '🛕', water_parks: '🌊',
  amusement: '🎢', food: '🍛', nature: '🌿', photography: '📸', adventure: '⛰️',
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11}
          className={cn('fill-current', i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200')}
        />
      ))}
      <span className="ml-1 text-slate-500 text-xs font-semibold">{rating}</span>
    </span>
  );
}

interface Props {
  place: Place;
  isVisited: boolean;
  onToggleVisited: () => void;
}

export default function PlaceCard({ place, isVisited, onToggleVisited }: Props) {
  const cat = CAT_STYLE[place.category] ?? { bg: 'bg-slate-100', text: 'text-slate-700' };
  const isFood = place.category === 'food';
  const hasExternalTicket = Boolean(place.bookingLink);

  return (
    <div className={cn(
      'group relative bg-white rounded-2xl overflow-hidden border card-lift flex flex-col',
      isVisited ? 'border-orange-300 ring-1 ring-orange-200' : 'border-slate-100'
    )}>
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center text-[72px] select-none
                        group-hover:scale-110 transition-transform duration-500">
          {place.emoji}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        <span className={cn('absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full capitalize', cat.bg, cat.text)}>
          {CAT_EMOJI[place.category]} {place.category.replace('_', ' ')}
        </span>

        <button
          onClick={e => { e.preventDefault(); onToggleVisited(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          title={isVisited ? 'Remove from visited' : 'Mark as visited'}
        >
          <Heart size={15} className={cn('transition-colors', isVisited ? 'fill-orange-500 text-orange-500' : 'text-slate-400')} />
        </button>

        {place.ticketPrice === 0 && !isFood && (
          <span className="absolute bottom-3 left-3 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
            FREE ENTRY
          </span>
        )}
        {isFood && (
          <span className="absolute bottom-3 left-3 text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
            FOOD GUIDE ONLY
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-navy-900 text-[15px] leading-tight group-hover:text-orange-600 transition-colors mb-1">
          {place.name}
        </h3>

        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin size={10} className="flex-shrink-0" />
          <span className="truncate">{place.location}</span>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-3 flex-1">
          {place.description}
        </p>

        {isFood && place.dishesToTry?.length ? (
          <div className="mb-3 rounded-xl bg-rose-50 border border-rose-100 p-2.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-500 mb-1.5">Famous dishes</p>
            <p className="text-xs text-rose-800 font-semibold line-clamp-2">
              {place.dishesToTry.slice(0, 4).join(' • ')}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <Stars rating={place.rating} />
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {place.timings.split(',')[0]}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
          <div className="min-w-0">
            {isFood ? (
              <span className="text-rose-600 font-black text-sm flex items-center gap-1">
                <UtensilsCrossed size={13} /> No booking
              </span>
            ) : place.ticketPrice === 0 ? (
              <span className="text-emerald-600 font-black text-sm">Free / official info</span>
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="text-slate-400 text-xs mr-0.5">from</span>
                <IndianRupee size={13} className="text-navy-800" />
                <span className="font-black text-navy-800 text-lg leading-none">{place.ticketPrice}</span>
              </div>
            )}
          </div>

          {isFood ? (
            <Link href={`/booking?place=${place.id}&city=${place.city}`}
              className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl whitespace-nowrap"
            >
              Dishes
            </Link>
          ) : hasExternalTicket ? (
            <a href={place.bookingLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl whitespace-nowrap"
            >
              <ExternalLink size={12} />
              Official
            </a>
          ) : (
            <Link href={`/booking?place=${place.id}&city=${place.city}`}
              className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl whitespace-nowrap"
            >
              <Ticket size={12} />
              Details
            </Link>
          )}
        </div>
      </div>

      {isVisited && (
        <div className="absolute top-0 right-0 w-0 h-0
          border-t-[36px] border-t-orange-500
          border-l-[36px] border-l-transparent">
          <CheckCircle2 size={12} className="absolute -top-[30px] right-0.5 text-white" />
        </div>
      )}
    </div>
  );
}
