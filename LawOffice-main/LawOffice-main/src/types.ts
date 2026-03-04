export interface User {
  id: string;
  email: string;
  role: 'lawyer' | 'client' | 'admin';
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  clientId: string;
  lawyerId: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  deadlineAt: string;
  createdAt: string;
  clientFirstName?: string;
  clientLastName?: string;
}

export interface Document {
  id: string;
  caseId: string;
  uploadedBy: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  visibility: 'LawyerOnly' | 'ClientVisible' | 'Shared';
  isPrivileged: boolean;
  uploadedAt: string;
}

export interface Appointment {
  id: string;
  caseId?: string;
  clientId: string;
  lawyerId: string;
  requestedAt: string;
  confirmedAt: string;
  status: 'Requested' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';
  type: string;
  durationMinutes: number;
  notes: string;
}

export interface Message {
  id: string;
  caseId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface DashboardStats {
  activeCases: number;
  pendingAppts: number;
  totalDocs: number;
  winRate: number;
}
