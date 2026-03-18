'use client';

<<<<<<< HEAD
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Tracker from '@/components/tracker/Tracker';
import Footer from '@/components/layout/Footer';
import LegalAssistant from '@/components/assistant/LegalAssistant';
=======
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const statusSteps = ['Pending', 'In Progress', 'Awaiting Docs', 'Hearing', 'Resolved'];

export default function Tracker() {
  const [reference, setReference] = useState('');
  const [matter, setMatter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setNotFound(false);
    
    try {
      const result = await api.getMatterByReference(reference.toUpperCase());
      if (result) {
        setMatter(result);
      } else {
        setNotFound(true);
        setMatter(null);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = matter?.status ?? 0;
  const progressPercent = (statusIndex / 4) * 100;
>>>>>>> 4b5befbc162b5ed6c9520e4f3a2ec717e09b36fa

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
