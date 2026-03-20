import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Tracker from '@/components/tracker/Tracker';
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';

export default function TrackerPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <Tracker />
        </Suspense>
      </div>
      <Footer />
      <LegalAssistant />
    </main>
  );
}
