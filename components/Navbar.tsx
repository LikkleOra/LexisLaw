'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/#services', label: 'SERVICES' },
    { href: '/#about', label: 'ABOUT' },
    { href: '/#contact', label: 'CONTACT' },
    { href: '/tracker', label: 'TRACKER' },
    { href: '/admin', label: 'ADMIN' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black border-b-2 border-red">
      <div className="flex items-center justify-between px-4 md:px-10 h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="font-display text-xl md:text-3xl tracking-widest text-white no-underline flex items-center gap-0.5">
          MOKOENA<span className="text-red">LEGAL</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-0">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link href="/booking" className="hidden lg:block nav-cta">
          BOOK NOW
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-full h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-full h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-border">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-grey hover:text-white py-2 px-3 text-sm font-mono tracking-widest uppercase"
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-red text-white text-center py-3 mt-2 font-mono text-sm font-bold tracking-widest uppercase"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8A8A8A;
          text-decoration: none;
          padding: 8px 18px;
          border: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .nav-link:hover {
          color: #F5F5F5;
          border-color: rgba(138, 138, 138, 0.5);
          background: #1E1E1E;
        }
        .nav-cta {
          background: #E63329;
          color: #F5F5F5;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: none;
          padding: 10px 24px;
          text-decoration: none;
          box-shadow: 4px 4px 0 #9E1F18;
          transition: background 0.2s, transform 0.1s;
        }
        .nav-cta:hover {
          background: #9E1F18;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #9E1F18;
        }
      `}</style>
    </nav>
  );
}
