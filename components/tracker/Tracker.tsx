'use client';

import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { LucideSearch, LucideFileText, LucideAlertCircle } from 'lucide-react';
import ProgressStepper from './ProgressStepper';
import MatterDetails from './MatterDetails';
import { useQuery } from 'convex/react';
import { Matter } from '@/types';

const Tracker: React.FC = () => {
  const [reference, setReference] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  
  const matter = useQuery("functions:getMatterByReference" as any, 
    searchTrigger ? { reference: searchTrigger } : "skip"
  ) as Matter | null | undefined;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync loading state with query
  useEffect(() => {
    if (searchTrigger && matter === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
      if (searchTrigger && matter === null) {
        setError('Matter reference not found. Please verify and try again.');
      }
    }
  }, [matter, searchTrigger]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;
    setError(null);
    setSearchTrigger(reference.toUpperCase().trim());
  };

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="font-mono text-lexis-red text-xs uppercase tracking-[0.3em] font-bold">Matter Intelligence</span>
          <h2 className="text-5xl md:text-7xl font-display tracking-tighter">
            TRACK YOUR <span className="text-black/20">PROGRESS.</span>
          </h2>
        </div>

        <Card shadow className="bg-[#f4f4f4] border-black/10 p-8 md:p-12 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Input 
                placeholder="REF-XXXXX" 
                value={reference} 
                onChange={(e) => setReference(e.target.value)}
                className="text-2xl font-bold tracking-widest text-center md:text-left"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" disabled={loading} className="md:w-48">
              {loading ? 'Searching...' : <><LucideSearch className="mr-2" size={20} /> TRACK</>}
            </Button>
          </form>
        </Card>

        {error && (
          <div className="bg-lexis-red/10 border-l-4 border-lexis-red p-6 animate-fade-in-up">
            <div className="flex items-center gap-4 text-lexis-red">
              <LucideAlertCircle size={24} />
              <p className="font-mono text-sm font-bold uppercase tracking-tight">{error}</p>
            </div>
          </div>
        )}

        {matter && (
          <div className="animate-page-in">
            <MatterDetails matter={matter} />
          </div>
        )}

        {!matter && !loading && !error && (
          <div className="text-center py-20 border-2 border-dashed border-black/10 opacity-30">
            <LucideFileText className="mx-auto mb-4" size={48} />
            <p className="font-mono text-xs uppercase tracking-widest">Enter reference number to begin</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Tracker;
