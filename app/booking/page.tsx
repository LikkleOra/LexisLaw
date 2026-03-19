'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, User, FileText, Smartphone } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleNext = () => {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await api.createBooking(formData);
      setBookingResult(result);
      setStep(4); // Move to confirmation
    } catch (error) {
      console.error('Booking failed:', error);
      // Ideally show error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-primary-black text-black selection:bg-accent-red selection:text-black">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-6 md:px-12 py-24 min-h-[80vh]">
        {/* Progress Header */}
        <div className="mb-16">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
            <span>Step {step < 4 ? `0${step}` : '04'} / 04</span>
            <span>{step === 1 ? 'Service' : step === 2 ? 'Details' : step === 3 ? 'Schedule' : 'Done'}</span>
          </div>
          <div className="w-full h-1 bg-secondary-grey">
            <div 
              className="h-full bg-accent-red transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl mb-8 leading-none">
              Select Your<br/>
              <span className="text-text-muted">Legal Matter</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {matterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => { updateField('matter_type', type); handleNext(); }}
                  className={`p-6 text-left border hover:border-accent-red hover:bg-secondary-grey transition-all duration-200 group flex items-center justify-between ${formData.matter_type === type ? 'border-accent-red bg-secondary-grey' : 'border-border-strong bg-primary-black'}`}
                >
                  <span className={`font-display text-xl ${formData.matter_type === type ? 'text-black' : 'text-text-muted group-hover:text-black'}`}>
                    {type}
                  </span>
                  {formData.matter_type === type && <Check className="text-accent-red w-6 h-6" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL DETAILS */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl mb-8 leading-none">
              Your<br/>
              <span className="text-text-muted">Information</span>
            </h1>

            <form className="space-y-8 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="font-mono text-xs text-accent-red uppercase tracking-widest mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input text-lg py-4 border-b-2 border-t-0 border-x-0 bg-transparent focus:ring-0 px-0"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>
                <div className="group">
                  <label className="font-mono text-xs text-accent-red uppercase tracking-widest mb-2 block">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input text-lg py-4 border-b-2 border-t-0 border-x-0 bg-transparent focus:ring-0 px-0"
                    placeholder="+27 82 123 4567"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="font-mono text-xs text-accent-red uppercase tracking-widest mb-2 block">Email Address</label>
                <input
                  type="email"
                  className="form-input text-lg py-4 border-b-2 border-t-0 border-x-0 bg-transparent focus:ring-0 px-0"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="group">
                <label className="font-mono text-xs text-accent-red uppercase tracking-widest mb-2 block">Case Description</label>
                <textarea
                  className="form-textarea text-lg py-4 border-b-2 border-t-0 border-x-0 bg-transparent focus:ring-0 px-0 min-h-[150px]"
                  placeholder="Briefly describe your legal matter..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <div className="pt-8 flex justify-between items-center">
                <button type="button" onClick={handleBack} className="btn-secondary px-8 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  type="button" 
                  onClick={handleNext} 
                  disabled={!formData.name || !formData.phone}
                  className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl mb-8 leading-none">
              Preferred<br/>
              <span className="text-text-muted">Schedule</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="font-mono text-xs text-accent-red uppercase tracking-widest mb-4 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="form-input text-lg"
                    value={formData.preferred_date}
                    onChange={(e) => updateField('preferred_date', e.target.value)}
                  />
                </div>
                <div className="group">
                  <label className="font-mono text-xs text-accent-red uppercase tracking-widest mb-4 block flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time
                  </label>
                  <select
                    className="form-select text-lg"
                    value={formData.preferred_time}
                    onChange={(e) => updateField('preferred_time', e.target.value)}
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
              </div>

              <div className="space-y-6 pt-4 border-t border-border-strong">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${formData.whatsapp_consent ? 'bg-accent-red border-accent-red' : 'border-text-muted'}`}>
                    {formData.whatsapp_consent && <Check className="w-4 h-4 text-black" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.whatsapp_consent}
                    onChange={(e) => updateField('whatsapp_consent', e.target.checked)}
                  />
                  <span className="text-text-muted group-hover:text-black transition-colors text-sm">
                    Receive case updates and appointment reminders via WhatsApp
                  </span>
                </label>
                
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${formData.popia_consent ? 'bg-accent-red border-accent-red' : 'border-text-muted'}`}>
                    {formData.popia_consent && <Check className="w-4 h-4 text-black" />}
                  </div>
                  <input
                    type="checkbox"
                    required
                    className="hidden"
                    checked={formData.popia_consent}
                    onChange={(e) => updateField('popia_consent', e.target.checked)}
                  />
                  <span className="text-text-muted group-hover:text-black transition-colors text-sm">
                    I consent to the processing of my personal data in terms of POPIA *
                  </span>
                </label>
              </div>

              <div className="pt-8 flex justify-between items-center">
                <button type="button" onClick={handleBack} className="btn-secondary px-8 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  type="submit" 
                  disabled={!formData.preferred_date || !formData.popia_consent || isSubmitting}
                  className="btn-primary px-8 flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && bookingResult && (
          <div className="animate-fade-in-up text-center max-w-2xl mx-auto py-12">
            <div className="w-24 h-24 bg-accent-red mx-auto mb-8 flex items-center justify-center">
              <Check className="w-12 h-12 text-black" />
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl mb-6 leading-none">
              Booking<br/>Confirmed
            </h1>
            
            <p className="text-text-muted text-lg mb-8">
              Thank you, {bookingResult.name}. Your consultation request has been received.
            </p>
            
            <div className="bg-secondary-grey border border-border-strong p-8 mb-12 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent-red"></div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-mono text-xs text-text-muted uppercase mb-1">Reference</div>
                  <div className="font-display text-2xl text-black">{bookingResult.reference}</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-text-muted uppercase mb-1">Date</div>
                  <div className="font-display text-2xl text-black">{formData.preferred_date}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                 onClick={() => router.push('/tracker')}
                 className="btn-secondary"
               >
                 Track My Matter
               </button>
               <button 
                 onClick={() => router.push('/')}
                 className="btn-primary"
               >
                 Back to Home
               </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
