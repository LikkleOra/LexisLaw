'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LucideMessageSquare, LucideX, LucideSend, LucideLoader2 } from 'lucide-react';
import Button from '../ui/Button';
import { Message } from '@/types';

const LegalAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello. I am the Mokoena Legal Digital Assistant. How can I assist you with your legal inquiry today?',
      timestamp: new Date(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock response logic
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Based on your inquiry, I recommend scheduling a consultation with one of our specialists. Our attorneys can provide specific advice tailored to your situation.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-lexis-red text-black flex items-center justify-center shadow-brutal-red transition-all duration-300 z-[100] hover:-translate-x-1 hover:-translate-y-1 ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
      >
        {isOpen ? <LucideX size={32} /> : <LucideMessageSquare size={32} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-white border-2 border-black/10 flex flex-col shadow-brutal-lg z-[100] animate-page-in">
          {/* Header */}
          <div className="bg-lexis-red p-6 flex justify-between items-center border-b-2 border-lexis-black shadow-brutal">
            <div className="flex items-center gap-3">
              <LucideMessageSquare className="text-black" size={20} />
              <h4 className="font-display text-lg tracking-tight text-black uppercase">Legal Assistant</h4>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-lexis-green animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/70">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 font-mono text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-lexis-red text-black border-2 border-lexis-red shadow-brutal-red' 
                      : 'bg-white border-2 border-black text-black'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-black/20 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 text-black font-mono text-[10px] uppercase tracking-widest font-bold">
                <LucideLoader2 className="animate-spin" size={14} /> Assistant is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 border-t-2 border-black/5 bg-black/40">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Type your inquiry..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white border-2 border-black text-black px-4 py-3 outline-none transition-all duration-200 font-mono text-xs focus:border-lexis-red"
                style={{ borderRadius: 0 }}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-12 h-12 bg-lexis-black/5 flex items-center justify-center border-2 border-black/5 hover:border-lexis-red hover:text-lexis-red transition-all"
              >
                <LucideSend size={20} />
              </button>
            </div>
            <p className="mt-4 font-mono text-[8px] uppercase tracking-tighter text-black/20 text-center">
              AI-generated responses. Consult an attorney for legal advice.
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default LegalAssistant;
