import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingFlow from '@/components/booking/BookingFlow';
import { Suspense } from 'react';

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <BookingFlow />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
