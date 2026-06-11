'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/navbar';
import PlaceCard from '@/components/place-card';
import { PLACES_DATA } from '@/data/places';
import {
  Landmark, Church, Waves, FerrisWheel, UtensilsCrossed, TreePine,
  Camera, Tent, Search, LayoutGrid, Heart, SlidersHorizontal, MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all',         label: 'All Places',    icon: LayoutGrid },
  { id: 'historical',  label: 'Historical',    icon: Landmark },
  { id: 'devotional',  label: 'Devotional',    icon: Church },
  { id: 'water_parks', label: 'Water Parks',   icon: Waves },
  { id: 'amusement',   label: 'Amusement',     icon: FerrisWheel },
  { id: 'food',        label: 'Food & Dining', icon: UtensilsCrossed },
  { id: 'nature',      label: 'Nature',        icon: TreePine },
  { id: 'photography', label: 'Photography',   icon: Camera },
  { id: 'adventure',   label: 'Adventure',     icon: Tent },
];

function PlacesContent() {
  const sp        = useSearchParams();
  const city      = sp.get('city')     || 'hyderabad';
  const catParam  = sp.get('category') || 'all';

  const [category,     setCategory]     = useState(catParam);
  const [search,       setSearch]       = useState('');
  const [visited,      setVisited]      = useState<Set<string>>(new Set());
  const [showVisited,  setShowVisited]  = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem('tourdesk_visited');
      if (s) setVisited(new Set(JSON.parse(s)));
    } catch {}
  }, []);

  function toggleVisited(id: string) {
    setVisited(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('tourdesk_visited', JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  }

  const all      = PLACES_DATA[city] ?? [];
  const filtered = all.filter(p => {
    const matchCat     = category === 'all' || p.category === category;
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchVisited = !showVisited || visited.has(p.id);
    return matchCat && matchSearch && matchVisited;
  });

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Sub-header ── */}
      <div
        className="relative pt-16 pb-10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)' }}
      >
        {/* subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-orange-300 text-xs font-semibold mb-2">
            <MapPin size={12} /> Exploring {cityLabel}
          </div>
          <h1 className="text-3xl font-black text-white mb-1">{cityLabel} Tourist Places</h1>
          <p className="text-white/50 text-sm mb-5">
            {all.length} experiences &middot; Official ticket redirects &middot; Restaurant dish guides
          </p>

          {/* Search */}
          <div className="flex items-center bg-white rounded-xl shadow-lg max-w-lg overflow-hidden">
            <Search size={16} className="ml-4 text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search places, monuments, parks, dishes…"
              className="flex-1 px-3 py-3.5 text-sm text-slate-800 focus:outline-none placeholder-slate-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="px-3 text-slate-400 hover:text-slate-600 text-xs">
                clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Category pills ── */}
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={cn(
                'cat-pill',
                category === id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
              )}
            >
              <Icon size={14} />
              {label}
              {category === id && filtered.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-800">{filtered.length}</span> places
            {search && <span> for &ldquo;<em>{search}</em>&rdquo;</span>}
          </p>
          <button
            onClick={() => setShowVisited(!showVisited)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all',
              showVisited
                ? 'bg-orange-50 border-orange-300 text-orange-700'
                : 'bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:text-orange-600'
            )}
          >
            <Heart size={14} className={showVisited ? 'fill-orange-500 text-orange-500' : ''} />
            {showVisited ? 'Showing visited' : 'Show visited only'}
            {visited.size > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {visited.size}
              </span>
            )}
          </button>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-28 text-slate-400">
            <SlidersHorizontal size={44} className="mx-auto mb-4 opacity-25" />
            <p className="text-xl font-black text-slate-600">No places found</p>
            <p className="text-sm mt-1">Try a different category or clear your search.</p>
            <button onClick={() => { setCategory('all'); setSearch(''); setShowVisited(false); }}
              className="mt-5 btn-primary px-6 py-2.5 text-sm inline-flex items-center">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                isVisited={visited.has(place.id)}
                onToggleVisited={() => toggleVisited(place.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading places…</p>
        </div>
      </div>
    }>
      <PlacesContent />
    </Suspense>
  );
}
