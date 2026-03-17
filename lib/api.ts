// Convex API Client for Next.js
// Uses Convex's built-in HTTP API

const CONVEX_URL = 'https://striped-meadowlark-10.convex.cloud';

// LocalStorage keys
const STORAGE_KEYS = {
  bookings: 'mokoena_bookings',
  matters: 'mokoena_matters',
  clients: 'mokoena_clients',
};

function getFromStorage(key: string) {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(key: string, data: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore
  }
}

function generateReference() {
  return 'REF-' + String(Math.floor(10000 + Math.random() * 89999));
}

function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'PENDING',
    in_progress: 'IN PROGRESS',
    awaiting_docs: 'AWAITING DOCS',
    hearing: 'HEARING SCHEDULED',
    resolved: 'RESOLVED',
  };
  return labels[status] || 'PENDING';
}

function getStatusNumber(status: string) {
  const map: Record<string, number> = {
    pending: 0,
    in_progress: 1,
    awaiting_docs: 2,
    hearing: 3,
    resolved: 4,
  };
  return map[status] || 0;
}

function formatDate(timestampOrDate: any) {
  if (!timestampOrDate) return '—';
  const date = typeof timestampOrDate === 'number' ? new Date(timestampOrDate) : new Date(timestampOrDate);
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

// API functions
async function convexQuery(name: string, args: any = {}) {
  const url = `${CONVEX_URL}/api/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Convex query failed: ${res.status}`);
  }
  const data = await res.json();
  return data.value;
}

async function convexMutation(name: string, args: any = {}) {
  const url = `${CONVEX_URL}/api/mutation`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: name, args }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Convex mutation failed: ${res.status}`);
  }
  const data = await res.json();
  return data.value;
}

// LocalStorage fallback functions
function localCreateBooking(data: any) {
  const bookings = getFromStorage(STORAGE_KEYS.bookings);
  const matters = getFromStorage(STORAGE_KEYS.matters);
  const clients = getFromStorage(STORAGE_KEYS.clients);

  const normalizedPhone = data.phone.replace(/\s/g, '').replace(/^0/, '+27');

  let client = clients.find((c: any) => c.phone === normalizedPhone);
  if (!client) {
    client = {
      _id: generateId(),
      name: data.name,
      phone: normalizedPhone,
      email: data.email || null,
      whatsapp_consent: data.whatsapp_consent,
      popia_consent: data.popia_consent,
      created: new Date().toISOString(),
    };
    clients.push(client);
    saveToStorage(STORAGE_KEYS.clients, clients);
  }

  const reference = generateReference();
  const booking = {
    _id: generateId(),
    client_id: client._id,
    name: data.name,
    phone: normalizedPhone,
    email: data.email,
    matter_type: data.matter_type,
    preferred_date: data.preferred_date,
    preferred_time: data.preferred_time,
    description: data.description || null,
    status: 'pending',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    reference,
  };
  bookings.push(booking);
  saveToStorage(STORAGE_KEYS.bookings, bookings);

  const matter = {
    _id: generateId(),
    booking_id: booking._id,
    client_id: client._id,
    reference,
    attorney_id: null,
    status: 'pending',
    next_action: 'Awaiting initial consultation',
    created: new Date().toISOString(),
  };
  matters.push(matter);
  saveToStorage(STORAGE_KEYS.matters, matters);

  return {
    success: true,
    reference,
    booking_id: booking._id,
    client_phone: normalizedPhone.replace('+', ''),
    admin_phone: '2785946689',
    name: data.name,
    matter_type: data.matter_type,
    preferred_date: data.preferred_date,
    preferred_time: data.preferred_time,
    description: data.description,
    email: data.email,
  };
}

function localGetMatterByReference(ref: string) {
  const matters = getFromStorage(STORAGE_KEYS.matters);
  const bookings = getFromStorage(STORAGE_KEYS.bookings);
  const clients = getFromStorage(STORAGE_KEYS.clients);

  const matter = matters.find((m: any) => m.reference === ref);
  if (!matter) return null;

  const booking = bookings.find((b: any) => b._id === matter.booking_id);
  const client = clients.find((c: any) => c._id === matter.client_id);

  if (!booking) return null;

  return {
    reference: matter.reference,
    name: client?.name || booking.name,
    phone: client?.phone || booking.phone,
    email: client?.email || booking.email,
    matter: booking.matter_type,
    date: `${formatDate(booking.preferred_date)}, ${booking.preferred_time}`,
    attorney: 'Adv. Jabu Mokoena',
    updated: formatDate(matter._creationTime || matter.created),
    next: matter.next_action || 'Awaiting initial consultation',
    status: getStatusNumber(matter.status),
    statusLabel: getStatusLabel(matter.status),
    statusClass: 'status-' + matter.status,
    wa: client?.phone || booking.phone,
  };
}

function localGetBookings() {
  const bookings = getFromStorage(STORAGE_KEYS.bookings);
  const matters = getFromStorage(STORAGE_KEYS.matters);
  const clients = getFromStorage(STORAGE_KEYS.clients);

  return bookings.map((booking: any) => {
    const client = clients.find((c: any) => c._id === booking.client_id);
    const matter = matters.find((m: any) => m.booking_id === booking._id);

    return {
      _id: booking._id,
      reference: matter?.reference || booking.reference || '—',
      client_name: client?.name || booking.name || 'Unknown',
      client_phone: client?.phone || booking.phone || '—',
      client_email: client?.email || booking.email,
      matter_type: booking.matter_type,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
      status: booking.status,
      attorney_name: matter?.attorney_id ? 'Adv. Jabu Mokoena' : null,
    };
  });
}

function localGetMatters() {
  const matters = getFromStorage(STORAGE_KEYS.matters);
  const bookings = getFromStorage(STORAGE_KEYS.bookings);
  const clients = getFromStorage(STORAGE_KEYS.clients);

  return matters.map((matter: any) => {
    const booking = bookings.find((b: any) => b._id === matter.booking_id);
    const client = clients.find((c: any) => c._id === matter.client_id);

    return {
      _id: matter._id,
      reference: matter.reference,
      name: client?.name || booking?.name || 'Unknown',
      matter: booking?.matter_type || 'General',
      attorney: 'Adv. Jabu Mokoena',
      status: getStatusNumber(matter.status),
      statusLabel: getStatusLabel(matter.status),
      next: matter.next_action || 'Pending review',
    };
  });
}

function localUpdateMatterStatus(reference: string, statusNum: number, next_action: string, attorney_id: any) {
  const matters = getFromStorage(STORAGE_KEYS.matters);
  const statusMap = ['pending', 'in_progress', 'awaiting_docs', 'hearing', 'resolved'];

  const matterIndex = matters.findIndex((m: any) => m.reference === reference);
  if (matterIndex === -1) throw new Error('Matter not found');

  matters[matterIndex].status = statusMap[statusNum] || 'pending';
  matters[matterIndex].next_action = next_action;
  matters[matterIndex].attorney_id = attorney_id;
  matters[matterIndex].updated = new Date().toISOString();

  saveToStorage(STORAGE_KEYS.matters, matters);
  return { success: true };
}

function localApproveBooking(id: string) {
  const bookings = getFromStorage(STORAGE_KEYS.bookings);
  const matters = getFromStorage(STORAGE_KEYS.matters);

  const bookingIndex = bookings.findIndex((b: any) => b._id === id);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = 'confirmed';
    bookings[bookingIndex].updated = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.bookings, bookings);
  }

  const matterIndex = matters.findIndex((m: any) => m.booking_id === id);
  if (matterIndex !== -1) {
    matters[matterIndex].status = 'in_progress';
    matters[matterIndex].next_action = 'Consultation approved';
    matters[matterIndex].updated = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.matters, matters);
  }

  return { success: true };
}

function localRejectBooking(id: string) {
  const bookings = getFromStorage(STORAGE_KEYS.bookings);
  const matters = getFromStorage(STORAGE_KEYS.matters);

  const bookingIndex = bookings.findIndex((b: any) => b._id === id);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = 'rejected';
    bookings[bookingIndex].updated = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.bookings, bookings);
  }

  const matterIndices = matters.map((m: any, i: number) => m.booking_id === id ? i : -1).filter((i: number) => i !== -1);
  matterIndices.reverse().forEach((i: number) => matters.splice(i, 1));
  saveToStorage(STORAGE_KEYS.matters, matters);

  return { success: true };
}

function localGetAttorneys() {
  return [
    {
      _id: 'att_1',
      name: 'Adv. Jabu Mokoena',
      email: 'jabu.legal@gmail.com',
      initials: 'JM',
      specialty: 'Property Law, Migration Law & Debt Collection',
      activeCases: localGetMatters().filter((m: any) => m.status < 4).length,
      resolvedCases: localGetMatters().filter((m: any) => m.status === 4).length,
      specializations: ['Property Law', 'Migration Law', 'Debt Collection', 'Civil Litigation'],
    },
  ];
}

// Public API
export const api = {
  async createBooking(data: any) {
    try {
      return await convexMutation('functions:createBooking', data);
    } catch (e) {
      console.warn('Convex createBooking failed, using localStorage:', e);
      return localCreateBooking(data);
    }
  },

  async getMatterByReference(reference: string) {
    try {
      return await convexQuery('functions:getMatterByReference', { reference });
    } catch (e) {
      console.warn('Convex getMatterByReference failed, using localStorage:', e);
      return localGetMatterByReference(reference);
    }
  },

  async getBookings(filters?: any) {
    try {
      return await convexQuery('functions:getBookings', filters || {});
    } catch (e) {
      console.warn('Convex getBookings failed, using localStorage:', e);
      return localGetBookings();
    }
  },

  async getMatters() {
    try {
      return await convexQuery('functions:getMatters', {});
    } catch (e) {
      console.warn('Convex getMatters failed, using localStorage:', e);
      return localGetMatters();
    }
  },

  async updateMatterStatus(reference: string, status: number, next_action: string, attorney_id?: any) {
    try {
      return await convexMutation('functions:updateMatterStatus', { reference, status, next_action, attorney_id });
    } catch (e) {
      console.warn('Convex updateMatterStatus failed, using localStorage:', e);
      return localUpdateMatterStatus(reference, status, next_action, attorney_id);
    }
  },

  async approveBooking(id: string) {
    try {
      return await convexMutation('functions:approveBooking', { id });
    } catch (e) {
      console.warn('Convex approveBooking failed, using localStorage:', e);
      return localApproveBooking(id);
    }
  },

  async rejectBooking(id: string) {
    try {
      return await convexMutation('functions:rejectBooking', { id });
    } catch (e) {
      console.warn('Convex rejectBooking failed, using localStorage:', e);
      return localRejectBooking(id);
    }
  },

  async getAttorneys() {
    try {
      return await convexQuery('functions:getAttorneys', {});
    } catch (e) {
      console.warn('Convex getAttorneys failed, using localStorage:', e);
      return localGetAttorneys();
    }
  },
};
