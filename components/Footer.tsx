'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black3 border-t-2 border-border-strong px-4 md:px-16 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
        {/* Logo & Tagline */}
        <div>
          <div className="font-display text-3xl md:text-5xl tracking-widest text-white mb-4">
            MOKOENA<span className="text-red">LEGAL</span>
          </div>
          <p className="text-grey text-sm leading-7 max-w-[260px] mb-6">
            Providing expert legal counsel for individuals and businesses across South Africa.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-mono text-xs font-bold tracking-widest text-red uppercase mb-5 pb-2 border-b border-border">
            Quick Links
          </h4>
          <a href="/#services" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            Our Services
          </a>
          <a href="/#about" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            About Us
          </a>
          <a href="/booking" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            Book Consultation
          </a>
          <a href="/tracker" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            Track Matter
          </a>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-mono text-xs font-bold tracking-widest text-red uppercase mb-5 pb-2 border-b border-border">
            Legal
          </h4>
          <a href="#" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            Terms of Service
          </a>
          <a href="#" className="block text-grey text-sm no-underline mb-2.5 hover:text-white transition">
            POPIA Compliance
          </a>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-mono text-xs font-bold tracking-widest text-red uppercase mb-5 pb-2 border-b border-border">
            Contact
          </h4>
          <div className="flex items-center gap-2.5 text-grey text-sm mb-3">
            <Phone className="w-4 h-4 text-red" />
          +27 73 433 4784
          </div>
          <div className="flex items-center gap-2.5 text-grey text-sm mb-3">
            <Mail className="w-4 h-4 text-red" />
            info@mokoenalegal.co.za
          </div>
          <div className="flex items-center gap-2.5 text-grey text-sm">
            <MapPin className="w-4 h-4 text-red" />
            Johannesburg, South Africa
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-border gap-4">
        <p className="font-mono text-xs text-grey tracking-widest text-center md:text-left">
          © 2024 Mokoena Legal Services. All rights reserved.
        </p>
        <span className="font-mono text-xs text-green tracking-widest border border-green px-3 py-1 whitespace-nowrap">
          POPIA COMPLIANT
        </span>
      </div>
    </footer>
  );
}
