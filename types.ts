export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface CaseEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'update' | 'document' | 'hearing' | 'milestone';
}

export interface Party {
  id: string;
  name: string;
  role: string;
  contact: string;
  verified: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'required';
  date: string;
}

export interface Matter {
  _id: string;
  reference: string;
  name: string;
  phone: string;
  email?: string;
  matter: string;
  date: string;
  attorney: string;
  status: number;
  statusLabel: string;
  updated: string;
  next: string;
  wa?: string;
  caseHistory?: CaseEvent[];
  parties?: Party[];
  documents?: Document[];
}

export interface Booking {
  _id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  matter_type: string;
  preferred_date: string;
  preferred_time: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'resolved';
  reference: string;
  created: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export enum MatterStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  AWAITING_DOCS = 2,
  HEARING = 3,
  RESOLVED = 4,
}

export const statusLabels: Record<number, string> = {
  [MatterStatus.PENDING]: 'Pending',
  [MatterStatus.IN_PROGRESS]: 'In Progress',
  [MatterStatus.AWAITING_DOCS]: 'Awaiting Docs',
  [MatterStatus.HEARING]: 'Hearing',
  [MatterStatus.RESOLVED]: 'Resolved',
};
