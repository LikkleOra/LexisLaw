'use client';

import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressStepper from './ProgressStepper';
import { Matter } from '@/types';
import { LucideClock, LucideCalendar, LucideUser, LucideFileText, LucideMessageSquare } from 'lucide-react';

interface MatterDetailsProps {
  matter: Matter;
}

const MatterDetails: React.FC<MatterDetailsProps> = ({ matter }) => {
  const infoItems = [
    { label: 'Client', value: matter.name, icon: LucideUser },
    { label: 'Matter Type', value: matter.matter, icon: LucideFileText },
    { label: 'Appointment', value: matter.date, icon: LucideCalendar },
    { label: 'Lead Attorney', value: matter.attorney, icon: LucideUser },
    { label: 'Last Updated', value: matter.updated, icon: LucideClock },
    { label: 'Next Action', value: matter.next, icon: LucideMessageSquare, highlighted: true },
  ];

  return (
    <Card shadow className="bg-[#121212] border-lexis-green border-l-4 p-8 md:p-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-lexis-grey">Active Matter</span>
          <h3 className="text-4xl font-display tracking-tight text-white">{matter.reference}</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <Badge variant={matter.status === 4 ? 'verified' : 'progress'} size="md">
            {matter.statusLabel}
          </Badge>
          {matter.wa && (
            <a 
              href={`https://wa.me/${matter.wa}`} 
              target="_blank" 
              className="flex items-center gap-2 bg-lexis-green/20 text-lexis-green border border-lexis-green px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-lexis-green hover:text-white transition-all"
            >
              WhatsApp Assistant
            </a>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-black/40 border border-white/5 p-8">
        <span className="font-mono text-[10px] uppercase tracking-widest text-lexis-grey block mb-4">Milestone Progress</span>
        <ProgressStepper currentStep={matter.status} />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {infoItems.map((item, idx) => (
          <div key={idx} className={`space-y-3 p-6 border-l-2 ${item.highlighted ? 'bg-lexis-red/5 border-lexis-red' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center gap-2 text-lexis-grey">
              <item.icon size={14} />
              <span className="font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
            </div>
            <p className={`font-mono text-sm uppercase tracking-tight ${item.highlighted ? 'text-lexis-red font-bold' : 'text-white'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MatterDetails;
