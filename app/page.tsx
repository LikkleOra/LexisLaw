'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Scale, MessageCircle, Smartphone, Users, Building2, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    matter_type: '',
    preferred_date: '',
    preferred_time: '',
    description: '',
    whatsapp_consent: false,
    popia_consent: false,
  });
  const [bookingResult, setBookingResult] = useState<any>(null);

  const matterTypes = [
    'Family Law — Divorce',
    'Family Law — Custody',
    'Criminal Defence',
    'Civil Litigation',
    'Property Law',
    'Commercial Law',
    'Employment Law',
    'Debt Collection',
    'Other',
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await api.createBooking(formData);
      setBookingResult(result);
      setBookingStep(3);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const startBooking = () => {
    setBookingStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Ticker />
      <Navbar />

      {/* HOME PAGE */}
      {bookingStep === 1 && (
        <div id="homePage" className="page-enter">
          {/* HERO */}
          <section className="hero min-h-[calc(100vh-96px)] lg:grid lg:grid-cols-2 relative overflow-hidden">
            {/* Left */}
            <div className="hero-left p-6 md:p-12 lg:p-20 flex flex-col justify-center lg:border-r-2 border-border relative z-10">
              <div className="reveal">
                <div className="font-mono text-xs font-bold tracking-widest text-red mb-4 md:mb-6 flex items-center gap-3">
                  <span className="hidden sm:block w-10 h-0.5 bg-red"></span>
                  PREMIUM LEGAL SERVICES
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[120px] leading-none tracking-widest text-white mb-2">
                  Justice <span className="text-red block">Simplified.</span>
                </h1>
                <p className="text-grey-light text-sm md:text-base max-w-[420px] mt-4 md:mt-7 mb-6 md:mb-12 leading-7 border-l-[3px] border-green pl-4 md:pl-5">
                  Providing expert legal counsel for individuals and businesses. Modern solutions for
                  complex legal challenges in South Africa.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-0">
                  <button onClick={startBooking} className="btn-primary text-center">
                    Start Consultation
                  </button>
                  <Link href="/tracker" className="btn-secondary text-center">
                    Track My Matter
                  </Link>
                </div>
                <div className="flex gap-6 md:gap-10 mt-10 md:pt-10 border-t border-border flex-wrap">
                  <div>
                    <div className="font-display text-3xl md:text-5xl text-white leading-none">15+<span className="text-red">Years</span></div>
                    <div className="font-mono text-[10px] tracking-widest text-grey uppercase mt-1">Experience</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl md:text-5xl text-white leading-none">500+<span className="text-green">Cases</span></div>
                    <div className="font-mono text-[10px] tracking-widest text-grey uppercase mt-1">Resolved</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl md:text-5xl text-white leading-none">24/7<span className="text-red">Support</span></div>
                    <div className="font-mono text-[10px] tracking-widest text-grey uppercase mt-1">Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Hidden on mobile */}
            <div className="hidden lg:flex hero-right relative overflow-hidden bg-card items-center justify-center">
              <div className="font-display text-[280px] text-card2 leading-none absolute right-[-20px] bottom-[-20px] select-none tracking-[-10px]">
                LAW
              </div>
              <div className="relative z-10 bg-black3 border-2 border-border-strong border-l-4 border-l-red p-10 w-[340px] shadow-[8px_8px_0_rgba(230,51,41,0.2)]">
                <div className="font-mono text-[10px] tracking-widest text-red uppercase mb-5">Why Choose Us</div>
                <div className="flex items-start gap-4 py-4 border-b border-border">
                  <div className="w-9 h-9 bg-red-glow border border-red flex items-center justify-center text-lg flex-shrink-0"><Scale className="w-5 h-5 text-red" /></div>
                  <div className="text-sm text-grey-light leading-6">
                    <strong className="block text-white text-sm mb-0.5">Experienced Attorneys</strong>
                    Over 15 years of combined legal expertise
                  </div>
                </div>
                <div className="flex items-start gap-4 py-4 border-b border-border">
                  <div className="w-9 h-9 bg-red-glow border border-red flex items-center justify-center text-lg flex-shrink-0"><MessageCircle className="w-5 h-5 text-red" /></div>
                  <div className="text-sm text-grey-light leading-6">
                    <strong className="block text-white text-sm mb-0.5">WhatsApp Updates</strong>
                    Real-time case status notifications
                  </div>
                </div>
                <div className="flex items-start gap-4 py-4">
                  <div className="w-9 h-9 bg-red-glow border border-red flex items-center justify-center text-lg flex-shrink-0"><Smartphone className="w-5 h-5 text-red" /></div>
                  <div className="text-sm text-grey-light leading-6">
                    <strong className="block text-white text-sm mb-0.5">Online Booking</strong>
                    Book consultations 24/7 from anywhere
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="py-12 md:py-25 px-4 md:px-15">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-15 pb-6 border-b-2 border-border gap-4">
              <h2 className="font-display text-3xl md:text-5xl lg:text-[80px] leading-none tracking-widest">
                Our <span className="text-red">Services</span>
              </h2>
              <span className="font-mono text-xs font-bold tracking-widest text-grey uppercase">01 — 04</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-border-strong">
              {[
                { num: '01', icon: <Users className="w-6 h-6" />, name: 'Family Law', desc: 'Divorce, custody disputes, and family mediation services.' },
                { num: '02', icon: <Scale className="w-6 h-6" />, name: 'Criminal Defence', desc: 'Expert defence for all criminal charges and bail applications.' },
                { num: '03', icon: <Building2 className="w-6 h-6" />, name: 'Commercial Law', desc: 'Business contracts, disputes, and corporate legal matters.' },
                { num: '04', icon: <HomeIcon className="w-6 h-6" />, name: 'Property Law', desc: 'Property transfers, disputes, and real estate transactions.' },
              ].map((service, i) => (
                <div key={i} className="p-6 md:p-9 border-r border-b border-border-strong bg-card hover:bg-card2 transition-colors duration-250 cursor-pointer group relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                  <div className="font-mono text-xs font-bold text-grey tracking-widest mb-3 md:mb-5 transition-colors group-hover:text-red">{service.num}</div>
                  <div className="text-2xl md:text-[28px] mb-3">{service.icon}</div>
                  <div className="font-display text-xl md:text-[28px] tracking-widest text-white mb-2 md:mb-3">{service.name}</div>
                  <div className="text-sm text-grey leading-6">{service.desc}</div>
                  <div className="text-red mt-3 md:mt-5 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">→</div>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="py-12 md:py-25 px-4 md:px-15 bg-black">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
              <div>
                <div className="font-mono text-xs font-bold tracking-widest text-green uppercase mb-5">About Us</div>
                <h2 className="font-display text-3xl md:text-[56px] leading-none tracking-widest text-white mb-5 md:mb-7">Your Trusted <br/>Legal Partner</h2>
                <p className="text-grey-light leading-[1.8] text-sm md:text-base mb-5">
                  Mokoena Legal Services has been providing exceptional legal representation to individuals 
                  and businesses throughout South Africa since 2008. Our team of experienced attorneys 
                  is committed to delivering personalized, effective solutions for all your legal needs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-10">
                  <div className="p-4 md:p-5 bg-card border border-border border-l-2 border-l-green">
                    <div className="font-mono text-xs font-bold tracking-widest text-green uppercase mb-1.5">Mission</div>
                    <div className="text-sm text-grey leading-5">To provide accessible, high-quality legal services with integrity.</div>
                  </div>
                  <div className="p-4 md:p-5 bg-card border border-border border-l-2 border-l-red">
                    <div className="font-mono text-xs font-bold tracking-widest text-red uppercase mb-1.5">Vision</div>
                    <div className="text-sm text-grey leading-5">To be the most trusted legal partner in South Africa.</div>
                  </div>
                </div>
              </div>
              <div className="bg-card border-2 border-border-strong border-t-4 border-t-red p-6 md:p-12 relative">
                <div className="absolute bottom-[-8px] right-[-8px] w-full h-full border-2 border-red z-[-1] opacity-30"></div>
                <div className="flex items-center gap-4 md:gap-5 py-4 md:py-5 border-b border-border">
                  <div className="w-12 h-12 md:w-13 md:h-13 bg-card2 border-2 border-red flex items-center justify-center font-display text-xl md:text-2xl text-red flex-shrink-0">JM</div>
                  <div>
                    <div className="font-semibold text-base text-white">Adv. Jabu Mokoena</div>
                    <div className="font-mono text-xs text-grey tracking-widest">Senior Attorney</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-5 py-4 md:py-5 border-b border-border">
                  <div className="w-12 h-12 md:w-13 md:h-13 bg-card2 border-2 border-grey flex items-center justify-center font-display text-xl md:text-2xl text-grey flex-shrink-0">TN</div>
                  <div>
                    <div className="font-semibold text-base text-white">Adv. Thabo Nkosi</div>
                    <div className="font-mono text-xs text-grey tracking-widest">Family Law Specialist</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-5 py-4 md:py-5">
                  <div className="w-12 h-12 md:w-13 md:h-13 bg-card2 border-2 border-grey flex items-center justify-center font-display text-xl md:text-2xl text-grey flex-shrink-0">NP</div>
                  <div>
                    <div className="font-semibold text-base text-white">Adv. Nomsa Pillay</div>
                    <div className="font-mono text-xs text-grey tracking-widest">Criminal Defence</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-red px-4 md:px-15 py-10 md:py-15 flex flex-col md:flex-row items-center justify-between gap-6 border-t-4 border-b-4 border-red-dark">
            <div className="font-display text-2xl md:text-[52px] tracking-widest leading-none text-white text-center md:text-left">
              Ready to discuss <span className="text-black">your case?</span>
            </div>
            <button onClick={startBooking} className="bg-black text-white font-mono text-xs font-bold tracking-widest uppercase border-2 border-white px-6 md:px-10 py-3 md:py-4 shadow-[5px_5px_0_rgba(0,0,0,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-all whitespace-nowrap">
              Book Consultation
            </button>
          </section>

          <Footer />
        </div>
      )}

      {/* BOOKING PAGE */}
      {bookingStep === 2 && (
        <div id="bookingPage" className="py-10 md:py-20 px-4 md:px-15 min-h-screen page-enter">
          <div className="mb-10 md:mb-15">
            <div className="font-mono text-xs font-bold tracking-widest text-red uppercase mb-4">Book Consultation</div>
            <h1 className="font-display text-3xl md:text-[56px] lg:text-[96px] leading-none tracking-widest">Schedule Your <span className="text-red">Appointment</span></h1>
          </div>

          {/* Progress */}
          <div className="flex flex-wrap mb-10 md:mb-15 border-2 border-border-strong overflow-hidden">
            {['Select Service', 'Your Details', 'Confirmation'].map((step, i) => (
              <div key={i} className={`flex-1 p-3 min-w-[120px] font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2 md:gap-3 ${i + 1 === bookingStep ? 'bg-red text-white' : i + 1 < bookingStep ? 'bg-card2 text-green' : 'bg-card text-grey'}`}>
                <span className="w-5 h-5 md:w-6 md:h-6 border-2 border-current flex items-center justify-center text-xs flex-shrink-0">
                  {i + 1 < bookingStep ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{step}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 md:gap-10">
            {/* Form */}
            <div className="bg-card border-2 border-border-strong border-t-4 border-t-red p-6 md:p-12">
              <form onSubmit={handleSubmit}>
                <h3 className="font-display text-2xl md:text-3xl tracking-widest text-white mb-6 md:mb-9 pb-4 md:pb-5 border-b border-border">Your Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <div>
                    <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="+27 82 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <div>
                    <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Matter Type *</label>
                    <select
                      required
                      className="form-select"
                      value={formData.matter_type}
                      onChange={(e) => setFormData({ ...formData, matter_type: e.target.value })}
                    >
                      <option value="">Select a service...</option>
                      {matterTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Preferred Time</label>
                  <select
                    className="form-select"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  >
                    <option value="">Select a time...</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="font-mono text-xs font-bold tracking-widest uppercase text-red mb-2 md:mb-2.5 block">Brief Description</label>
                  <textarea
                    className="form-textarea min-h-[100px] md:min-h-[120px]"
                    placeholder="Describe your legal matter..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="mb-6 space-y-3">
                  <label className="flex items-start gap-3 text-sm text-grey-light cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-green mt-0.5"
                      checked={formData.whatsapp_consent}
                      onChange={(e) => setFormData({ ...formData, whatsapp_consent: e.target.checked })}
                    />
                    Send me updates via WhatsApp
                  </label>
                  <label className="flex items-start gap-3 text-sm text-grey-light cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 accent-green mt-0.5"
                      checked={formData.popia_consent}
                      onChange={(e) => setFormData({ ...formData, popia_consent: e.target.checked })}
                    />
                    I consent to the processing of my personal data in terms of POPIA *
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full mt-3">
                  Submit Booking
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="bg-card border border-border-strong p-5 md:p-7">
                <div className="font-mono text-xs font-bold tracking-widest text-green uppercase mb-4 md:mb-5 pb-3 border-b border-border">How It Works</div>
                {[
                  { num: '1', title: 'Submit Details', desc: 'Fill out the booking form with your case information.' },
                  { num: '2', title: 'Receive Confirmation', desc: 'Get instant WhatsApp confirmation with your reference number.' },
                  { num: '3', title: 'Attorney Review', desc: 'Our team will contact you within 24 hours.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-3 md:gap-3.5 mb-3 md:4">
                    <div className="w-6 h-6 md:w-7 md:h-7 bg-red text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">{step.num}</div>
                    <div className="text-sm text-grey-light leading-5">
                      <strong className="block text-white text-sm mb-0.5">{step.title}</strong>
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#075E54] border-2 border-[#128C7E] p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <MessageCircle className="w-8 h-8 text-white" />
                <div>
                  <div className="font-bold text-white text-sm md:text-base mb-1">WhatsApp Us</div>
                  <div className="text-white/70 text-xs md:text-sm">Get instant updates on your case</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION */}
      {bookingStep === 3 && bookingResult && (
        <div className="flex min-h-screen bg-black flex-col items-center justify-center py-10 md:py-20 px-4 md:px-10 text-center page-enter">
          <div className="w-20 h-20 md:w-25 md:h-25 bg-green flex items-center justify-center text-4xl md:text-5xl mb-6 md:mb-8 scale-0 animate-[scaleIn_0.5s_0.2s_forwards]">
            ✓
          </div>
          <h1 className="font-display text-3xl md:text-[72px] tracking-widest text-white mb-2">Booking <span className="text-green">Confirmed!</span></h1>
          <div className="font-mono text-xl md:text-2xl font-bold text-red bg-card border-2 border-red px-6 md:px-10 py-3 md:py-4 inline-block my-4 md:5 tracking-widest">
            {bookingResult.reference}
          </div>
          <p className="text-grey-light text-sm md:text-base max-w-[500px] mx-auto leading-7 mb-4">
            Thank you, {bookingResult.name}. Your consultation request has been received. 
            We'll contact you shortly to confirm your appointment.
          </p>
          <div className="bg-[#075E54] border-2 border-[#25D366] px-6 md:px-8 py-2.5 md:py-3.5 text-white text-sm inline-flex items-center gap-2 my-4">
            <MessageCircle className="w-4 h-4" />
            Check WhatsApp for confirmation details
          </div>
          <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 flex-col sm:flex-row w-full sm:w-auto">
            <Link href="/tracker" className="btn-secondary text-center">
              Track My Matter
            </Link>
            <button onClick={() => { setBookingStep(1); setBookingResult(null); }} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
