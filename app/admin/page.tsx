'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  LucideTrendingUp, 
  LucideUsers, 
  LucideCalendar, 
  LucideFileText, 
  LucideMoreVertical,
  LucideArrowUpRight
} from 'lucide-react';
=======
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Lock } from 'lucide-react';
>>>>>>> 4b5befbc162b5ed6c9520e4f3a2ec717e09b36fa

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentView, setCurrentView] = useState('bookings');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'lexislaw2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect authorization code.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-lexis-black flex items-center justify-center p-6">
        <Card shadow className="w-full max-w-md p-12 bg-[#121212] border-white/10 space-y-12 animate-slam-in">
          <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-lexis-red flex items-center justify-center text-white font-display text-2xl font-bold shadow-brutal-red mx-auto">L</div>
             <h2 className="text-4xl font-display tracking-tight text-white uppercase">Access Secured</h2>
             <p className="font-mono text-xs text-lexis-grey uppercase tracking-widest leading-relaxed">
               Authorized personnel only. Enter decryption code to access the LexisLaw administrative console.
             </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <Input 
              type="password" 
              label="Authorization Code" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="text-center tracking-[0.5em]"
              required
            />
            <Button type="submit" variant="primary" className="w-full" size="lg">
              Unlock Console
            </Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-lexis-black flex selection:bg-lexis-red selection:text-white">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 ml-72 p-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-16 border-b-2 border-white/5 pb-12">
          <div className="space-y-4">
            <span className="font-mono text-lexis-red text-[10px] uppercase tracking-[0.3em] font-bold">LexisLaw Management Console</span>
            <h1 className="text-6xl font-display tracking-tighter uppercase">
              {currentView} <span className="text-white/10">CONTROL.</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" size="sm">Export Data</Button>
            <Button variant="primary" size="sm">New Entry</Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: 'R142.5k', icon: LucideTrendingUp, color: 'text-lexis-green' },
            { label: 'Active Clients', value: '184', icon: LucideUsers, color: 'text-white' },
            { label: 'Pending Bookings', value: '05', icon: LucideCalendar, color: 'text-lexis-red' },
            { label: 'Closed Cases', value: '24', icon: LucideFileText, color: 'text-white' },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-[#121212] border-white/5 p-8 border-l-4 border-l-lexis-red shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/10 text-lexis-red">
                    <stat.icon size={20} />
                 </div>
                 <LucideArrowUpRight className="text-white/20 group-hover:text-lexis-red transition-colors" size={16} />
              </div>
              <div className="space-y-1">
                 <div className={`text-3xl font-display ${stat.color}`}>{stat.value}</div>
                 <div className="font-mono text-[9px] text-lexis-grey uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        {currentView === 'bookings' && (
          <Card className="bg-[#121212] border-white/10 overflow-hidden" padding="none" shadow>
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-display text-xl tracking-tight text-white uppercase">Recent Consultations</h3>
               <span className="font-mono text-[10px] uppercase tracking-widest text-lexis-grey">Showing last 10 entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-black/40 border-b border-white/5">
                    <th className="p-6 uppercase tracking-widest text-lexis-grey font-bold">Reference</th>
                    <th className="p-6 uppercase tracking-widest text-lexis-grey font-bold">Client Name</th>
                    <th className="p-6 uppercase tracking-widest text-lexis-grey font-bold">Matter Type</th>
                    <th className="p-6 uppercase tracking-widest text-lexis-grey font-bold">Preferred Date</th>
                    <th className="p-6 uppercase tracking-widest text-lexis-grey font-bold">Status</th>
                    <th className="p-6 uppercase tracking-widest text-lexis-grey font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { ref: 'REF-82103', name: 'Thabo Mbeki', type: 'Civil Litigation', date: '2026-03-18', status: 'pending' },
                    { ref: 'REF-74291', name: 'Lerato Kunene', type: 'Family Law', date: '2026-03-19', status: 'confirmed' },
                    { ref: 'REF-61023', name: 'James Wilson', type: 'Corporate Law', date: '2026-03-20', status: 'pending' },
                    { ref: 'REF-52834', name: 'Nomvula Zulu', type: 'Real Estate', date: '2026-03-21', status: 'confirmed' },
                    { ref: 'REF-41920', name: 'Kevin Peterson', type: 'Intellectual Property', date: '2026-03-22', status: 'pending' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 text-lexis-red font-bold">{row.ref}</td>
                      <td className="p-6 text-white">{row.name}</td>
                      <td className="p-6 text-lexis-grey uppercase">{row.type}</td>
                      <td className="p-6 text-lexis-grey">{row.date}</td>
                      <td className="p-6">
                        <Badge variant={row.status === 'confirmed' ? 'verified' : 'pending'} size="sm">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <button className="text-white/20 hover:text-lexis-red transition-colors">
                          <LucideMoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {currentView === 'matters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { ref: 'REF-12345', name: 'John Doe', type: 'Civil Litigation', progress: 1, attorney: 'Adv. Jabu Mokoena' },
              { ref: 'REF-56789', name: 'Sarah Smith', type: 'Corporate Law', progress: 3, attorney: 'Adv. Thabo Nkosi' },
              { ref: 'REF-99123', name: 'Michael Khoza', type: 'Criminal Defence', progress: 2, attorney: 'Adv. Jabu Mokoena' },
              { ref: 'REF-88234', name: 'Elena Petrova', type: 'Family Law', progress: 4, attorney: 'Adv. Thabo Nkosi' },
            ].map((matter, idx) => (
              <Card key={idx} shadow className="bg-[#121212] border-white/10 p-8 space-y-6 group hover:border-lexis-red transition-all">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-lexis-grey">Active Case</span>
                      <h4 className="text-2xl font-display tracking-tight text-white group-hover:text-lexis-red transition-colors">{matter.ref}</h4>
                   </div>
                   <Badge variant={matter.progress === 4 ? 'verified' : 'progress'} size="sm">
                     Stage {matter.progress}/4
                   </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 font-mono text-[10px] uppercase tracking-widest text-lexis-grey">
                   <div>
                      <div className="mb-1">Client</div>
                      <div className="text-white font-bold">{matter.name}</div>
                   </div>
                   <div>
                      <div className="mb-1">Attorney</div>
                      <div className="text-white font-bold">{matter.attorney}</div>
                   </div>
                </div>
                <div className="w-full h-1 bg-white/5 overflow-hidden">
                   <div 
                     className="h-full bg-lexis-red transition-all duration-1000" 
                     style={{ width: `${(matter.progress / 4) * 100}%` }}
                   />
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="font-mono text-[9px] text-lexis-grey uppercase tracking-widest">Update status</span>
                   <Button variant="secondary" size="sm" className="h-8 py-0 px-4 text-[10px]">Manage</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
