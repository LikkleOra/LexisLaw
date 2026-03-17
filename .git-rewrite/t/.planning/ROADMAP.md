# LexisLaw Roadmap

## Vision
Transform LexisLaw into a fully digital legal services platform with online booking, real-time matter tracking, and WhatsApp integration.

## Requirements

**Current (MVP):**
- [x] Landing page with services grid
- [x] Online booking form with validation
- [x] Matter tracker with mock data
- [x] WhatsApp confirmation simulation

**Phase 1 - Foundation:**
- [ ] F-01: Backend API with database (bookings, matters, clients)
- [ ] F-02: Real WhatsApp integration via API
- [ ] F-03: Email confirmations
- [ ] F-04: Attorney admin dashboard

**Phase 2 - Enhancement:**
- [ ] F-05: Document upload for clients
- [ ] F-06: Payment integration (deposit payments)
- [ ] F-07: Client authentication (login)
- [ ] F-08: SMS notifications

**Phase 3 - Advanced:**
- [ ] F-09: Video consultation integration
- [ ] F-10: Automated status updates
- [ ] F-11: Billing/invoicing portal
- [ ] F-12: Analytics dashboard

---

## Roadmap Summary

| Phase | Focus | Duration | Key Deliverables |
|-------|-------|----------|------------------|
| 1 | Backend & Integration | 2-3 weeks | API, DB, WhatsApp real |
| 2 | Client Portal | 2-3 weeks | Auth, documents, payments |
| 3 | Advanced Features | 3-4 weeks | Video, billing, analytics |

---

## Feature Specifications

### F-01: Backend API
**Priority:** Critical  
**Description:** RESTful API for booking management, matter tracking, client data  
**Acceptance Criteria:**
- POST /api/bookings creates new booking
- GET /api/matters/:ref returns matter status
- All endpoints require authentication for admin

### F-02: WhatsApp Integration  
**Priority:** Critical  
**Description:** Real WhatsApp messages via Business API  
**Acceptance Criteria:**
- Confirmation sent within 30s of booking
- Reminder 24h before appointment
- Status change notifications

### F-04: Attorney Dashboard
**Priority:** High  
**Description:** Admin interface for managing bookings and matters  
**Acceptance Criteria:**
- View all bookings (calendar view)
- Update matter status
- Assign attorney to matter
- View client history

### F-05: Document Upload
**Priority:** Medium  
**Description:** Clients upload supporting documents pre-consultation  
**Acceptance Criteria:**
- Secure file upload (PDF, images)
- Max 10MB per file
- Document categorization

---

## Dependencies

- F-02 requires F-01 (API must exist first)
- F-04 requires F-01 (dashboard fetches from API)
- F-05 requires F-01 (upload endpoint)
- F-07 requires F-01 (authentication)

---

*Last Updated: 2026-03-03*
