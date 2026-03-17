'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Lock } from 'lucide-react';

const DEMO_PASSWORD = 'lexislaw2026';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [currentView, setCurrentView] = useState('bookings');
  
  // Data states
  const [bookings, setBookings] = useState<any[]>([]);
  const [matters, setMatters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError(false);
      loadData();
    } else {
      setLoginError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, mattersData] = await Promise.all([
        api.getBookings(),
        api.getMatters(),
      ]);
      setBookings(bookingsData || []);
      setMatters(mattersData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (booking: any) => {
    setSelectedMatter(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMatter(null);
  };

  const handleStatusUpdate = async () => {
    if (!selectedMatter) return;
    
    const newStatus = (document.getElementById('modalStatus') as HTMLSelectElement)?.value;
    const nextAction = (document.getElementById('modalNextAction') as HTMLInputElement)?.value;
    
    try {
      const statusMap: Record<string, number> = {
        pending: 0,
        in_progress: 1,
        awaiting_docs: 2,
        hearing: 3,
        resolved: 4,
      };
      
      await api.updateMatterStatus(
        selectedMatter.reference,
        statusMap[newStatus] || 0,
        nextAction || 'No action'
      );
      
      await loadData();
      closeModal();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const formatStatus = (status: string) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      confirmed: 'status-in-progress',
      in_progress: 'status-in-progress',
      awaiting_docs: 'status-awaiting-docs',
      hearing: 'status-hearing',
      resolved: 'status-resolved',
    };
    return classes[status] || 'status-pending';
  };

  // Restricted Access Screen (Temporary)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-5">
        <div className="w-full max-w-[500px] bg-card border-2 border-red p-12 text-center relative shadow-[10px_10px_0_rgba(230,51,41,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-red"></div>
          <div className="font-display text-[48px] tracking-widest mb-4">
            ADMIN<span className="text-red">ACCESS</span>
          </div>
          <div className="w-16 h-16 bg-red-glow border border-red flex items-center justify-center text-2xl mx-auto mb-6"><Lock className="w-8 h-8 text-red" /></div>
          <h2 className="font-display text-2xl text-white mb-4 tracking-widest uppercase">System Under Maintenance</h2>
          <p className="text-grey-light text-sm leading-7 mb-8">
            The administrative dashboard is currently being optimized and is temporarily inaccessible. 
            Access will be restored once the system has been properly configured.
          </p>
          
          <Link 
            href="/" 
            className="inline-block bg-white text-black font-mono text-xs font-bold tracking-widest uppercase border-2 border-white px-8 py-3.5 hover:bg-transparent hover:text-white transition-all"
          >
            Return to Lexis Law
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-black2 border-r-2 border-border p-10 flex flex-col sticky top-0 h-screen">
        <div className="font-display text-[32px] tracking-widest mb-15">MOKOENA<span className="text-red">LEGAL</span></div>
        
        <nav className="flex-1">
          {[
            { id: 'bookings', label: 'Bookings', count: bookings.filter(b => b.status === 'pending').length },
            { id: 'matters', label: 'Matters' },
            { id: 'clients', label: 'Clients' },
            { id: 'documents', label: 'Documents' },
            { id: 'sms', label: 'SMS Logs' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full text-left font-mono text-xs font-bold tracking-widest uppercase py-5 border-l-4 transition-colors ${
                currentView === item.id
                  ? 'text-red border-red bg-red/5'
                  : 'text-grey border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
              {item.count !== undefined && item.count > 0 && (
                <span className="ml-2 bg-red text-white px-2 py-0.5 text-[10px]">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        
        <button
          onClick={() => setIsLoggedIn(false)}
          className="font-mono text-xs text-grey hover:text-white transition mt-auto"
        >
          ← Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-15 bg-black">
        {/* Bookings View */}
        {currentView === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <h1 className="font-display text-[48px] tracking-widest">BOOKINGS <span className="text-red">MANAGEMENT</span></h1>
              <button onClick={loadData} className="btn-secondary text-xs px-5 py-3">
                Refresh ↻
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Bookings', value: bookings.length },
                { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, highlight: true },
                { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, green: true },
                { label: 'Today', value: bookings.filter(b => b.preferred_date === new Date().toISOString().split('T')[0]).length },
              ].map((stat, i) => (
                <div key={i} className={`bg-black2 border-2 border-border p-8 relative overflow-hidden ${stat.highlight ? 'before:bg-red before:absolute before:top-0 before:left-0 before:w-1 before:h-full' : stat.green ? 'before:bg-green before:absolute before:top-0 before:left-0 before:w-1 before:h-full' : ''}`}>
                  <div className="font-mono text-xs text-grey uppercase tracking-widest mb-3">{stat.label}</div>
                  <div className="font-display text-[40px] leading-none text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-black2 border-2 border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-black">
                    {['Reference', 'Client', 'Matter Type', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left p-4 font-mono text-xs text-grey uppercase tracking-widest border-b-2 border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-border">
                      <td className="p-5"><strong>{booking.reference}</strong></td>
                      <td className="p-5">
                        <div>{booking.client_name}</div>
                        <div className="text-grey text-xs">{booking.client_phone}</div>
                      </td>
                      <td className="p-5">{booking.matter_type}</td>
                      <td className="p-5">
                        <div>{booking.preferred_date}</div>
                        <div className="text-grey text-xs">{booking.preferred_time}</div>
                      </td>
                      <td className="p-5">
                        <span className={`status-badge ${getStatusClass(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => openModal(booking)}
                          className="border border-border text-white px-3 py-2 font-mono text-[10px] hover:border-red hover:text-red transition"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-grey">No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Matters View */}
        {currentView === 'matters' && (
          <div>
            <h1 className="font-display text-[48px] tracking-widest mb-12">MATTER <span className="text-red">TRACKING</span></h1>
            
            <div className="bg-black2 border-2 border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-black">
                    {['Reference', 'Client', 'Attorney', 'Status', 'Next Action', 'Actions'].map((h) => (
                      <th key={h} className="text-left p-4 font-mono text-xs text-grey uppercase tracking-widest border-b-2 border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matters.map((matter) => (
                    <tr key={matter._id} className="border-b border-border">
                      <td className="p-5"><strong>{matter.reference}</strong></td>
                      <td className="p-5">
                        <div>{matter.name}</div>
                        <div className="text-grey text-xs">{matter.matter}</div>
                      </td>
                      <td className="p-5 text-grey">{matter.attorney || 'Unassigned'}</td>
                      <td className="p-5">
                        <span className={`status-badge ${getStatusClass(matter.statusLabel?.toLowerCase().replace(' ', '_'))}`}>
                          {matter.statusLabel}
                        </span>
                      </td>
                      <td className="p-5 text-grey text-sm">{matter.next}</td>
                      <td className="p-5">
                        <button
                          onClick={() => openModal(matter)}
                          className="border border-border text-white px-3 py-2 font-mono text-[10px] hover:border-red hover:text-red transition"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                  {matters.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-grey">No matters found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients View */}
        {currentView === 'clients' && (
          <div>
            <h1 className="font-display text-[48px] tracking-widest mb-12">CLIENT <span className="text-red">DATABASE</span></h1>
            <p className="text-grey">Client management coming soon...</p>
          </div>
        )}

        {/* Documents View */}
        {currentView === 'documents' && (
          <div>
            <h1 className="font-display text-[48px] tracking-widest mb-12">DOCUMENT <span className="text-red">MANAGEMENT</span></h1>
            <p className="text-grey">Document management coming soon...</p>
          </div>
        )}

        {/* SMS Logs View */}
        {currentView === 'sms' && (
          <div>
            <h1 className="font-display text-[48px] tracking-widest mb-12">SMS <span className="text-red">LOGS</span></h1>
            <p className="text-grey">SMS logs coming soon...</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && selectedMatter && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000]" onClick={closeModal}>
          <div className="bg-black2 border-2 border-border w-[500px] p-12" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
              <h3 className="font-body text-sm font-bold tracking-widest uppercase">Update Matter Status</h3>
              <button onClick={closeModal} className="text-grey text-2xl hover:text-white">&times;</button>
            </div>
            
            <div className="mb-5">
              <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-2">Current Status</label>
              <div className="text-white">{selectedMatter.status || 'Pending'}</div>
            </div>

            <div className="mb-5">
              <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-2">New Status</label>
              <select id="modalStatus" className="form-select">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="awaiting_docs">Awaiting Documents</option>
                <option value="hearing">Hearing Scheduled</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="font-mono text-xs text-grey uppercase tracking-widest block mb-2">Next Action</label>
              <input id="modalNextAction" type="text" className="form-input" placeholder="e.g. Awaiting client documents" />
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={closeModal} className="border border-border text-white px-5 py-3 font-mono text-xs tracking-widest uppercase hover:border-white transition">
                Cancel
              </button>
              <button onClick={handleStatusUpdate} className="bg-red text-white border-2 border-red px-5 py-3 font-mono text-xs tracking-widest uppercase hover:bg-red-dark transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
