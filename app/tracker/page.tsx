'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const statusSteps = ['Pending', 'In Progress', 'Awaiting Docs', 'Hearing', 'Resolved'];

export default function Tracker() {
  const [reference, setReference] = useState('');
  const [matter, setMatter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b-2 border-card px-10 py-5">
        <Link href="/" className="font-display text-3xl tracking-widest text-white no-underline flex items-center gap-0.5">
          MOKOENA<span className="text-red">LEGAL</span>
        </Link>
      </header>

      {/* Tracker */}
      <main className="py-20 px-15">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 bg-card border-2 border-border-strong border-t-4 border-t-red p-12">
            <h1 className="font-display text-[48px] tracking-widest mb-2">Track Your <span className="text-red">Matter</span></h1>
            <p className="text-grey mb-7 text-sm">Enter your reference number to check the status of your case.</p>
            
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                className="flex-1 bg-black3 border-2 border-border-strong border-r-none text-white font-mono text-base font-bold tracking-[4px] px-6 py-4 uppercase outline-none focus:border-red"
                placeholder="REF-00000"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-red text-white font-mono text-xs font-bold tracking-widest uppercase border-2 border-red px-9 py-4 hover:bg-red-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
          </div>

          {/* Result - Found */}
          {matter && (
            <div className="bg-card border-2 border-green border-t-4 border-t-green p-10 animate-[pageIn_0.4s_ease_forwards] shadow-[8px_8px_0_rgba(45,179,74,0.15)]">
              <div className="flex items-center justify-between pb-6 border-b border-border bg-card2 p-6 -m-10 mb-10">
                <div className="font-mono text-base font-bold text-white">{matter.reference}</div>
                <div className="font-mono text-[10px] font-bold tracking-widest bg-green-dark text-white px-3 py-1.5">
                  {matter.statusLabel}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 mb-10">
                <div>
                  <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-1.5">Client</label>
                  <p className="text-base text-white font-medium">{matter.name}</p>
                </div>
                <div>
                  <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-1.5">Matter Type</label>
                  <p className="text-base text-white font-medium">{matter.matter}</p>
                </div>
                <div>
                  <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-1.5">Appointment</label>
                  <p className="text-base text-white font-medium">{matter.date}</p>
                </div>
                <div>
                  <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-1.5">Attorney</label>
                  <p className="text-base text-white font-medium">{matter.attorney}</p>
                </div>
                <div>
                  <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-1.5">Last Updated</label>
                  <p className="text-base text-white font-medium">{matter.updated}</p>
                </div>
                <div>
                  <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-1.5">Next Action</label>
                  <p className="text-base text-white font-medium">{matter.next}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="pt-10 border-t border-border">
                <div className="h-1 bg-card2 relative mb-15">
                  <div 
                    className="h-full bg-green transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
                    {statusSteps.map((step, i) => (
                      <div 
                        key={step}
                        className={`w-4 h-4 rounded-full border-2 ${
                          i <= statusIndex 
                            ? 'bg-green border-green shadow-[0_0_15px_#2DB34A]' 
                            : 'bg-card2 border-border-strong'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  {statusSteps.map((step, i) => (
                    <div 
                      key={step}
                      className={`font-mono text-[9px] uppercase tracking-widest ${
                        i <= statusIndex ? 'text-white font-bold' : 'text-grey'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              {matter.wa && (
                <a
                  href={`https://wa.me/27${matter.wa.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] text-white font-mono text-xs font-bold tracking-widest uppercase border-none px-10 py-4.5 w-full mt-2 justify-center hover:bg-[#075E54] transition-colors text-decoration-none"
                >
                  <span>💬</span>
                  Contact via WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Result - Not Found */}
          {notFound && (
            <div className="bg-red-glow border-2 border-red p-15 text-center animate-[pageIn_0.3s_ease_forwards]">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="font-display text-[36px] tracking-widest text-red mb-3">Matter Not Found</h2>
              <p className="text-grey text-sm">
                We couldn't find a matter with that reference number. Please check your confirmation 
                email or WhatsApp message for the correct reference.
              </p>
            </div>
          )}

          {/* Notification Signup */}
          {(matter || notFound) && (
            <div className="bg-card2 border border-border p-7 flex items-center justify-between mt-8 flex-wrap gap-6">
              <div className="text-sm text-grey-light">
                <strong className="block text-white text-base mb-1">Want status updates?</strong>
                Enable WhatsApp notifications to receive real-time updates on your case.
              </div>
              <label className="flex items-center gap-3 text-sm text-grey-light cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-green" defaultChecked />
                <span>Notify me of changes</span>
              </label>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
