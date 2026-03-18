'use client';

import React from 'react';
import Card from '../ui/Card';
import { 
  LucideBriefcase, 
  LucideGavel, 
  LucideShield, 
  LucideBuilding2, 
  LucideUsers, 
  LucideScale,
  LucideArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Corporate Law',
    description: 'Expert guidance on mergers, acquisitions, and corporate governance for modern enterprises.',
    icon: LucideBriefcase,
    color: 'border-l-lexis-red',
    href: '#'
  },
  {
    title: 'Civil Litigation',
    description: 'Aggressive representation in complex disputes, ensuring your rights are protected in court.',
    icon: LucideGavel,
    color: 'border-l-lexis-green',
    href: '#'
  },
  {
    title: 'Intellectual Property',
    description: 'Securing your innovations and creative works through robust patent and trademark strategies.',
    icon: LucideShield,
    color: 'border-l-lexis-red',
    href: '#'
  },
  {
    title: 'Real Estate',
    description: 'Comprehensive legal support for commercial and residential property transactions.',
    icon: LucideBuilding2,
    color: 'border-l-lexis-green',
    href: '#'
  },
  {
    title: 'Family Law',
    description: 'Empathetic yet firm representation in divorce, custody, and estate planning matters.',
    icon: LucideUsers,
    color: 'border-l-lexis-red',
    href: '#'
  },
  {
    title: 'Criminal Defence',
    description: 'Strategic defence strategies for high-stakes criminal cases with a focus on justice.',
    icon: LucideScale,
    color: 'border-l-lexis-green',
    href: '#'
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 px-6 bg-lexis-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <span className="font-mono text-lexis-red text-xs uppercase tracking-[0.3em] font-bold">Our Expertise</span>
            <h2 className="text-6xl md:text-8xl font-display tracking-tighter leading-none">
              SPECIALIZED<br/><span className="text-white/20">STRATEGY.</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-mono text-sm text-lexis-grey leading-relaxed">
              Tailored legal services for high-stakes corporate and personal legal requirements. We bridge the gap between complexity and clarity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Link key={idx} href={service.href} className="group">
              <Card 
                className={`h-full border-white/5 bg-[#121212] group-hover:border-lexis-red group-hover:shadow-brutal-red transition-all duration-300 border-l-4 ${service.color}`}
                padding="lg"
              >
                <div className="flex flex-col h-full justify-between gap-12">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-white/5 flex items-center justify-center border-2 border-white/5 text-lexis-red group-hover:bg-lexis-red group-hover:text-white transition-colors duration-300 shadow-brutal">
                      <service.icon size={32} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-display tracking-tight group-hover:text-lexis-red transition-colors">
                        {service.title}
                      </h3>
                      <p className="font-mono text-xs text-lexis-grey leading-relaxed group-hover:text-white/80 transition-colors">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-display text-sm tracking-widest text-white/50 group-hover:text-lexis-red transition-colors mt-auto">
                    LEARN MORE <LucideArrowUpRight size={16} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
