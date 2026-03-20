'use client';

import React, { useState, type FormEvent } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useQuery, useMutation } from 'convex/react';
import { 
  LucideTrendingUp, 
  LucideUsers, 
  LucideCalendar, 
  LucideFileText, 
  LucideMoreVertical,
  LucideArrowUpRight,
  LucideCheckCircle2,
  LucideClock
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentView, setCurrentView] = useState('bookings');

  // Convex Data
  const bookings = useQuery("functions:getBookings" as any) as any[] | undefined;
  const matters = useQuery("functions:getMatters" as any) as any[] | undefined;
  const updateStatus = useMutation("functions:updateMatterStatus" as any);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'lexislaw2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect authorization code.');
    }
  };

  const handleStatusUpdate = async (reference: string, status: number) => {
    try {
      await updateStatus({ reference, status });
      alert('Status updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card shadow className="w-full max-w-md p-12 bg-[#f8f8f8] border-black/20 space-y-12 animate-slam-in">
          <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-lexis-red flex items-center justify-center text-black font-display text-2xl font-bold shadow-brutal-red mx-auto">L</div>
             <h2 className="text-4xl font-display tracking-tight text-black uppercase">Access Secured</h2>
             <p className="font-mono text-xs text-black uppercase tracking-widest leading-relaxed">
               Authorized personnel only. Enter decryption code to access the Mokoena Legal administrative console.
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
    <main className="min-h-screen bg-white flex selection:bg-lexis-red selection:text-black">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 ml-72 p-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-16 border-b-2 border-black/5 pb-12">
          <div className="space-y-4">
            <span className="font-mono text-lexis-red text-[10px] uppercase tracking-[0.3em] font-bold">Mokoena Legal Management Console</span>
            <h1 className="text-6xl font-display tracking-tighter uppercase">
              {currentView} <span className="text-black/30">CONTROL.</span>
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
            { label: 'Active Clients', value: matters?.length || '0', icon: LucideUsers, color: 'text-black' },
            { label: 'New Bookings', value: bookings?.filter(b => b.status === 'pending').length || '0', icon: LucideCalendar, color: 'text-lexis-red' },
            { label: 'Closed Cases', value: matters?.filter(m => m.status === 4).length || '0', icon: LucideFileText, color: 'text-black' },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-black/20 p-8 border-l-4 border-l-lexis-red shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-black/5 flex items-center justify-center border border-black/10 text-lexis-red">
                    <stat.icon size={20} />
                 </div>
                 <LucideArrowUpRight className="text-black/20 group-hover:text-lexis-red transition-colors" size={16} />
              </div>
              <div className="space-y-1">
                 <div className={`text-3xl font-display ${stat.color}`}>{stat.value}</div>
                 <div className="font-mono text-[9px] text-black uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        {currentView === 'bookings' && (
          <Card className="bg-white border-black/10 overflow-hidden" padding="none" shadow>
            <div className="p-8 border-b border-black/10 flex justify-between items-center">
               <h3 className="font-display text-xl tracking-tight text-black uppercase">Recent Consultations</h3>
               <span className="font-mono text-[10px] uppercase tracking-widest text-black/50">Showing {bookings?.length || 0} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-black/5 border-b border-black/10">
                    <th className="p-6 uppercase tracking-widest text-black font-bold">Reference</th>
                    <th className="p-6 uppercase tracking-widest text-black font-bold">Client Name</th>
                    <th className="p-6 uppercase tracking-widest text-black font-bold">Matter Type</th>
                    <th className="p-6 uppercase tracking-widest text-black font-bold">Preferred Date</th>
                    <th className="p-6 uppercase tracking-widest text-black font-bold">Status</th>
                    <th className="p-6 uppercase tracking-widest text-black font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {bookings?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02] transition-colors group">
                      <td className="p-6 text-lexis-red font-bold">{row.reference}</td>
                      <td className="p-6 text-black">{row.client_name}</td>
                      <td className="p-6 text-black uppercase">{row.matter_type}</td>
                      <td className="p-6 text-black">{row.preferred_date}</td>
                      <td className="p-6">
                        <Badge variant={row.status === 'confirmed' ? 'verified' : 'pending'} size="sm">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <button className="text-black/20 hover:text-lexis-red transition-colors">
                          <LucideMoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!bookings || bookings.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-black/30 italic">No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {currentView === 'matters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matters?.map((matter, idx) => (
              <Card key={idx} shadow className="bg-white border-black/10 p-8 space-y-6 group hover:border-lexis-red transition-all">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-black/40 font-bold">Active Case</span>
                      <h4 className="text-2xl font-display tracking-tight text-black group-hover:text-lexis-red transition-colors">{matter.reference}</h4>
                   </div>
                   <Badge variant={matter.status === 4 ? 'verified' : 'progress'} size="sm">
                     Stage {matter.status}/4
                   </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-b border-black/5 py-4 font-mono text-[10px] uppercase tracking-widest text-black/60">
                   <div>
                      <div className="mb-1">Client</div>
                      <div className="text-black font-bold">{matter.name}</div>
                   </div>
                   <div>
                      <div className="mb-1">Attorney</div>
                      <div className="text-black font-bold">{matter.attorney}</div>
                   </div>
                </div>
                <div className="w-full h-2 bg-black/5 border border-black/5">
                   <div 
                     className="h-full bg-lexis-green transition-all duration-1000" 
                     style={{ width: `${(matter.status / 4) * 100}%` }}
                   />
                </div>
                <div className="flex flex-col gap-4">
                   <div className="flex justify-between items-center text-lexis-red font-bold font-mono text-[10px]">
                      <span>NEXT: {matter.next || 'AWAITING ACTION'}</span>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <Button 
                       variant="secondary" 
                       size="sm" 
                       className="h-8 text-[10px]"
                       onClick={() => handleStatusUpdate(matter.reference, Math.max(0, matter.status - 1))}
                       disabled={matter.status === 0}
                     >
                       REDUCE
                     </Button>
                     <Button 
                       variant="primary" 
                       size="sm" 
                       className="h-8 text-[10px]"
                       onClick={() => handleStatusUpdate(matter.reference, Math.min(4, matter.status + 1))}
                       disabled={matter.status === 4}
                     >
                       ADVANCE
                     </Button>
                   </div>
                </div>
              </Card>
            ))}
            {(!matters || matters.length === 0) && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-black/10 text-black/20 italic">
                No active matters found.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
