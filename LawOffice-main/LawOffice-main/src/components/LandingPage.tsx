import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  Shield, 
  Clock, 
  Users, 
  Award, 
  ArrowRight,
  Scale,
  Gavel,
  FileCheck,
  Lock
} from 'lucide-react';

const NavItem = ({ label }: { label: string }) => (
  <a href="#" className="text-sm font-medium text-text-muted hover:text-white transition-colors">
    {label}
  </a>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="glass-panel p-8 group hover:border-primary-red/30 transition-all duration-500">
    <div className="w-12 h-12 bg-primary-red/10 text-primary-red rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3 font-serif">{title}</h3>
    <p className="text-text-muted text-sm leading-relaxed">{description}</p>
  </div>
);

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans selection:bg-primary-red/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-red rounded-lg flex items-center justify-center text-white">
              <Scale size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">LawOffice <span className="text-primary-red">Pro</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavItem label="Home" />
            <NavItem label="Practice Areas" />
            <NavItem label="Our Team" />
            <NavItem label="Resources" />
          </div>

          <button 
            onClick={onGetStarted}
            className="btn-primary text-sm px-6"
          >
            Free Consultation <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-red/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-accent/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary-red mb-6">
              <span className="w-2 h-2 bg-primary-red rounded-full animate-pulse" />
              Legal SaaS Platform
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-8">
              We Proudly Fight <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary-red">For Your Rights</span>
            </h1>
            <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
              The modern standard for legal case management. Secure, cloud-based, and designed to streamline your firm's operations from intake to resolution.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={onGetStarted} className="btn-primary px-8 py-4 text-lg">
                Get Started Today <ChevronRight size={20} />
              </button>
              <button className="btn-secondary px-8 py-4 text-lg">
                Practice Areas
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-panel p-8 relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-red to-green-accent" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-xl font-bold">Active Cases Overview</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-accent" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "Criminal Defense - Case #001", progress: 78, color: "bg-primary-red" },
                  { label: "Property Dispute - Case #002", progress: 45, color: "bg-green-accent" },
                  { label: "Corporate Litigation - Case #003", progress: 92, color: "bg-blue-500" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-text-muted">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Win Rate</p>
                  <p className="text-2xl font-serif font-bold text-green-accent">94.2%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Active Clients</p>
                  <p className="text-2xl font-serif font-bold">1.2k+</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-red/20 blur-2xl rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-accent/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-primary-red py-4 overflow-hidden border-y border-white/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-white font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                <Scale size={20} /> STANDARDS
              </span>
              <span className="text-white/50">✦</span>
              <span className="text-white font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                <Gavel size={20} /> EFFICIENCY
              </span>
              <span className="text-white/50">✦</span>
              <span className="text-white font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                <Award size={20} /> EXCELLENCE
              </span>
              <span className="text-white/50">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Years of Experience", value: "30+" },
            { label: "Successful Projects", value: "4.7k" },
            { label: "Experienced Lawyers", value: "600+" },
            { label: "Awards Achievement", value: "48+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h4 className="text-4xl md:text-5xl font-serif font-bold mb-2">{stat.value}</h4>
              <p className="text-sm text-text-muted uppercase tracking-widest font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Advanced Legal Support</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              We combine decades of legal expertise with cutting-edge technology to provide unparalleled service to our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Shield} 
              title="Secure Vault" 
              description="AES-256 encrypted document storage with full POPIA and GDPR compliance."
            />
            <FeatureCard 
              icon={Clock} 
              title="Real-time Updates" 
              description="Stay informed with instant notifications on case status and milestone progress."
            />
            <FeatureCard 
              icon={Users} 
              title="Expert Counsel" 
              description="Direct access to a network of over 600 specialized legal professionals."
            />
            <FeatureCard 
              icon={Lock} 
              title="Privileged Comms" 
              description="End-to-end encrypted messaging ensuring absolute lawyer-client privilege."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-serif font-bold mb-8">Take The First Step Today</h2>
          <p className="text-xl text-text-muted mb-12 leading-relaxed">
            Whether it's pursuing a new career path, starting a business, embarking on a personal development journey, or seeking legal assistance.
          </p>
          <button 
            onClick={onGetStarted}
            className="btn-primary px-12 py-5 text-xl mx-auto"
          >
            Get A Consultation <ArrowRight size={24} />
          </button>
        </div>
        
        {/* Background decorative grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Scale size={20} className="text-primary-red" />
            <span className="text-lg font-bold tracking-tight">LawOffice <span className="text-primary-red">Pro</span></span>
          </div>
          <p className="text-text-muted text-sm mb-8">© 2026 LawOffice Pro. All rights reserved. Professional Legal Management Solutions.</p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-text-muted">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
