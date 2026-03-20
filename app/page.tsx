'use client';

import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
const BookingFlow = React.lazy(() => import('@/components/booking/BookingFlow'));
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';

export default function Home() {
  return (
    <main className="bg-white min-h-screen selection:bg-lexis-red selection:text-black">
      <Navbar />
      
      {/* Page Sections */}
      <Hero />
      <Services />
      
      {/* About Section - Brief and Brutalist */}
      <section id="about" className="py-32 px-6 bg-white border-t-2 border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 relative">
            <div className="absolute -top-20 -left-20 text-[200px] font-display text-black/5 select-none pointer-events-none">FIRM</div>
            <div className="space-y-4">
              <span className="font-mono text-lexis-red text-xs uppercase tracking-[0.3em] font-bold">Uncompromising Standard</span>
              <h2 className="text-6xl md:text-8xl font-display tracking-tighter leading-none">
                OUR<br/><span className="text-black/20">HERITAGE.</span>
              </h2>
            </div>
            <p className="text-black text-lg font-mono leading-relaxed max-w-xl">
              Since 1998, Mokoena Legal has stood at the forefront of the South African legal landscape. We bridge the gap between traditional legal excellence and the fast-paced requirements of the modern world.
            </p>
            <div className="flex gap-12 border-t border-black/10 pt-12">
               <div className="space-y-2">
                  <div className="font-display text-3xl">INTEGRITY.</div>
                  <div className="font-mono text-[10px] uppercase text-lexis-red font-bold tracking-widest">Core Value 01</div>
               </div>
               <div className="space-y-2">
                  <div className="font-display text-3xl">PRECISION.</div>
                  <div className="font-mono text-[10px] uppercase text-lexis-red font-bold tracking-widest">Core Value 02</div>
               </div>
            </div>
          </div>

          <div className="relative">
            <div className="border-2 border-black/10 p-4 bg-white shadow-brutal-lg">
               <div className="aspect-video bg-[#f1f1f1] relative overflow-hidden grayscale contrast-125">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                     <div className="text-8xl font-display text-black">LEGAL</div>
                  </div>
                  <div className="absolute bottom-8 left-8 bg-lexis-green text-black px-6 py-3 font-display text-xl shadow-brutal-green">
                     PROUDLY SOUTH AFRICAN
                  </div>
               </div>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-lexis-red -z-10 shadow-brutal" />
          </div>
        </div>
      </section>

      <BookingFlow />
      <Footer />
      
      {/* AI Assistant Widget */}
      <LegalAssistant />
    </main>
  );
}
