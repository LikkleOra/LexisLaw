'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Tracker from '@/components/tracker/Tracker';
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';

export default function TrackerPage() {
  return (
    <main className="bg-lexis-black min-h-screen selection:bg-lexis-red selection:text-white">
      <Navbar />
      <div className="pt-20">
        <Tracker />
      </div>
      <Footer />
      <LegalAssistant />
    </main>
  );
}
