'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Booking() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page - booking is integrated there
    router.push('/#booking');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}
