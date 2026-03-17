'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Scale } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/#services', label: 'SERVICES' },
    { href: '/#about', label: 'ABOUT' },
    { href: '/tracker', label: 'TRACKER' },
    { href: '/admin', label: 'ADMIN' },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-black border-b-2 border-red">
      <div className="flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl md:text-3xl tracking-widest text-white no-underline flex items-center group">
          MOKOENA<span className="text-red transition-transform group-hover:scale-110">LEGAL</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`nav-link ${pathname === link.href ? 'text-white border-red/50 bg-red/5' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link href="/booking" className="hidden lg:flex nav-cta items-center gap-2">
          CONSULTATION <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-white z-[110] relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-8 h-8 text-red transition-all duration-300 rotate-0 hover:rotate-90" />
          ) : (
            <div className="space-y-1.5 p-1">
              <span className="block w-8 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-red ml-auto"></span>
              <span className="block w-8 h-0.5 bg-white"></span>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-[105] flex flex-col transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-[-20px]'}`}>
        <div className="flex-1 flex flex-col justify-center px-8 py-20">
          <div className="font-mono text-[10px] tracking-[4px] text-red uppercase mb-8 border-b border-border-strong pb-4">NAVIGATION</div>
          
          <div className="space-y-6">
            {navLinks.map((link, i) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-display text-4xl sm:text-5xl tracking-widest text-white transition-all group-hover:text-red flex items-center gap-4">
                  <span className="text-sm font-mono text-grey group-hover:text-red-light">0{i + 1}</span>
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-border-strong">
            <Link 
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-red text-white text-center py-5 font-mono text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-[8px_8px_0_rgba(230,51,41,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              BOOK CONSULTATION <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="mt-auto flex justify-between items-end">
             <div className="font-display text-2xl text-card2 select-none tracking-tighter">LAW</div>
             <Scale className="w-12 h-12 text-border-strong opacity-20" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8A8A8A;
          text-decoration: none;
          padding: 10px 20px;
          border: 1px solid transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover {
          color: #F5F5F5;
          border-color: rgba(230, 51, 41, 0.3);
          background: rgba(230, 51, 41, 0.05);
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
          padding: 12px 28px;
          text-decoration: none;
          box-shadow: 6px 6px 0 rgba(230, 51, 41, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-cta:hover {
          background: #C42B22;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(230, 51, 41, 0.2);
        }
      `}</style>
    </nav>
  );
}
