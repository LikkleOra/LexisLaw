// Mokoena Legal Services Convex Client — HTTP API + LocalStorage Fallback
// Uses Convex's built-in HTTP API so no bundler is needed.
// Falls back to localStorage when backend is unavailable.

(function () {
  // Use URL from global (set by Netlify env var) or fallback to default
  const CONVEX_URL = window.CONVEX_SITE_URL || 'https://striped-meadowlark-10.convex.cloud';
  console.log('Initializing Mokoena Legal Services API with:', CONVEX_URL);

  // ─── LOCALSTORAGE HELPERS ───────────────────────────────────────────────────
  const STORAGE_KEYS = {
    bookings: 'mokoena_bookings',
    matters: 'mokoena_matters',
    clients: 'mokoena_clients'
  };

  function getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('localStorage read error:', e);
      return [];
    }
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage write error:', e);
    }
  }

  function generateReference() {
    return "REF-" + String(Math.floor(10000 + Math.random() * 89999));
  }

  function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function getStatusLabel(status) {
    const labels = { 
      pending: "PENDING", 
      in_progress: "IN PROGRESS", 
      awaiting_docs: "AWAITING DOCS", 
      hearing: "HEARING SCHEDULED", 
      resolved: "RESOLVED" 
    };
    return labels[status] || "PENDING";
  }

  function getStatusNumber(status) {
    const map = { pending: 0, in_progress: 1, awaiting_docs: 2, hearing: 3, resolved: 4 };
    return map[status] || 0;
  }

  // ─── CONvex API CALLS ────────────────────────────────────────────────────────
  let convexAvailable = false;

  async function testConvexConnection() {
    try {
      const url = `${CONVEX_URL}/api/query`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "functions:getAttorneys", args: {} }),
      });
      convexAvailable = res.ok;
      console.log('Convex backend:', convexAvailable ? 'AVAILABLE' : 'UNAVAILABLE (using localStorage)');
      return convexAvailable;
    } catch (e) {
      console.warn('Convex connection failed:', e.message);
      convexAvailable = false;
      return false;
    }
  }

  async function convexQuery(name, args = {}) {
    const url = `${CONVEX_URL}/api/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: name, args }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Convex query failed: ${res.status}`);
    }
    const data = await res.json();
    return data.value;
  }

  async function convexMutation(name, args = {}) {
    const url = `${CONVEX_URL}/api/mutation`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: name, args }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Convex mutation failed: ${res.status}`);
    }
    const data = await res.json();
    return data.value;
  }

  // ─── LOCALSTORAGE FALLBACK FUNCTIONS ────────────────────────────────────────
  function localCreateBooking(data) {
    const bookings = getFromStorage(STORAGE_KEYS.bookings);
    const matters = getFromStorage(STORAGE_KEYS.matters);
    const clients = getFromStorage(STORAGE_KEYS.clients);

    // Normalize phone
    const normalizedPhone = data.phone.replace(/\s/g, "").replace(/^0/, "+27");
    
    // Find or create client
    let client = clients.find(c => c.phone === normalizedPhone);
    if (!client) {
      client = {
        _id: generateId(),
        name: data.name,
        phone: normalizedPhone,
        email: data.email || null,
        whatsapp_consent: data.whatsapp_consent,
        popia_consent: data.popia_consent,
        created: new Date().toISOString()
      };
      clients.push(client);
      saveToStorage(STORAGE_KEYS.clients, clients);
    }

    // Create booking
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
      reference: reference
    };
    bookings.push(booking);
    saveToStorage(STORAGE_KEYS.bookings, bookings);

    // Create matter
    const matter = {
      _id: generateId(),
      booking_id: booking._id,
      client_id: client._id,
      reference: reference,
      attorney_id: null,
      status: 'pending',
      next_action: 'Awaiting initial consultation',
      created: new Date().toISOString()
    };
    matters.push(matter);
    saveToStorage(STORAGE_KEYS.matters, matters);

    console.log('Booking saved to localStorage:', reference);

    return {
      success: true,
      reference: reference,
      booking_id: booking._id,
      client_phone: normalizedPhone.replace('+', ''),
      admin_phone: '2785946689',
      name: data.name,
      matter_type: data.matter_type,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      description: data.description,
      email: data.email
    };
  }

  function localGetMatterByReference(ref) {
    const matters = getFromStorage(STORAGE_KEYS.matters);
    const bookings = getFromStorage(STORAGE_KEYS.bookings);
    const clients = getFromStorage(STORAGE_KEYS.clients);

    const matter = matters.find(m => m.reference === ref);
    if (!matter) return null;

    const booking = bookings.find(b => b._id === matter.booking_id);
    const client = clients.find(c => c._id === matter.client_id);

    if (!booking) return null;

    return {
      reference: matter.reference,
      name: client?.name || booking.name,
      phone: client?.phone || booking.phone,
      email: client?.email || booking.email,
      matter: booking.matter_type,
      date: `${formatDate(booking.preferred_date)}, ${booking.preferred_time}`,
      attorney: 'Adv. Thabo Jabulani Mokoena',
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

    return bookings.map(booking => {
      const client = clients.find(c => c._id === booking.client_id);
      const matter = matters.find(m => m.booking_id === booking._id);
      
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
        attorney_name: matter?.attorney_id ? 'Adv. Thabo Jabulani Mokoena' : null,
      };
    });
  }

  function localGetMatters() {
    const matters = getFromStorage(STORAGE_KEYS.matters);
    const bookings = getFromStorage(STORAGE_KEYS.bookings);
    const clients = getFromStorage(STORAGE_KEYS.clients);

    return matters.map(matter => {
      const booking = bookings.find(b => b._id === matter.booking_id);
      const client = clients.find(c => c._id === matter.client_id);

      return {
        _id: matter._id,
        reference: matter.reference,
        name: client?.name || booking?.name || 'Unknown',
        matter: booking?.matter_type || 'General',
        attorney: 'Adv. Thabo Jabulani Mokoena',
        status: getStatusNumber(matter.status),
        statusLabel: getStatusLabel(matter.status),
        next: matter.next_action || 'Pending review',
      };
    });
  }

  function localUpdateMatterStatus(reference, statusNum, next_action, attorney_id) {
    const matters = getFromStorage(STORAGE_KEYS.matters);
    const statusMap = ["pending", "in_progress", "awaiting_docs", "hearing", "resolved"];
    
    const matterIndex = matters.findIndex(m => m.reference === reference);
    if (matterIndex === -1) throw new Error('Matter not found');

    matters[matterIndex].status = statusMap[statusNum] || 'pending';
    matters[matterIndex].next_action = next_action;
    matters[matterIndex].attorney_id = attorney_id;
    matters[matterIndex].updated = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.matters, matters);
    return { success: true };
  }

  function localApproveBooking(id) {
    const bookings = getFromStorage(STORAGE_KEYS.bookings);
    const matters = getFromStorage(STORAGE_KEYS.matters);
    
    const bookingIndex = bookings.findIndex(b => b._id === id);
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = 'confirmed';
      bookings[bookingIndex].updated = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.bookings, bookings);
    }

    const matterIndex = matters.findIndex(m => m.booking_id === id);
    if (matterIndex !== -1) {
      matters[matterIndex].status = 'in_progress';
      matters[matterIndex].next_action = 'Consultation approved';
      matters[matterIndex].updated = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.matters, matters);
    }

    return { success: true };
  }

  function localRejectBooking(id) {
    const bookings = getFromStorage(STORAGE_KEYS.bookings);
    const matters = getFromStorage(STORAGE_KEYS.matters);
    
    const bookingIndex = bookings.findIndex(b => b._id === id);
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = 'rejected';
      bookings[bookingIndex].updated = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.bookings, bookings);
    }

    const matterIndices = matters.map((m, i) => m.booking_id === id ? i : -1).filter(i => i !== -1);
    matterIndices.reverse().forEach(i => matters.splice(i, 1));
    saveToStorage(STORAGE_KEYS.matters, matters);

    return { success: true };
  }

  function localDeleteMatter(id) {
    const matters = getFromStorage(STORAGE_KEYS.matters);
    const matterIndex = matters.findIndex(m => m._id === id);
    if (matterIndex !== -1) {
      matters.splice(matterIndex, 1);
      saveToStorage(STORAGE_KEYS.matters, matters);
    }
    return { success: true };
  }

  function localGetAttorneys() {
    return [
      {
        _id: 'att_1',
        name: 'Adv. Thabo Jabulani Mokoena',
        email: 'thabo@mokoenalegal.co.za',
        initials: 'TM',
        specialty: 'Criminal Defence & Litigation',
        activeCases: localGetMatters().filter(m => m.status < 4).length,
        resolvedCases: localGetMatters().filter(m => m.status === 4).length,
        specializations: ['Criminal Defence', 'Civil Litigation', 'Family Law']
      }
    ];
  }

  function localGetWhatsAppLogs() {
    return [];
  }

  function localGetDocuments() {
    return [];
  }

  function localAddWALog(data) {
    console.log('WhatsApp log (local):', data);
    return { success: true };
  }

  function localAddDocument(data) {
    console.log('Document (local):', data);
    return { success: true };
  }

  function formatDate(timestampOrDate) {
    if (!timestampOrDate) return "—";
    const date = typeof timestampOrDate === "number" ? new Date(timestampOrDate) : new Date(timestampOrDate);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
  }

  // ─── PUBLIC API ──────────────────────────────────────────────────────────────
  // Test connection on load
  testConvexConnection();

  const api = {
    /**
     * Create a new booking. Returns { success, reference, ...bookingData }
     */
    createBooking: async (data) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:createBooking", data);
        }
      } catch (e) {
        console.warn('Convex createBooking failed, using localStorage:', e.message);
      }
      return localCreateBooking(data);
    },

    /**
     * Look up a matter by reference number. Returns matter object or null.
     */
    getMatterByReference: async (reference) => {
      try {
        if (convexAvailable) {
          return await convexQuery("functions:getMatterByReference", { reference });
        }
      } catch (e) {
        console.warn('Convex getMatterByReference failed, using localStorage:', e.message);
      }
      return localGetMatterByReference(reference);
    },

    /**
     * Get all bookings (admin).
     */
    getBookings: async (filters) => {
      try {
        if (convexAvailable) {
          return await convexQuery("functions:getBookings", filters || {});
        }
      } catch (e) {
        console.warn('Convex getBookings failed, using localStorage:', e.message);
      }
      return localGetBookings();
    },

    /**
     * Get all matters (admin).
     */
    getMatters: async () => {
      try {
        if (convexAvailable) {
          return await convexQuery("functions:getMatters", {});
        }
      } catch (e) {
        console.warn('Convex getMatters failed, using localStorage:', e.message);
      }
      return localGetMatters();
    },

    /**
     * Update matter status (admin).
     */
    updateMatterStatus: async (reference, status, next_action, attorney_id) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:updateMatterStatus", {
            reference,
            status,
            next_action,
            attorney_id,
          });
        }
      } catch (e) {
        console.warn('Convex updateMatterStatus failed, using localStorage:', e.message);
      }
      return localUpdateMatterStatus(reference, status, next_action, attorney_id);
    },

    /**
     * Approve a booking (admin).
     */
    approveBooking: async (id) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:approveBooking", { id });
        }
      } catch (e) {
        console.warn('Convex approveBooking failed, using localStorage:', e.message);
      }
      return localApproveBooking(id);
    },

    /**
     * Reject a booking (admin).
     */
    rejectBooking: async (id) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:rejectBooking", { id });
        }
      } catch (e) {
        console.warn('Convex rejectBooking failed, using localStorage:', e.message);
      }
      return localRejectBooking(id);
    },

    /**
     * Delete a matter (admin).
     */
    deleteMatter: async (id) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:deleteMatter", { id });
        }
      } catch (e) {
        console.warn('Convex deleteMatter failed, using localStorage:', e.message);
      }
      return localDeleteMatter(id);
    },

    /**
     * Get all attorneys.
     */
    getAttorneys: async () => {
      try {
        if (convexAvailable) {
          return await convexQuery("functions:getAttorneys", {});
        }
      } catch (e) {
        console.warn('Convex getAttorneys failed, using localStorage:', e.message);
      }
      return localGetAttorneys();
    },

    /**
     * Get WhatsApp logs.
     */
    getWhatsAppLogs: async () => {
      try {
        if (convexAvailable) {
          return await convexQuery("functions:getWhatsAppLogs", {});
        }
      } catch (e) {
        console.warn('Convex getWhatsAppLogs failed, using localStorage:', e.message);
      }
      return localGetWhatsAppLogs();
    },

    /**
     * Get all documents.
     */
    getDocuments: async () => {
      try {
        if (convexAvailable) {
          return await convexQuery("functions:getDocuments", {});
        }
      } catch (e) {
        console.warn('Convex getDocuments failed, using localStorage:', e.message);
      }
      return localGetDocuments();
    },

    /**
     * Add a WhatsApp log.
     */
    addWALog: async (data) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:addWALog", data);
        }
      } catch (e) {
        console.warn('Convex addWALog failed, using localStorage:', e.message);
      }
      return localAddWALog(data);
    },

    /**
     * Add a document record.
     */
    addDocument: async (data) => {
      try {
        if (convexAvailable) {
          return await convexMutation("functions:addDocument", data);
        }
      } catch (e) {
        console.warn('Convex addDocument failed, using localStorage:', e.message);
      }
      return localAddDocument(data);
    },

    // Helper to check connection status
    isConnected: () => convexAvailable,
    testConnection: testConvexConnection
  };

  // Expose globally so index.html and dashboard.html can call window.lexisLawApi.*
  window.lexisLawApi = api;
  window.convexQuery = convexQuery;
  window.convexMutation = convexMutation;

  console.log("✓ Mokoena Legal Services API initialized (with localStorage fallback)");
})();
