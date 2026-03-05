# Mokoena Legal Services - Project Research & Analysis

## Project Overview

**Current Name:** Mokoena Legal Services (formerly LexisLaw)
**Type:** Legal Services Web Application
**Location:** Johannesburg, South Africa
**Tech Stack:** HTML/CSS/Vanilla JS + Convex (Backend) + Twilio/WhatsApp

---

## Current File Structure

```
LexisLaw/
├── src/
│   ├── index.html        # Main landing page (2993 lines)
│   ├── portal.html       # Admin dashboard (1137 lines)
│   ├── login.html        # Client login with Clerk auth
│   ├── convex.js         # Convex HTTP client
│   └── .env.example      # Environment variables
├── convex/
│   ├── schema.js         # Database schema (136 lines)
│   ├── functions.js      # API functions (410 lines)
│   ├── auth.js           # Custom authentication
│   ├── whatsapp.js      # WhatsApp integration
│   ├── sms.js           # SMS notifications
│   └── seed.js          # Seed data
├── .planning/           # GSD planning docs
├── package.json
└── netlify.toml
```

---

## User Requirements Summary

### 1. Name Change
- **From:** LexisLaw
- **To:** Mokoena Legal Services

### 2. Specialists Section
- Currently has multiple attorneys listed
- **Required:** Only dad's profile (user is the only specialist)

### 3. New Contacts Page Needed
- Add contact information page

### 4. About Page Update
- Make it more law firm centered
- Tailor for legal services

### 5. Tracker Functionality
- **Issue:** Cannot retrieve/track data after booking
- **Required:** Connect to backend properly

### 6. Backend Connection
- Frontend not fetching data properly
- Booking not persisting to backend
- Need proper API integration

---

## Database Schema (Convex)

### Tables Defined:

1. **attorneys** - Firm attorneys
   - name, email, initials, specialty, activeCases, resolvedCases, specializations

2. **clients** - Client records
   - name, phone, email, clerk_id, whatsapp_consent, popia_consent

3. **bookings** - Consultation bookings
   - client_id, ref, name, phone, email, matter, date, time, attorney, matter_type, status, description, created, updated

4. **matters** - Legal cases
   - booking_id, client_id, reference, attorney_id, status, next_action

5. **documents** - Uploaded files
   - client_id, matter_reference, filename, file_type, file_size, storage_id

6. **whatsapp_logs** - WhatsApp message history
   - bookingRef, clientName, phone, type, message, status, timestamp

7. **sms_logs** - SMS history
   - client_id, phone, message, status, sent_at

---

## API Functions (Convex)

### Queries:
- `getMatterByReference(reference)` - Lookup case by ref number
- `getBookings(status, from_date, to_date)` - Get all bookings
- `getMatters()` - Get all matters
- `getAttorneys()` - Get all attorneys
- `getWhatsAppLogs()` - Get WhatsApp logs
- `getDocuments()` - Get all documents

### Mutations:
- `createBooking(data)` - Create new booking
- `updateMatterStatus(reference, status, next_action, attorney_id)` - Update case
- `approveBooking(id)` - Approve booking
- `rejectBooking(id)` - Reject booking
- `deleteMatter(id)` - Delete matter
- `addWALog(data)` - Log WhatsApp message
- `addDocument(data)` - Add document record

---

## Current Issues Identified

### 1. Backend Connection Not Working
- Convex URL in index.html: `https://striped-meadowlark-10.convex.cloud`
- Frontend checks for `window.lexisLawApi` but falls back to demo mode
- **Issue:** API calls failing or Convex not deployed

### 2. Tracker Not Working
- `lookupMatter()` function calls `window.lexisLawApi.getMatterByReference(ref)`
- Falls back to demo if API not loaded
- **Solution:** Ensure Convex backend is deployed and accessible

### 3. Booking Not Saving
- `submitBooking()` creates booking via API
- Falls back to random reference in demo mode
- **Solution:** Deploy Convex and verify API endpoint

### 4. Multiple Attorneys Not Applicable
- Current: 4 attorneys (Adv. T. Nkosi, Adv. S. Mokoena, Adv. N. Pillay, Adv. L. van der Merwe)
- Required: Only dad's profile (name unknown - needs user input)

---

## Changes Already Made

### Name Changes Applied:
1. ✅ index.html title → "MOKOENA LEGAL SERVICES"
2. ✅ Navigation logo → "MOKOENA LEGAL"
3. ✅ Hero background text → "MLS"
4. ✅ Footer logo → "MOKOENA LEGAL"
5. ✅ Admin login logo → "MOKOENA LEGAL"
6. ✅ WhatsApp messages updated
7. ✅ portal.html title → "MOKOENA LEGAL SERVICES"
8. ✅ login.html title/logo updated
9. ✅ convex.js client name updated
10. ✅ package.json name/description updated
11. ✅ PROJECT.md updated

---

## Pending Changes Required

### 1. Specialists Section (index.html)
- **Location:** Lines ~2021-2035 (About section team members)
- **Current:** 2 team members (Adv. Thabo Nkosi, Adv. Sarah Mokoena)
- **Required:** Only dad's profile - need his name and title

### 2. New Contacts Page
- Add new page section in index.html
- Add navigation link
- Include: phone, email, address, hours

### 3. Update About Page Content
- Make more law firm centered
- Remove generic startup language
- Add firm history/expertise

### 4. Fix Backend Connection
- Verify Convex deployment URL
- Test API connectivity
- Ensure data persistence

### 5. Fix Tracker
- Verify `getMatterByReference` query works
- Ensure bookings create matters properly
- Test end-to-end flow

---

## Admin Credentials (Current)

- **Password:** `lexislaw2026` (in all files - consider changing)
- **Access:** Via "Admin Login" link on main site

---

## WhatsApp Integration

- Uses click-to-chat links (no actual API calls)
- Admin number: `+27785962689`
- Opens wa.me links in new tab

---

## Next Steps for User

1. **Provide dad's name** for specialist section
2. **Provide contact details** for Contacts page (phone, email, address)
3. **Deploy Convex backend** or verify existing deployment
4. **Test booking flow** end-to-end
5. **Test tracker** with a booking reference

---

## Files to Modify

| File | Changes Needed |
|------|----------------|
| `src/index.html` | Update specialist, add contacts page, update about |
| `src/convex.js` | Update Convex URL if deployment changes |
| `convex/schema.js` | Update if attorney data changes |
| `convex/seed.js` | Update with actual attorney data |

---

*Document generated for Mokoena Legal Services project adjustments*
