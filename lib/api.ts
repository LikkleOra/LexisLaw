import { Booking, Matter, MatterStatus } from '@/types';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

// Mock Data for fallback
const MOCK_BOOKINGS: Booking[] = [
  {
    _id: '1',
    client_name: 'Thabo Mbeki',
    client_phone: '0123456789',
    matter_type: 'Civil Litigation',
    preferred_date: '2026-03-18',
    preferred_time: '10:00',
    status: 'pending',
    reference: 'REF-82103',
    created: new Date().toISOString(),
  }
];

const MOCK_MATTERS: Matter[] = [
  {
    _id: '1',
    reference: 'REF-12345',
    name: 'John Doe',
    phone: '+27 12 345 6789',
    matter: 'Civil Litigation',
    date: '2026-03-20',
    attorney: 'Adv. Jabu Mokoena',
    status: 1,
    statusLabel: 'In Progress',
    updated: '2026-03-18',
    next: 'Court Appearance',
  }
];

export const api = {
  // Bookings
  async getBookings(): Promise<Booking[]> {
    if (typeof window === 'undefined') return MOCK_BOOKINGS;
    try {
      const stored = localStorage.getItem('lexislaw_bookings');
      if (stored) return JSON.parse(stored);
      return MOCK_BOOKINGS;
    } catch (e) {
      return MOCK_BOOKINGS;
    }
  },

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    const newBooking: Booking = {
      _id: Math.random().toString(36).substr(2, 9),
      client_name: data.client_name || '',
      client_phone: data.client_phone || '',
      client_email: data.client_email,
      matter_type: data.matter_type || '',
      preferred_date: data.preferred_date || '',
      preferred_time: data.preferred_time || '',
      description: data.description,
      status: 'pending',
      reference: `REF-${Math.floor(Math.random() * 90000) + 10000}`,
      created: new Date().toISOString(),
    };

    const bookings = await this.getBookings();
    if (typeof window !== 'undefined') {
      localStorage.setItem('lexislaw_bookings', JSON.stringify([...bookings, newBooking]));
    }
    return newBooking;
  },

  // Matters
  async getMatters(): Promise<Matter[]> {
    if (typeof window === 'undefined') return MOCK_MATTERS;
    try {
      const stored = localStorage.getItem('lexislaw_matters');
      if (stored) return JSON.parse(stored);
      return MOCK_MATTERS;
    } catch (e) {
      return MOCK_MATTERS;
    }
  },

  async getMatterByReference(ref: string): Promise<Matter | null> {
    const matters = await this.getMatters();
    return matters.find(m => m.reference.toUpperCase() === ref.toUpperCase()) || null;
  },

  async updateMatterStatus(ref: string, status: number, next: string): Promise<void> {
    const matters = await this.getMatters();
    const updated = matters.map(m => {
      if (m.reference === ref) {
        return { 
          ...m, 
          status, 
          next, 
          updated: new Date().toISOString().split('T')[0] 
        };
      }
      return m;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('lexislaw_matters', JSON.stringify(updated));
    }
  }
};
