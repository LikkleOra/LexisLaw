'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Tracker from '@/components/tracker/Tracker';
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';

export default function TrackerPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="font-mono text-lexis-red text-[10px] uppercase tracking-[0.3em] font-bold">Matter Verification System</span>
          <h1 className="text-7xl font-display tracking-tighter uppercase text-black">
            Track <span className="text-black/10">STatus.</span>
          </h1>
        </div>
        <Footer />
      </div>
      <LegalAssistant />
    </main>
  );
}
