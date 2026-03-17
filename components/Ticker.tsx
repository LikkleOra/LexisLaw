'use client';

export default function Ticker() {
  const items = [
    'EXPERT LEGAL COUNSEL',
    'FAMILY LAW',
    'COMMERCIAL DISPUTES',
    'CRIMINAL DEFENCE',
    'CIVIL LITIGATION',
    'WHATSAPP CONFIRMATIONS',
    'MATTER TRACKING',
    'BOOK ONLINE 24/7',
    'TRUSTED SINCE 2008',
  ];

  return (
    <div className="bg-red overflow-hidden h-8 flex items-center border-b-2 border-red-dark">
      <div className="ticker-inner">
        {items.map((item, i) => (
          <span key={i} className="font-mono text-xs font-bold tracking-widest text-white px-10 opacity-90">
            {item}
            <span className="text-white/40 px-2">◆</span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <span key={`dup-${i}`} className="font-mono text-xs font-bold tracking-widest text-white px-10 opacity-90">
            {item}
            <span className="text-white/40 px-2">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
