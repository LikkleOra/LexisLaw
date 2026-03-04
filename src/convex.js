// LexisLaw Convex Client — HTTP API Edition
// Uses Convex's built-in HTTP API so no bundler is needed.
// Works in plain static HTML pages.

(function () {
  const CONVEX_URL = "https://striped-meadowlark-10.convex.cloud"; // ← your deployment URL

  /**
   * Call a Convex query via HTTP.
   * @param {string} name - e.g. "functions:getMatterByReference"
   * @param {object} args - query args object
   */
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

  /**
   * Call a Convex mutation via HTTP.
   * @param {string} name - e.g. "functions:createBooking"
   * @param {object} args - mutation args object
   */
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

  // ─── PUBLIC API ──────────────────────────────────────────────────────────────

  const api = {
    /**
     * Create a new booking. Returns { success, reference, ...bookingData }
     */
    createBooking: (data) => convexMutation("functions:createBooking", data),

    /**
     * Look up a matter by reference number. Returns matter object or null.
     */
    getMatterByReference: (reference) =>
      convexQuery("functions:getMatterByReference", { reference }),

    /**
     * Get all bookings (admin).
     */
    getBookings: (filters) =>
      convexQuery("functions:getBookings", filters || {}),

    /**
     * Get all matters (admin).
     */
    getMatters: () => convexQuery("functions:getMatters", {}),

    /**
     * Update matter status (admin).
     */
    updateMatterStatus: (reference, status, next_action, attorney_id) =>
      convexMutation("functions:updateMatterStatus", {
        reference,
        status,
        next_action,
        attorney_id,
      }),

    /**
     * Approve a booking (admin).
     */
    approveBooking: (id) => convexMutation("functions:approveBooking", { id }),

    /**
     * Reject a booking (admin).
     */
    rejectBooking: (id) => convexMutation("functions:rejectBooking", { id }),

    /**
     * Delete a matter (admin).
     */
    deleteMatter: (id) => convexMutation("functions:deleteMatter", { id }),

    /**
     * Get all attorneys.
     */
    getAttorneys: () => convexQuery("functions:getAttorneys", {}),
  };

  // Expose globally so index.html and dashboard.html can call window.lexisLawApi.*
  window.lexisLawApi = api;
  window.convexQuery = convexQuery;
  window.convexMutation = convexMutation;

  console.log("✓ LexisLaw Convex HTTP client initialized");
})();
