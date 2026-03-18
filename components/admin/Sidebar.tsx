'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LucideLayoutDashboard, 
  LucideCalendar, 
  LucideFileText, 
  LucideUsers, 
  LucideLogOut,
  LucideShield
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'bookings', name: 'Bookings', icon: LucideCalendar, badge: '5' },
    { id: 'matters', name: 'Active Matters', icon: LucideFileText, badge: '12' },
    { id: 'clients', name: 'Client Database', icon: LucideUsers },
    { id: 'documents', name: 'Legal Documents', icon: LucideShield },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-[#121212] border-r-2 border-white/5 flex flex-col z-[100]">
      {/* Sidebar Header */}
      <div className="p-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-lexis-red flex items-center justify-center text-white font-display text-sm font-bold shadow-brutal-red group-hover:shadow-brutal transition-all">
            L
          </div>
          <div className="font-display text-xl tracking-tighter">
            LEXIS<span className="text-lexis-red">ADMIN</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-lexis-grey mb-4 block px-2">Management</span>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center justify-between p-4 font-mono text-xs uppercase tracking-widest transition-all",
              currentView === item.id 
                ? "bg-lexis-red/10 text-lexis-red border-l-4 border-lexis-red" 
                : "text-lexis-grey hover:bg-white/5 hover:text-white border-l-4 border-transparent"
            )}
          >
            <div className="flex items-center gap-4">
              <item.icon size={18} />
              {item.name}
            </div>
            {item.badge && (
              <span className="bg-lexis-red text-white text-[9px] px-2 py-0.5 font-bold shadow-brutal">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-4 p-4 border border-white/5 mb-4">
          <div className="w-10 h-10 bg-lexis-dark-grey flex items-center justify-center font-display text-white">AM</div>
          <div className="flex flex-col">
            <span className="font-display text-xs tracking-tight text-white">ADMIN USER</span>
            <span className="font-mono text-[9px] text-lexis-red uppercase tracking-widest font-bold">LexisLaw HQ</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-4 p-4 font-mono text-xs uppercase tracking-widest text-lexis-grey hover:text-lexis-red transition-colors">
          <LucideLogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
