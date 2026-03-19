'use client';

import React from 'react';
import Link from 'next/link';
import { LucidePhone, LucideMail, LucideMapPin, LucideShield } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lexis-black border-t-4 border-lexis-red pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-lexis-red flex items-center justify-center text-white font-display text-xl font-bold">
              L
            </div>
            <div className="font-display text-2xl tracking-tighter">
              MOKOENA <span className="text-lexis-red">LEGAL</span>
            </div>
          </Link>
          <p className="text-lexis-grey text-sm font-mono leading-relaxed">
            A premier legal institution established in 2001. Over 15 years of providing uncompromising representation and strategic counsel.
          </p>
          <div className="flex items-center gap-3 bg-lexis-green/10 text-lexis-green px-4 py-2 border-l-2 border-lexis-green w-fit">
            <LucideShield size={16} />
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">POPIA COMPLIANT</span>
          </div>
        </div>

        {/* Services Links */}
        <div className="space-y-8">
          <h4 className="font-display text-xl tracking-tight text-white border-b border-white/10 pb-4">Services</h4>
          <ul className="space-y-4 font-mono text-sm text-lexis-grey">
            <li><Link href="/#services" className="hover:text-lexis-red">Migration Law</Link></li>
            <li><Link href="/#services" className="hover:text-lexis-red">Real Estate</Link></li>
            <li><Link href="/#services" className="hover:text-lexis-red">Civil Litigation</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-8">
          <h4 className="font-display text-xl tracking-tight text-white border-b border-white/10 pb-4">Quick Links</h4>
          <ul className="space-y-4 font-mono text-sm text-lexis-grey">
            <li><Link href="/#about" className="hover:text-lexis-red">About Our Firm</Link></li>
            <li><Link href="/#booking" className="hover:text-lexis-red">Book Consultation</Link></li>
            <li><Link href="/tracker" className="hover:text-lexis-red">Track Matter</Link></li>
            <li><Link href="/admin" className="hover:text-lexis-red">Admin Portal</Link></li>
            <li><Link href="#" className="hover:text-lexis-red">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-8">
          <h4 className="font-display text-xl tracking-tight text-white border-b border-white/10 pb-4">Contact</h4>
          <ul className="space-y-6 font-mono text-sm text-lexis-grey">
            <li className="flex items-start gap-3">
              <LucideMapPin className="text-lexis-red shrink-0" size={20} />
              <span>South Africa, Johannesburg</span>
            </li>
            <li className="flex items-center gap-3">
              <LucidePhone className="text-lexis-red" size={20} />
              <span>073 433 4784</span>
            </li>
            <li className="flex items-center gap-3">
              <LucideMail className="text-lexis-red" size={20} />
              <span>jabu.legal@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-mono text-[10px] text-lexis-grey uppercase tracking-widest">
          © {currentYear} MOKOENA LEGAL SERVICES (PTY) LTD. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8 font-mono text-[10px] text-lexis-grey uppercase tracking-widest">
          <Link href="#" className="hover:text-white">Terms of Service</Link>
          <Link href="#" className="hover:text-white">POPIA Policy</Link>
          <Link href="#" className="hover:text-white">PAIA Manual</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
