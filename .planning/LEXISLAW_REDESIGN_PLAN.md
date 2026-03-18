# LexisLaw UI Redesign - Project Plan

## Overview
Complete redesign of the LexisLaw frontend with a new brutalist design system, SPA architecture, and proper data layer integration.

---

## Phase 1: Design System Foundation
**Goal:** Establish the design tokens and typography

### Plan 1.1: Design Tokens & CSS Variables
- **Files:** `app/globals.css`
- **Tasks:**
  - Update color palette (Lexis Black #0A0A0A, Lexis Red #E63946, Lexis Green #2A9D8F, Lexis Grey #F1F1F1, Lexis Dark Grey #333333)
  - Configure Tailwind with custom colors
  - Add brutalist utility classes (hard shadows, 2px borders)
  - Set up Space Grotesk + JetBrains Mono fonts

### Plan 1.2: Type Definitions
- **Files:** `src/types.ts` (create)
- **Tasks:**
  - Service interface
  - Matter interface (with status, parties, documents)
  - Party interface
  - Document interface
  - Booking interface
  - Message interface (for AI chat)

---

## Phase 2: Core Components
**Goal:** Build reusable component library

### Plan 2.1: Button & Input Components
- **Files:** `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Select.tsx`
- **Tasks:**
  - Brutalist button variants (primary, secondary, ghost)
  - Input with 2px border, hard shadow on focus
  - Select dropdown

### Plan 2.2: Layout Components
- **Files:** `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Container.tsx`
- **Tasks:**
  - Sticky header with brutalist logo
  - Mobile drawer
  - Footer with links

### Plan 2.3: Card & Badge Components
- **Files:** `src/components/ui/Card.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/StatusBadge.tsx`
- **Tasks:**
  - Card with hard offset shadow
  - Status badge variants (pending, progress, verified, etc.)

---

## Phase 3: Page Components
**Goal:** Build each major page section

### Plan 3.1: Hero & Services Section
- **Files:** `src/components/sections/Hero.tsx`, `src/components/sections/Services.tsx`
- **Tasks:**
  - Massive typography hero (8xl)
  - Slam-in animation
  - Bento-grid services showcase

### Plan 3.2: Booking Flow
- **Files:** `src/components/booking/BookingFlow.tsx`, `src/components/booking/BookingSteps.tsx`, `src/components/booking/BookingForm.tsx`
- **Tasks:**
  - Multi-step form with progress bar
  - Step 1: Client info (name, phone, email)
  - Step 2: Matter type selection
  - Step 3: Date/time picker
  - Step 4: Confirmation

### Plan 3.3: Matter Tracker
- **Files:** `src/components/tracker/SearchInput.tsx`, `src/components/tracker/ProgressStepper.tsx`, `src/components/tracker/MatterDetails.tsx`, `src/components/tracker/Accordion.tsx`
- **Tasks:**
  - Search with reference lookup
  - Horizontal stepper with red fill
  - Accordion sections (case history, parties, documents)
  - Timeline component

### Plan 3.4: Legal Assistant (AI Chat)
- **Files:** `src/components/assistant/LegalAssistant.tsx`, `src/components/assistant/ChatBubble.tsx`
- **Tasks:**
  - Fixed-position chat widget
  - Streaming message UI
  - Message bubbles styled as brutalist cards
  - Gemini API integration

---

## Phase 4: Page Assembly
**Goal:** Wire up pages with state management

### Plan 4.1: Main App Shell
- **Files:** `src/App.tsx`
- **Tasks:**
  - View state management (landing, booking, tracker)
  - AnimatePresence for transitions
  - View switching logic

### Plan 4.2: Admin Dashboard
- **Files:** `src/components/admin/AdminDashboard.tsx`, `src/components/admin/BookingsTable.tsx`, `src/components/admin/MattersTable.tsx`
- **Tasks:**
  - Sidebar navigation
  - Bookings management view
  - Matters tracking view
  - Status update modal

---

## Phase 5: Data Layer
**Goal:** Connect to backend

### Plan 5.1: API Client
- **Files:** `src/lib/api.ts` (update existing)
- **Tasks:**
  - Convex integration with proper error handling
  - LocalStorage fallback for demo
  - CRUD operations for bookings/matters

### Plan 5.2: Convex Backend (if needed)
- **Files:** `convex/schema.ts`, `convex/functions.ts`
- **Tasks:**
  - Database schema
  - API functions for CRUD

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Animation | Motion (framer-motion) |
| Icons | Lucide React |
| State | React useState + Context |
| Backend | Convex (or fallback to localStorage) |
| AI | Gemini API (@google/genai) |

---

## File Structure (Target)

```
src/
├── App.tsx                 # Main app shell
├── types.ts               # Type definitions
├── lib/
│   └── api.ts             # Data layer
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── StatusBadge.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   └── About.tsx
│   ├── booking/
│   │   ├── BookingFlow.tsx
│   │   ├── BookingForm.tsx
│   │   └── BookingConfirmation.tsx
│   ├── tracker/
│   │   ├── SearchInput.tsx
│   │   ├── ProgressStepper.tsx
│   │   ├── MatterDetails.tsx
│   │   └── Accordion.tsx
│   ├── assistant/
│   │   ├── LegalAssistant.tsx
│   │   └── ChatBubble.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── BookingsTable.tsx
│       └── MattersTable.tsx
└── styles/
    └── animations.ts      # Motion variants
```

---

## Design Tokens (Implementation)

```css
/* Colors */
--lexis-black: #0A0A0A;
--lexis-red: #E63946;
--lexis-green: #2A9D8F;
--lexis-grey: #F1F1F1;
--lexis-dark-grey: #333333;

/* Typography */
font-family-sans: 'Space Grotesk', sans-serif;
font-family-mono: 'JetBrains Mono', monospace;

/* Brutalist Shadows */
--shadow-brutal: 4px 4px 0px 0px rgba(10, 10, 10, 1);
--shadow-brutal-lg: 8px 8px 0px 0px rgba(10, 10, 10, 1);
--shadow-brutal-red: 4px 4px 0px 0px #E63946;

/* Borders */
--border-brutal: 2px solid #0A0A0A;
```

---

## Success Criteria

1. ✅ All pages render with new design system
2. ✅ Booking flow creates bookings successfully
3. ✅ Matter tracker searches and displays results
4. ✅ AI assistant responds to queries
5. ✅ Admin dashboard manages bookings/matters
6. ✅ Animations are smooth (60fps)
7. ✅ Mobile responsive
8. ✅ TypeScript compiles without errors

---

## Effort Estimate

| Phase | Plans | Complexity |
|-------|-------|------------|
| Design System | 2 | Medium |
| Components | 3 | Medium |
| Pages | 4 | High |
| Assembly | 2 | Medium |
| Data Layer | 2 | Medium |
| **Total** | **13** | **~6-8 hours** |

---

## Next Steps

1. **Approve this plan** 
2. Start with **Plan 1.1** - Design Tokens & CSS
3. Work through phases sequentially
4. Test each phase before moving on
