'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { LucideCalendar, LucideUser, LucideBriefcase, LucideCheckCircle2, LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { useMutation } from 'convex/react';

const BookingFlow: React.FC = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    matterType: '',
    date: '',
    time: '',
    description: '',
  });
  const [realRef, setRealRef] = useState('');
  const createBooking = useMutation("functions:createBooking" as any);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && matterOptions.some(m => m.value === serviceParam)) {
      setFormData(prev => ({ ...prev, matterType: serviceParam }));
      // Manual scroll fallback
      setTimeout(() => {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const matterOptions = [
    { value: 'civil', label: 'Civil Litigation' },
    { value: 'property', label: 'Real Estate' },
    { value: 'migration', label: 'Migration Law' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Persist to Back Office (Convex)
      const result = await createBooking({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        matter_type: formData.matterType,
        preferred_date: formData.date,
        preferred_time: formData.time,
        description: formData.description,
        whatsapp_consent: true, // Defaulting to true for now
        popia_consent: true,    // Defaulting to true for now
      });

      setRealRef(result.reference);

      // 2. Prepare WhatsApp message
      const serviceName = matterOptions.find(m => m.value === formData.matterType)?.label || formData.matterType;
      const msg = `
*MOKOENA LEGAL SERVICES BOOKING* ⚖️

*Service:* ${serviceName}
*Date:* ${result.preferred_date}
*Time:* ${result.preferred_time}
*Client:* ${result.name}
*Reference:* ${result.reference}

_Sent from Website Booking System_
`.trim();

      const whatsappUrl = `https://wa.me/27734334784?text=${encodeURIComponent(msg)}`;
      
      // 3. Redirect and move to success step
      window.location.href = whatsappUrl;
      nextStep();
    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an error processing your booking. Please try again.");
    }
  };

  const steps = [
    { id: 1, name: 'Identity', icon: LucideUser },
    { id: 2, name: 'Matter', icon: LucideBriefcase },
    { id: 3, name: 'Schedule', icon: LucideCalendar },
    { id: 4, name: 'Confirm', icon: LucideCheckCircle2 },
  ];

  return (
    <section id="booking" className="py-32 px-6 bg-white border-t-2 border-black/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="font-mono text-lexis-red text-xs uppercase tracking-[0.3em] font-bold">Secure Your Consultation</span>
          <h2 className="text-5xl md:text-7xl font-display tracking-tighter text-black">
            START YOUR <span className="text-black/30">STRATEGY.</span>
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 -translate-y-1/2 -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-lexis-red -translate-y-1/2 -z-10 transition-all duration-500" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3">
              <div 
                className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 ${
                  step >= s.id ? 'bg-lexis-red border-lexis-red text-white shadow-brutal-red' : 'bg-[#f8f8f8] border-black/10 text-black/40'
                }`}
              >
                <s.icon size={20} />
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${step >= s.id ? 'text-black' : 'text-black/30'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <Card shadow className="bg-[#f8f8f8] border-black/20 p-8 md:p-12">
          {step < 4 ? (
            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-8">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-page-in">
                  <Input 
                    label="Full Name" 
                    placeholder="Enter your legal name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+27 (00) 000-0000" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="Email Address" 
                      type="email" 
                      placeholder="email@example.com" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-page-in">
                  <Select 
                    label="Matter Type" 
                    placeholder="Select the type of legal service"
                    options={matterOptions}
                    value={formData.matterType}
                    onChange={(e) => setFormData({...formData, matterType: e.target.value})}
                    required
                  />
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest text-black/60 font-bold">Brief Description</label>
                    <textarea 
                      className="w-full bg-white border-2 border-black/10 text-black px-4 py-3 outline-none transition-all duration-200 font-mono text-sm focus:border-lexis-red focus:shadow-brutal-red min-h-[120px]"
                      placeholder="Describe your situation briefly..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-page-in">
                  <Input 
                    label="Preferred Date" 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                  <div className="space-y-4">
                    <label className="block font-mono text-xs uppercase tracking-widest text-[#333333]">Preferred Time</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({...formData, time})}
                          className={`py-3 px-4 font-mono text-xs border-2 transition-all ${
                            formData.time === time 
                              ? 'bg-lexis-red border-lexis-red text-white shadow-brutal-red' 
                              : 'bg-white border-black/10 text-black/60 hover:border-black/30 font-bold'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8 border-t border-black/5">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={prevStep} 
                  disabled={step === 1}
                  className={step === 1 ? 'opacity-0' : ''}
                >
                  <LucideChevronLeft className="mr-2" size={16} /> Back
                </Button>
                <Button type="submit" variant="primary">
                  {step === 3 ? 'Confirm Booking' : 'Next Step'} <LucideChevronRight className="ml-2" size={16} />
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 space-y-8 animate-slam-in">
              <div className="w-24 h-24 bg-lexis-green flex items-center justify-center text-white mx-auto shadow-brutal-green">
                <LucideCheckCircle2 size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-display tracking-tight text-black">BOOKING INITIATED.</h3>
                <p className="font-mono text-sm text-black max-w-md mx-auto leading-relaxed">
                  Your strategy session request has been received. Your reference number is <span className="text-lexis-red font-bold">{realRef || 'REF-PENDING'}</span>.
                </p>
                <div className="mt-6 p-4 border border-lexis-red/30 bg-lexis-red/5">
                  <p className="font-mono text-sm text-lexis-red font-bold uppercase mb-2">Important Next Step:</p>
                  <p className="font-mono text-xs text-black leading-relaxed">
                    If WhatsApp didn't open, please message our admin at <span className="text-black font-bold underline cursor-pointer" onClick={() => window.open(`https://wa.me/27734334784?text=${encodeURIComponent('Hello, I have a booking with reference ' + realRef)}`)}>073 433 4784</span> to confirm.
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setStep(1)} className="mt-8">
                Done
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default BookingFlow;
