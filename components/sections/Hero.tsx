'use client';

import React from 'react';
import Button from '../ui/Button';
import { LucideArrowRight, LucideCheckCircle2 } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-lexis-black/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-12">
          {/* Tagline */}
          <div className="flex items-center gap-3 bg-lexis-red/10 text-lexis-red px-4 py-2 border-l-4 border-lexis-red w-fit animate-page-in">
            <span className="font-mono text-xs uppercase tracking-[0.3em] font-bold">Premium Legal Strategy</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-display leading-[0.85] tracking-tighter animate-slam-in">
            LEGAL<br/>
            <span className="text-black">PRECISION</span><br/>
            BRUTAL<br/>
            <span className="text-lexis-green">RESULTS<span className="text-black">.</span></span>
          </h1>

          {/* Description */}
          <div className="max-w-xl border-l-2 border-lexis-green pl-8 py-2 animate-fade-in-up">
            <p className="text-[#333333] text-lg font-mono leading-relaxed">
              We don't just practice law. We architect outcomes. Mokoena Legal provides elite legal strategy for those who demand excellence and clarity.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-6 animate-fade-in-up">
            <Button variant="primary" size="lg" className="group" onClick={() => window.location.href = '#booking'}>
              Start Your Case <LucideArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.location.href = '/tracker'}>
              Track Progress
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-black/10 animate-fade-in-up">
            <div>
              <div className="font-display text-4xl text-black">15+</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#333333]">Years Experience</div>
            </div>
            <div>
              <div className="font-display text-4xl text-black">500+</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#333333]">Cases Won</div>
            </div>
            <div>
              <div className="font-display text-4xl text-black">24/7</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#333333]">Support</div>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative z-10 border-2 border-black/10 p-4 bg-white shadow-brutal-lg">
             <div className="aspect-[4/5] bg-[#f1f1f1] relative overflow-hidden grayscale contrast-125">
                {/* Placeholder for Lady Justice Image */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                   <div className="text-[200px] font-display text-black select-none">JUSTICE</div>
                </div>
                {/* EST 1998 Badge */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 origin-left">
                   <div className="bg-lexis-red text-black px-8 py-4 font-display text-4xl shadow-brutal-red">
                      EST. 1998
                   </div>
                </div>
             </div>
          </div>
          {/* Background offset border */}
          <div className="absolute top-8 left-8 w-full h-full border-2 border-lexis-red -z-10" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
