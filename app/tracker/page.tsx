'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Tracker from '@/components/tracker/Tracker';
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';

export default function TrackerPage() {
  return (
    <main className="bg-white min-h-screen selection:bg-lexis-red selection:text-black">
      <Navbar />
      <div className="pt-20">
        <Tracker />
      </div>
      <Footer />
      <LegalAssistant />
    </main>
  );
}
