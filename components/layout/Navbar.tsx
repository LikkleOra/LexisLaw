'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LucideMenu, LucideX } from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Tracker', href: '/tracker' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white border-b-2 border-border py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-lexis-red flex items-center justify-center text-black font-display text-xl font-bold shadow-brutal-red group-hover:shadow-brutal transition-all">
            L
          </div>
          <div className="font-display text-2xl tracking-tighter">
            MOKOENA <span className="text-lexis-red">LEGAL</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-display text-sm uppercase tracking-widest hover:text-lexis-red transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Button variant="primary" size="sm" onClick={() => (window.location.href = '/#booking')}>
            Book Consultation
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <LucideX size={32} /> : <LucideMenu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center gap-8 animate-page-in">
          <button className="absolute top-8 right-8 text-black" onClick={() => setIsOpen(false)}>
            <LucideX size={40} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-display text-4xl uppercase tracking-tighter hover:text-lexis-red transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button
            variant="primary"
            size="lg"
            className="mt-4"
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/#booking';
            }}
          >
            Book Consultation
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
