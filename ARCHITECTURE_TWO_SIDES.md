# LexisLaw Architecture: Two Sides of One Coin

## The Concept: Restaurant and Kitchen

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LEXISLAW APPLICATION                              │
│                                                                      │
│   ┌─────────────────────────┐    ┌────────────────────────────────┐ │
│   │    CLIENT SIDE          │    │         ADMIN SIDE              │ │
│   │    (Restaurant)        │    │         (Kitchen)               │ │
│   │                        │    │                                 │ │
│   │  • Landing page        │    │  • Admin dashboard              │ │
│   │  • Booking form        │    │  • Manage bookings             │ │
│   │  • Matter tracker      │    │  • Assign attorneys            │ │
│   │  • Public facing       │    │  • Internal operations        │ │
│   │                        │    │                                 │ │
│   │  VISIBLE TO EVERYONE   │    │  HIDDEN BEHIND LOGIN           │ │
│   └───────────┬────────────┘    └────────────┬─────────────────────┘ │
│               │                             │                       │
│               │    ┌────────────────────┐   │                       │
│               └────┤    SHARED DATA     ├───┘                       │
│                    │    (Convex DB)     │                             │
│                    └────────────────────┘                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Current State Analysis

### How It Works Now (Two Separate Files)

```
/src/index.html              → Client side (Restaurant)
/src/admin/dashboard.html     → Admin side (Kitchen)

Navigation: index.html has link to dashboard.html
           dashboard.html has NO link back to index.html
```

**Current Navigation in index.html:**
```html
<nav>
  <a href="#" onclick="showPage('home')">HOME</a>
  <a href="#" onclick="showPage('booking')">BOOK NOW</a>
  <a href="./admin/dashboard.html">ADMIN</a>  <!-- Goes to separate file -->
</nav>
```

**Problem:** When you access the admin, you "leave" the restaurant and enter the kitchen as a completely separate "building."

---

## The Solution: Single App, Multiple Views

### How Fadezone Does It (Recommended Pattern)

Fadezone uses a **Single Page Application (SPA)** pattern where everything exists in ONE file, and you simply toggle visibility:

```typescript
// ONE App.tsx controls everything via "step" state
const [step, setStep] = useState(0);  // 0-5 = client views
const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);

// Render based on step - NO PAGE NAVIGATION
return (
  <>
    {/* Restaurant Side */}
    {step === 0 && renderLanding()}
    {step === 1 && renderServiceMenu()}
    {step === 2 && renderBookingForm()}
    {step === 3 && renderConfirmation()}
    
    {/* Kitchen Side - only visible after login */}
    {isStaffAuthenticated && renderStaffDashboard()}
  </>
);
```

### Key Insight

| Aspect | Two Files | Single File |
|--------|-----------|-------------|
| Data sharing | Harder | Easy (same state) |
| Navigation | Page refresh | Instant toggle |
| User experience | Feels like two sites | Feels like one app |
| Back button | Works oddly | Works naturally |

---

## Implementation for LexisLaw

### Option A: Quick Fix (Add Back Link)

The simplest fix for the current two-file setup:

**In dashboard.html, add to the sidebar:**
```html
<button class="nav-btn" onclick="window.location.href='../index.html'">
  ← BACK TO SITE
</button>
```

---

### Option B: Single Page Architecture (Recommended)

#### Step 1: Create View Containers in index.html

```html
<!-- CLIENT SIDE (Restaurant) -->
<div id="clientView">
  <nav>...</nav>
  <div id="homePage" class="page active">...</div>
  <div id="bookingPage" class="page">...</div>
  <div id="trackerPage" class="page">...</div>
</div>

<!-- ADMIN SIDE (Kitchen) - Hidden by default -->
<div id="adminView" class="hidden">
  <div id="loginScreen">...</div>
  <div id="dashboard" class="hidden">
    <aside>...</aside>
    <main>...</main>
  </div>
</div>
```

#### Step 2: Create View Switching Functions

```javascript
// State management
let currentView = 'client'; // 'client' or 'admin'

function showAdmin() {
  document.getElementById('clientView').classList.add('hidden');
  document.getElementById('adminView').classList.remove('hidden');
  currentView = 'admin';
}

function showClient() {
  document.getElementById('adminView').classList.add('hidden');
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('clientView').classList.remove('hidden');
  currentView = 'client';
}

function checkLogin() {
  const pass = document.getElementById('passInput').value;
  if (pass === 'lexislaw2026') {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
  }
}
```

#### Step 3: Update Navigation

**Replace in index.html nav:**
```html
<!-- Old way (separate file) -->
<a href="./admin/dashboard.html">ADMIN</a>

<!-- New way (same file) -->
<a href="#" onclick="showAdmin()">ADMIN</a>
```

**Add in dashboard.html sidebar:**
```html
<!-- Add back button -->
<button class="nav-btn" onclick="showClient()">
  ← BACK TO WEBSITE
</button>
```

---

## Visual Flow After Implementation

```
                    ┌─────────────────┐
                    │   LEXISLAW      │
                    │   LANDING PAGE  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────────┐      ┌─────────────────────┐
    │    USER CLICKS      │      │   USER CLICKS       │
    │    "BOOK NOW"      │      │      "ADMIN"        │
    └────────┬────────────┘      └──────────┬──────────┘
             │                               │
             ▼                               ▼
    ┌─────────────────────┐      ┌─────────────────────┐
    │   BOOKING FORM      │      │   LOGIN SCREEN      │
    │   (Client View)     │      │   (Password check)  │
    └────────┬────────────┘      └──────────┬──────────┘
             │                               │
             │                    ┌──────────┴──────────┐
             │                    │                     │
             │                    ▼                     ▼
             │           ┌───────────────┐    ┌─────────────────┐
             │           │  WRONG PASS   │    │  CORRECT PASS   │
             │           │  (Stay here)  │    │  ADMIN DASHBOARD│
             │           └───────────────┘    └────────┬────────┘
             │                                       │
             │                    ┌──────────────────┘
             │                    │
             ▼                    ▼
    ┌─────────────────────┐      ┌─────────────────────┐
    │   CONFIRMATION      │      │  ┌─────────┬────────┐ │
    │   + WhatsApp        │      │  │ bookings│ matters│ │
    │                     │      │  └─────────┴────────┘ │
    └─────────┬───────────┘      │         │            │
              │                  │         ▼            │
              │                  │  ┌─────────────────┐  │
              │                  │  │ "← BACK TO     │  │
              │                  │  │    WEBSITE"    │  │
              │                  │  └─────────────────┘  │
              └──────────────────┘                        │
                       ↺ BACK TO LANDING PAGE              │
                                                          │
                    ═══════════════════════════════════════
                         TWO VIEWS, ONE APP
                    ═══════════════════════════════════════
```

---

## Files That Need Changes

| File | Change |
|------|--------|
| `src/index.html` | Add admin view containers, add `showAdmin()` function |
| `src/admin/dashboard.html` | Add `showClient()` back button OR merge into index.html |

---

## Key Benefits of This Architecture

1. **Seamless Experience** - User never "leaves" the site
2. **Shared State** - Admin sees real-time bookings without refresh
3. **Easy Navigation** - Simple back button returns to landing
4. **Maintainable** - One codebase instead of two
5. **Professional** - Feels like a proper web application

---

## Summary

| Restaurant | Kitchen | Implementation |
|------------|---------|----------------|
| Landing page | Admin dashboard | Same HTML file |
| Client-facing | Staff-only | Login gate |
| Public access | Password protected | `lexislaw2026` |
| "Book consultation" | "View bookings" | Toggle views |
| One-way | Two-way | Add back button |

**The goal:** Just like a real restaurant - customers enjoy their meal without seeing the kitchen, but the staff can move between kitchen and restaurant through a door. Both exist in the same building.
