# Admin Dashboard Integration Plan

## Executive Summary

The provided admin dashboard code is a **comprehensive, feature-complete** administration portal. This document outlines an efficient integration path that leverages the existing LexisLaw infrastructure (Convex backend, Twilio/WhatsApp integration) while maintaining code consistency with the existing frontend.

---

## Current State Analysis

### Existing Files
| File | Purpose |
|------|---------|
| `src/index.html` | Client-facing landing page (2277 lines) |
| `src/admin/dashboard.html` | Basic admin dashboard (625 lines) |
| `src/portal.html` | Client portal for matter tracking (1137 lines) |
| `src/login.html` | Authentication |
| `src/convex.js` | Convex HTTP API client |

### What Already Exists
- ✅ Convex backend client (`src/convex.js`)
- ✅ WhatsApp Click-to-Chat integration (via `window.open`)
- ✅ Basic booking data model
- ✅ Twilio in package.json (for future WhatsApp API)

---

## Integration Strategy

### Option A: Replace Existing Admin (Recommended)
**Pros:** Full feature set, modern UI, production-ready
**Cons:** Needs Convex backend schema updates

### Option B: Hybrid Approach  
**Pros:** Minimal disruption, gradual migration
**Cons:** Code duplication, maintenance burden

---

## Implementation Roadmap

### Phase 1: Backend Schema Preparation

The dashboard expects this data structure. Ensure Convex schema includes:

```typescript
// convex/schema.ts additions needed
bookings: defineSchema({
  ref: string,
  name: string,
  phone: string,
  email: string,
  matter: string,
  date: string,
  time: string,
  attorney: string | null,
  status: "new" | "pending" | "approved" | "rejected" | "in-progress" | "awaiting" | "hearing" | "resolved",
  bookingStatus: string,
  description: string,
  created: string,
  updated: string,
})

attorneys: defineSchema({
  id: string,
  name: string,
  initials: string,
  specialty: string,
  activeCases: number,
  resolvedCases: number,
})

whatsappLogs: defineSchema({
  id: string,
  bookingRef: string,
  clientName: string,
  phone: string,
  type: string,
  message: string,
  status: "delivered" | "read" | "failed" | "pending",
  timestamp: string,
})
```

### Phase 2: Replace Admin Dashboard

Replace `src/admin/dashboard.html` with the new comprehensive dashboard.

**File changes:**
- Copy provided code to `src/admin/dashboard.html`
- Update Convex URL in `src/convex.js` (or use config)
- Add navigation link from index.html

### Phase 3: Connect to Backend

Modify the JavaScript to use Convex instead of localStorage/demo data:

```javascript
// Replace seedData() with Convex queries
async function loadFromConvex() {
  db.bookings = await api.getBookings();
  db.attorneys = await api.getAttorneys();
  db.waLogs = await api.getWhatsAppLogs();
  renderAll();
}

// Replace mutations
async function approveBooking(ref) {
  await api.mutation('approveBooking', { ref });
  // Then reload from Convex
}
```

### Phase 4: WhatsApp Integration

Current dashboard uses Click-to-Chat. To upgrade to API-based:

1. **Deploy Twilio credentials** (already in package.json)
2. **Create Convex function** for WhatsApp sending:
```typescript
// convex/functions/whatsapp.ts
export const sendWhatsApp = internalAction({
  args: { phone: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_FROM}`,
      to: `whatsapp:${args.phone}`,
      body: args.message
    });
  }
});
```

---

## Component Mapping

| Dashboard Feature | Existing Asset | Integration Required |
|-------------------|----------------|---------------------|
| Sidebar Navigation | Exists in index.html | Minimal styling match |
| Booking CRUD | Convex schema + API | Schema alignment |
| Attorney Roster | Not implemented | New schema + API |
| WhatsApp Logs | WHATSAPP_INTEGRATION.md | Schema + UI integration |
| API Configuration | .env.example | Environment setup |

---

## Files to Create/Modify

### New Files
- `src/admin/dashboard.html` — **Replace with provided code**
- `convex/schema.ts` — **Add missing tables**
- `convex/functions/attorneys.ts` — **New**
- `convex/functions/whatsapp.ts` — **New**

### Modified Files
- `src/convex.js` — Update CONVEX_URL
- `src/index.html` — Add admin link in nav
- `package.json` — Already has twilio

---

## Quick Start

1. **Backup existing admin:**
   ```bash
   cp src/admin/dashboard.html src/admin/dashboard.backup.html
   ```

2. **Replace dashboard:**
   ```bash
   cp /path/to/new/dashboard.html src/admin/dashboard.html
   ```

3. **Update Convex URL in convex.js:**
   ```javascript
   const CONVEX_URL = "https://your-deployment.convex.cloud";
   ```

4. **Add admin link to index.html:**
   ```html
   <a href="/admin/dashboard.html">Admin Portal</a>
   ```

5. **Deploy Convex schema:**
   ```bash
   npx convex deploy
   ```

---

## Testing Checklist

- [ ] Dashboard loads without console errors
- [ ] Navigation switches between views
- [ ] KPI cards display correct counts
- [ ] Bookings table renders with mock data
- [ ] Filter/search functionality works
- [ ] Detail drawer opens/closes
- [ ] Modals open/close correctly
- [ ] Toast notifications appear
- [ ] Convex connection (when backend ready)
- [ ] Mobile responsive layout works

---

## Notes

### Styling Consistency
The provided code uses:
- **Fonts:** Bebas Neue, IBM Plex Mono, DM Sans
- **Colors:** Dark theme (#080808 base), Red accent (#E63329)
- **Components:** Custom CSS (no framework)

Existing index.html uses:
- **Fonts:** Bebas Neue, Space Grotesk, IBM Plex Mono
- **Colors:** Similar dark theme

**Recommendation:** Accept the new styling as-is. It's well-designed and consistent with legal industry aesthetics.

### Security Considerations
- Add password protection (see existing admin dashboard for login pattern)
- Secure Convex deployment URL
- Add role-based access (admin vs attorney view)

### Future Enhancements
1. Real-time updates via Convex subscriptions
2. Email notifications alongside WhatsApp
3. Calendar integration (Google/Outlook)
4. Document upload for case files
5. Client portal sync (see existing portal.html)
