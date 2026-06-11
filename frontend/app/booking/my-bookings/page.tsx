'use client';
import Navbar from '@/components/navbar';
import { ExternalLink, ShieldCheck, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-28">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={30} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Bookings are handled officially</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            TourDesk no longer stores bookings or collects payments. Each attraction opens its own official portal, where ticket confirmation, refunds and slot changes are managed directly by the venue.
          </p>
          <Link href="/places?city=hyderabad" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
            <Ticket size={16} /> Browse Official Ticket Links
          </Link>
          <p className="text-xs text-slate-400 mt-5 flex items-center justify-center gap-1">
            <ExternalLink size={12} /> Keep your official portal confirmation safely after payment.
          </p>
        </div>
      </div>
    </div>
  );
}
