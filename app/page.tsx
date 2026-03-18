'use client';

<<<<<<< HEAD
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import BookingFlow from '@/components/booking/BookingFlow';
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';

export default function Home() {
=======
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Scale, MessageCircle, Smartphone, Users, Building2, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    matter_type: '',
    preferred_date: '',
    preferred_time: '',
    description: '',
    whatsapp_consent: false,
    popia_consent: false,
  });
  const [bookingResult, setBookingResult] = useState<any>(null);

  const matterTypes = [
    'Family Law — Divorce',
    'Family Law — Custody',
    'Criminal Defence',
    'Civil Litigation',
    'Property Law',
    'Commercial Law',
    'Employment Law',
    'Debt Collection',
    'Other',
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await api.createBooking(formData);
      setBookingResult(result);
      setBookingStep(3);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const startBooking = () => {
    setBookingStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

>>>>>>> 4b5befbc162b5ed6c9520e4f3a2ec717e09b36fa
  return (
    <main className="bg-lexis-black min-h-screen selection:bg-lexis-red selection:text-white">
      <Navbar />
      
      {/* Page Sections */}
      <Hero />
      <Services />
      
      {/* About Section - Brief and Brutalist */}
      <section id="about" className="py-32 px-6 bg-lexis-black border-t-2 border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 relative">
            <div className="absolute -top-20 -left-20 text-[200px] font-display text-white/5 select-none pointer-events-none">FIRM</div>
            <div className="space-y-4">
              <span className="font-mono text-lexis-red text-xs uppercase tracking-[0.3em] font-bold">Uncompromising Standard</span>
              <h2 className="text-6xl md:text-8xl font-display tracking-tighter leading-none">
                OUR<br/><span className="text-white/20">HERITAGE.</span>
              </h2>
            </div>
            <p className="text-lexis-grey text-lg font-mono leading-relaxed max-w-xl">
              Since 1998, Mokoena Legal has stood at the forefront of the South African legal landscape. We bridge the gap between traditional legal excellence and the fast-paced requirements of the modern world.
            </p>
            <div className="flex gap-12 border-t border-white/10 pt-12">
               <div className="space-y-2">
                  <div className="font-display text-3xl">INTEGRITY.</div>
                  <div className="font-mono text-[10px] uppercase text-lexis-grey tracking-widest">Core Value 01</div>
               </div>
               <div className="space-y-2">
                  <div className="font-display text-3xl">PRECISION.</div>
                  <div className="font-mono text-[10px] uppercase text-lexis-grey tracking-widest">Core Value 02</div>
               </div>
            </div>
          </div>

          <div className="relative">
            <div className="border-2 border-white/10 p-4 bg-lexis-black shadow-brutal-lg">
               <div className="aspect-video bg-lexis-dark-grey relative overflow-hidden grayscale contrast-125">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                     <div className="text-8xl font-display text-white">LEGAL</div>
                  </div>
                  <div className="absolute bottom-8 left-8 bg-lexis-green text-white px-6 py-3 font-display text-xl shadow-brutal-green">
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
