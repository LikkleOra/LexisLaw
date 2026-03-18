# LexisLaw UI Redesign - Agent Execution Plan

---

## EXECUTION INSTRUCTIONS

**⚠️ IMPORTANT: Complete tasks ONE AT A TIME, atomically.**

Do NOT attempt to complete multiple tasks or entire phases in a single execution. Work through this plan incrementally:

1. Read the current task's `<action>` and `<verify>` sections
2. Implement ONLY that task
3. Run the verification command
4. Report completion
5. Wait for next instruction

**Rushing leads to bugs. Atomic execution leads to quality.**

---

## PROJECT CONTEXT

### Design Vision
A brutalist legal services platform with:
- Space Grotesk (sans) + JetBrains Mono (mono) typography
- Lexis Black (#0A0A0A), Lexis Red (#E63946), Lexis Green (#2A9D8F), Lexis Grey (#F1F1F1)
- Hard offset shadows, 2px borders, no border-radius
- SPA architecture with AnimatePresence transitions
- Matter Tracker with accordions and progress steppers
- AI Legal Assistant with Gemini API

### Tech Stack
- Next.js 16, React 19, TypeScript (strict)
- Tailwind CSS 4
- Motion (framer-motion)
- Lucide React icons
- Convex backend (or localStorage fallback)

---

## PHASE 1: DESIGN SYSTEM FOUNDATION

---

### Plan 1.1: Design Tokens & Global CSS

**Phase:** 01-design-system  
**Plan:** 01  
**Type:** execute  
**Wave:** 1  
**Depends_on:** []  
**Files_modified:** `app/globals.css`, `tailwind.config.js`

**Objective:**
Update the global CSS with the new design system tokens, brutalist utilities, and typography configuration.

```xml
<task type="auto">
  <name>Update globals.css with design tokens</name>
  <files>app/globals.css</files>
  <action>
    Replace the entire app/globals.css file with:

    1. Import Google Fonts:
       - Space Grotesk (weights: 300,400,500,600,700)
       - JetBrains Mono (weights: 400,500,700)
    
    2. Define CSS variables:
       --lexis-black: #0A0A0A
       --lexis-red: #E63946
       --lexis-green: #2A9D8F
       --lexis-grey: #F1F1F1
       --lexis-dark-grey: #333333
    
    3. Brutalist utility classes:
       - .border-brutal: 2px solid var(--lexis-black)
       - .shadow-brutal: 4px 4px 0px 0px var(--lexis-black)
       - .shadow-brutal-lg: 8px 8px 0px 0px var(--lexis-black)
       - .shadow-brutal-red: 4px 4px 0px 0px var(--lexis-red)
       - .hover-brutal: hover state with shadow shift and translate
       - .font-display: Space Grotesk uppercase tracking-tighter
       - .font-mono: JetBrains Mono
    
    4. Animation keyframes:
       - pageIn (fade + translateY)
       - fadeInUp
       - slamIn (for hero)
    
    5. Button classes:
       - .btn-primary: red bg, white text, brutalist hover
       - .btn-secondary: transparent, border, brutalist hover
    
    6. Form classes:
       - .form-input: dark bg, 2px border, no radius
       - .form-select: same as input
       - .form-textarea: same as input

    DO NOT change the Tailwind directives. Keep @tailwind base/components/utilities.
  </action>
  <verify>cat app/globals.css | grep -c "lexis-"</verify>
  <done>globals.css contains all design tokens and brutalist utilities</done>
</task>

<task type="auto">
  <name>Update Tailwind config with custom colors</name>
  <files>tailwind.config.js</files>
  <action>
    Create or update tailwind.config.js (or tailwind.config.ts) with:

    module.exports = {
      theme: {
        extend: {
          colors: {
            black: '#0A0A0A',
            red: '#E63946',
            green: '#2A9D8F',
            grey: '#F1F1F1',
            'dark-grey': '#333333',
            card: '#1A1A1A',
            'card2': '#252525',
            border: 'rgba(136, 136, 136, 0.5)',
            'border-strong': 'rgba(136, 136, 136, 0.75)',
          },
          fontFamily: {
            sans: ['Space Grotesk', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
            display: ['Space Grotesk', 'sans-serif'],
          },
          boxShadow: {
            'brutal': '4px 4px 0px 0px #0A0A0A',
            'brutal-lg': '8px 8px 0px 0px #0A0A0A',
            'brutal-red': '4px 4px 0px 0px #E63946',
            'brutal-green': '4px 4px 0px 0px #2A9D8F',
          },
          animation: {
            'slam-in': 'slamIn 0.5s ease-out',
            'page-in': 'pageIn 0.4s ease-out',
          },
          keyframes: {
            slamIn: {
              '0%': { transform: 'scale(1.5)', opacity: '0' },
              '100%': { transform: 'scale(1)', opacity: '1' },
            },
          },
        },
      },
    };
  </action>
  <verify>cat tailwind.config.js | grep -c "lexis\|brutal"</verify>
  <done>Tailwind config contains all custom colors and brutalist shadows</done>
</task>
```

---

### Plan 1.2: Type Definitions

**Phase:** 01-design-system  
**Plan:** 02  
**Type:** execute  
**Wave:** 1  
**Depends_on:** [01-design-system-01]  
**Files_modified:** `src/types.ts`

```xml
<task type="auto">
  <name>Create src/types.ts with all interfaces</name>
  <files>src/types.ts</files>
  <action>
    Create src/types.ts with the following interfaces:

    1. Service interface:
       - id: string
       - title: string
       - description: string
       - icon: string (lucide icon name)
       - href: string

    2. Matter interface:
       - _id: string
       - reference: string (format: REF-XXXXX)
       - name: string
       - phone: string
       - email?: string
       - matter: string (matter type)
       - date: string (formatted date)
       - attorney: string
       - status: number (0-4)
       - statusLabel: string
       - updated: string
       - next: string (next action)
       - wa?: string (whatsapp number)
       - caseHistory?: CaseEvent[]
       - parties?: Party[]
       - documents?: Document[]

    3. CaseEvent interface:
       - id: string
       - date: string
       - title: string
       - description: string
       - type: 'update' | 'document' | 'hearing' | 'milestone'

    4. Party interface:
       - id: string
       - name: string
       - role: string
       - contact: string
       - verified: boolean

    5. Document interface:
       - id: string
       - name: string
       - type: string
       - status: 'verified' | 'pending' | 'required'
       - date: string

    6. Booking interface:
       - _id: string
       - client_name: string
       - client_phone: string
       - client_email?: string
       - matter_type: string
       - preferred_date: string
       - preferred_time: string
       - description?: string
       - status: 'pending' | 'confirmed' | 'in_progress' | 'resolved'
       - reference: string
       - created: string

    7. Message interface (for AI chat):
       - id: string
       - role: 'user' | 'assistant'
       - content: string
       - timestamp: Date

    8. Status enum/mapping:
       - PENDING = 0
       - IN_PROGRESS = 1
       - AWAITING_DOCS = 2
       - HEARING = 3
       - RESOLVED = 4

    Export all interfaces and a statusLabels object mapping status numbers to strings.
  </action>
  <verify>cat src/types.ts | grep -c "export interface"</verify>
  <done>src/types.ts contains all type definitions, at least 7 interfaces exported</done>
</task>
```

---

## PHASE 2: CORE COMPONENTS

---

### Plan 2.1: Button & Input Components

**Phase:** 02-components  
**Plan:** 01  
**Type:** execute  
**Wave:** 1  
**Depends_on:** [01-design-system-02]  
**Files_modified:** `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`

```xml
<task type="auto">
  <name>Create Button component</name>
  <files>src/components/ui/Button.tsx</files>
  <action>
    Create src/components/ui/Button.tsx with:

    1. Props interface:
       - variant: 'primary' | 'secondary' | 'ghost' | 'danger'
       - size: 'sm' | 'md' | 'lg'
       - disabled?: boolean
       - className?: string
       - ...ButtonHTMLAttributes<HTMLButtonElement>

    2. Variants:
       - primary: bg-red, white text, shadow-brutal-red on hover, translate(-2px, -2px)
       - secondary: transparent, white border, white text, shadow-brutal on hover
       - ghost: transparent, no border, text-white, hover:bg-white/10
       - danger: bg-red, darker red on hover

    3. Sizes:
       - sm: px-4 py-2, text-xs
       - md: px-6 py-3, text-sm
       - lg: px-8 py-4, text-base

    4. Use Space Grotesk font, uppercase, tracking-widest
    5. Add transition-all duration-200
    6. Add focus-visible:ring-2 ring-red ring-offset-2 ring-offset-black
  </action>
  <verify>cat src/components/ui/Button.tsx | grep -c "variant"</verify>
  <done>Button component exists with all variants and sizes</done>
</task>

<task type="auto">
  <name>Create Input component</name>
  <files>src/components/ui/Input.tsx</files>
  <action>
    Create src/components/ui/Input.tsx with:

    1. Props interface:
       - label?: string
       - error?: string
       - className?: string
       - ...InputHTMLAttributes<HTMLInputElement>

    2. Design:
       - Label above input (font-mono text-xs uppercase tracking-widest text-grey)
       - Input: bg-card, 2px border-border-strong, text-white
       - Focus: border-red, shadow-brutal-red/20
       - Error state: border-red, error message below in text-red text-xs
       - Placeholder: text-grey

    3. No border-radius (brutalist)
    4. Use Inter font, px-4 py-3
  </action>
  <verify>cat src/components/ui/Input.tsx | grep -c "Input"</verify>
  <done>Input component exists with label and error states</done>
</task>
```

---

### Plan 2.2: Card & Badge Components

**Phase:** 02-components  
**Plan:** 02  
**Type:** execute  
**Wave:** 1  
**Depends_on:** [02-components-01]  
**Files_modified:** `src/components/ui/Card.tsx`, `src/components/ui/Badge.tsx`

```xml
<task type="auto">
  <name>Create Card component</name>
  <files>src/components/ui/Card.tsx</files>
  <action>
    Create src/components/ui/Card.tsx with:

    1. Props interface:
       - variant: 'default' | 'highlighted' | 'success' | 'error'
       - padding?: 'none' | 'sm' | 'md' | 'lg'
       - className?: string
       - children: React.ReactNode

    2. Variants:
       - default: bg-card, border-2 border-border
       - highlighted: bg-card, border-l-4 border-l-red
       - success: bg-card, border-l-4 border-l-green
       - error: bg-card, border-l-4 border-l-red

    3. Padding options:
       - none: p-0
       - sm: p-4
       - md: p-6
       - lg: p-8

    4. Optional shadow prop for hard offset shadow (shadow-brutal)
  </action>
  <verify>cat src/components/ui/Card.tsx | grep -c "variant"</verify>
  <done>Card component exists with all variants</done>
</task>

<task type="auto">
  <name>Create Badge component</name>
  <files>src/components/ui/Badge.tsx</files>
  <action>
    Create src/components/ui/Badge.tsx with:

    1. Props interface:
       - variant: 'pending' | 'progress' | 'verified' | 'warning' | 'error'
       - size?: 'sm' | 'md'
       - children: React.ReactNode

    2. Variants:
       - pending: bg-grey/20, text-dark-grey
       - progress: bg-yellow-500/20, text-yellow-500
       - verified: bg-green/20, text-green
       - warning: bg-orange-500/20, text-orange-500
       - error: bg-red/20, text-red

    3. Size:
       - sm: text-[10px], px-2 py-0.5
       - md: text-xs, px-3 py-1

    4. Use font-mono, uppercase, tracking-widest
  </action>
  <verify>cat src/components/ui/Badge.tsx | grep -c "variant"</verify>
  <done>Badge component exists with status variants</done>
</task>
```

---

### Plan 2.3: Layout Components

**Phase:** 02-components  
**Plan:** 03  
**Type:** execute  
**Wave:** 2  
**Depends_on:** [02-components-02]  
**Files_modified:** `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`

```xml
<task type="auto">
  <name>Create Navbar component</name>
  <files>src/components/layout/Navbar.tsx</files>
  <action>
    Create src/components/layout/Navbar.tsx with:

    1. Design:
       - Sticky top-0, z-50
       - bg-black, border-b-2 border-border
       - Height: 80px desktop, 64px mobile

    2. Logo:
       - "MOKOENA" in font-display text-2xl tracking-widest
       - "LEGAL" in text-red
       - Link to home "/"

    3. Desktop navigation:
       - Horizontal links: Services, About, Tracker, Admin
       - Use Space Grotesk, uppercase, tracking-widest, text-sm
       - Active link: text-red
       - Hover: underline offset

    4. Mobile menu:
       - Hamburger icon (3 lines)
       - Full-screen overlay menu
       - Slide in from right

    5. CTA button: "Book Consultation" - btn-primary style
  </action>
  <verify>cat src/components/layout/Navbar.tsx | grep -c "nav\|link"</verify>
  <done>Navbar component exists with responsive mobile menu</done>
</task>

<task type="auto">
  <name>Create Footer component</name>
  <files>src/components/layout/Footer.tsx</files>
  <action>
    Create src/components/layout/Footer.tsx with:

    1. Design:
       - bg-black, border-t-2 border-border
       - pt-12 pb-8

    2. Logo section:
       - MOKOENA LEGAL text
       - Brief tagline

    3. Links grid (4 columns desktop, 2 mobile):
       - Services (Family Law, Criminal Defence, etc.)
       - Legal (Privacy Policy, Terms, POPIA)
       - Contact (phone, email, address)
       - Quick (Book, Track, Admin)

    4. Bottom bar:
       - Copyright text
       - "POPIA COMPLIANT" badge
  </action>
  <verify>cat src/components/layout/Footer.tsx | grep -c "footer\|link"</verify>
  <done>Footer component exists with all sections</done>
</task>
```

---

## PHASE 3: PAGE SECTIONS

---

### Plan 3.1: Hero & Services Section

**Phase:** 03-pages  
**Plan:** 01  
**Type:** execute  
**Wave:** 1  
**Depends_on:** [02-components-03]  
**Files_modified:** `src/components/sections/Hero.tsx`, `src/components/sections/Services.tsx`

```xml
<task type="auto">
  <name>Create Hero component</name>
  <files>src/components/sections/Hero.tsx</files>
  <action>
    Create src/components/sections/Hero.tsx with:

    1. Layout:
       - Full viewport height (min-h-[calc(100vh-80px)])
       - Grid: 2 columns on lg (50/50 split)

    2. Left content:
       - Tag line: "PREMIUM LEGAL SERVICES" (font-mono text-xs tracking-widest text-red)
       - Main heading: "Justice Simplified." (font-display text-7xl xl:text-8xl)
       - "Simplified" in text-red, block
       - Description paragraph with green left border
       - Two CTA buttons: "Start Consultation" (primary), "Track My Matter" (secondary)
       - Stats row: 15+ Years, 500+ Cases, 24/7 Support

    3. Right content:
       - Large brutalist card with services preview
       - Or abstract legal imagery with grayscale filter

    4. Animations:
       - Hero text: animate-slam-in on load
       - Stats: staggered fadeInUp

    5. Import and use Button component from ../ui/Button
  </action>
  <verify>cat src/components/sections/Hero.tsx | grep -c "Hero"</verify>
  <done>Hero component exists with massive typography and CTAs</done>
</task>

<task type="auto">
  <name>Create Services bento grid</name>
  <files>src/components/sections/Services.tsx</files>
  <action>
    Create src/components/sections/Services.tsx with:

    1. Bento grid layout:
       - 3 columns on lg, 2 on md, 1 on mobile
       - Gap-4 with brutalist cards

    2. Services data (6 items):
       - Family Law (with Scale icon)
       - Criminal Defence (with Shield icon)
       - Commercial Law (with Briefcase icon)
       - Property Law (with Building icon)
       - Civil Litigation (with Gavel icon)
       - Debt Collection (with DollarSign icon)

    3. Each service card:
       - Icon in text-red
       - Title in font-display uppercase
       - Short description
       - Arrow link "Learn more →"
       - Hover: shadow-brutal-lg, translate(-4px, -4px)

    4. Import Service type from ../../types
    5. Use Lucide icons
  </action>
  <verify>cat src/components/sections/Services.tsx | grep -c "Service"</verify>
  <done>Services section exists with bento grid layout</done>
</task>
```

---

### Plan 3.2: Booking Flow

**Phase:** 03-pages  
**Plan:** 02  
**Type:** execute  
**Wave:** 2  
**Depends_on:** [03-pages-01]  
**Files_modified:** `src/components/booking/BookingFlow.tsx`, `src/components/booking/BookingForm.tsx`

```xml
<task type="auto">
  <name>Create BookingFlow component</name>
  <files>src/components/booking/BookingFlow.tsx</files>
  <action>
    Create src/components/booking/BookingFlow.tsx with:

    1. Multi-step form with progress bar:
       - Step 1: Personal Info (name, phone, email)
       - Step 2: Matter Type (dropdown selection)
       - Step 3: Date & Time (date picker, time slots)
       - Step 4: Confirmation (summary + submit)

    2. Progress bar:
       - 4 steps with labels
       - Red fill for completed/current steps
       - Step numbers in circles

    3. State management:
       - currentStep: number (1-4)
       - formData: object with all fields
       - isSubmitting: boolean
       - result: booking result or null

    4. Navigation:
       - "Back" button (secondary)
       - "Next" / "Submit" button (primary)
       - Validation before moving to next step

    5. Use Input, Button, Select from ../ui

    6. On submit, call api.createBooking(formData)
    7. Show confirmation with reference number
  </action>
  <verify>cat src/components/booking/BookingFlow.tsx | grep -c "step"</verify>
  <done>BookingFlow exists with 4-step form and progress bar</done>
</task>

<task type="auto">
  <name>Create Select component</name>
  <files>src/components/ui/Select.tsx</files>
  <action>
    Create src/components/ui/Select.tsx with:

    1. Props interface:
       - label?: string
       - error?: string
       - options: { value: string; label: string }[]
       - className?: string
       - ...SelectHTMLAttributes<HTMLSelectElement>

    2. Design matches Input component:
       - Label above
       - Same border/focus styles
       - Custom arrow icon (chevron-down)

    3. Include placeholder option handling
  </action>
  <verify>cat src/components/ui/Select.tsx | grep -c "Select"</verify>
  <done>Select component exists with matching styles</done>
</task>
```

---

### Plan 3.3: Matter Tracker

**Phase:** 03-pages  
**Plan:** 03  
**Type:** execute  
**Wave:** 2  
**Depends_on:** [03-pages-02]  
**Files_modified:** `src/components/tracker/Tracker.tsx`, `src/components/tracker/ProgressStepper.tsx`, `src/components/tracker/MatterDetails.tsx`

```xml
<task type="auto">
  <name>Create Tracker main component</name>
  <files>src/components/tracker/Tracker.tsx</files>
  <action>
    Create src/components/tracker/Tracker.tsx with:

    1. Search interface:
       - Large bold input (REF-00000 placeholder)
       - "Track" button with magnifying glass icon
       - Input in font-mono, tracking-widest, uppercase
       - Brutalist styling (2px border, no radius)

    2. State:
       - reference: string
       - matter: Matter | null
       - loading: boolean
       - notFound: boolean

    3. On search submit:
       - Call api.getMatterByReference(reference)
       - Show loading state
       - Display result or "Not Found" message

    4. Import Matter type from ../../types
    5. Import api from lib/api
  </action>
  <verify>cat src/components/tracker/Tracker.tsx | grep -c "Tracker"</verify>
  <done>Tracker component exists with search functionality</done>
</task>

<task type="auto">
  <name>Create ProgressStepper component</name>
  <files>src/components/tracker/ProgressStepper.tsx</files>
  <action>
    Create src/components/tracker/ProgressStepper.tsx with:

    1. Props:
       - currentStep: number (0-4)
       - steps: string[] (default: ['Pending', 'In Progress', 'Awaiting Docs', 'Hearing', 'Resolved'])

    2. Design:
       - Horizontal bar with 5 circles
       - Progress fill from left (red color)
       - Each circle: 16px, border-2
       - Completed: bg-red, border-red
       - Current: border-red, pulsing glow
       - Pending: border-grey, bg-transparent

    3. Labels below each step:
       - font-mono text-[9px] uppercase tracking-widest
       - Active: text-white, others: text-grey

    4. Connecting lines between circles
  </action>
  <verify>cat src/components/tracker/ProgressStepper.tsx | grep -c "step"</verify>
  <done>ProgressStepper exists with 5-step horizontal display</done>
</task>

<task type="auto">
  <name>Create MatterDetails component</name>
  <files>src/components/tracker/MatterDetails.tsx</files>
  <action>
    Create src/components/tracker/MatterDetails.tsx with:

    1. Props:
       - matter: Matter

    2. Header:
       - Reference number (font-mono text-lg)
       - Status badge
       - WhatsApp button if phone available

    3. Info grid (3 columns):
       - Client name
       - Matter type
       - Appointment date
       - Attorney
       - Last Updated
       - Next Action

    4. Include ProgressStepper component
    5. Card styling with green border for success
  </action>
  <verify>cat src/components/tracker/MatterDetails.tsx | grep -c "Matter"</verify>
  <done>MatterDetails exists with info grid and progress stepper</done>
</task>
```

---

### Plan 3.4: Legal Assistant (AI Chat)

**Phase:** 03-pages  
**Plan:** 04  
**Type:** execute  
**Wave:** 3  
**Depends_on:** [03-pages-03]  
**Files_modified:** `src/components/assistant/LegalAssistant.tsx`

```xml
<task type="auto">
  <name>Create LegalAssistant chat widget</name>
  <files>src/components/assistant/LegalAssistant.tsx</files>
  <action>
    Create src/components/assistant/LegalAssistant.tsx with:

    1. Fixed position:
       - Bottom-right corner
       - Fixed size: 400px wide, 600px tall
       - Toggle button to open/close (chat bubble icon)

    2. Chat interface:
       - Header: "Legal Assistant" with close button
       - Message list: scrollable, newest at bottom
       - Input: text field + send button

    3. Message bubbles:
       - User: right-aligned, bg-red text-white
       - Assistant: left-aligned, bg-card border
       - font-mono text-sm
       - Timestamp on each message

    4. System prompt context:
       - Act as "LexisLaw Digital Assistant"
       - Professional tone
       - Include legal disclaimers when needed

    5. API integration:
       - Use @google/generative-ai SDK
       - Send messages to Gemini
       - Handle streaming responses
       - Show loading bubble while waiting

    6. State:
       - messages: Message[]
       - isOpen: boolean
       - isLoading: boolean
       - input: string

    7. On send:
       - Add user message
       - Call Gemini API
       - Add assistant response
       - Scroll to bottom
  </action>
  <verify>cat src/components/assistant/LegalAssistant.tsx | grep -c "Message"</verify>
  <done>LegalAssistant exists with chat UI and Gemini integration</done>
</task>
```

---

## PHASE 4: PAGE ASSEMBLY

---

### Plan 4.1: Main App Shell

**Phase:** 04-assembly  
**Plan:** 01  
**Type:** execute  
**Wave:** 1  
**Depends_on:** [03-pages-04]  
**Files_modified:** `app/page.tsx`

```xml
<task type="auto">
  <name>Assemble main page with all sections</name>
  <files>app/page.tsx</files>
  <action>
    Update app/page.tsx to be a 'use client' component that:

    1. Import all sections:
       - Navbar from @/components/layout/Navbar
       - Hero from @/components/sections/Hero
       - Services from @/components/sections/Services
       - BookingFlow from @/components/booking/BookingFlow
       - Footer from @/components/layout/Footer
       - LegalAssistant from @/components/assistant/LegalAssistant

    2. State management (optional - can be simple scroll SPA):
       - currentView: 'home' | 'booking'
       - Or just use anchor links (#booking)

    3. Page structure:
       - <Navbar />
       - <Hero />
       - <Services />
       - <div id="booking"><BookingFlow /></div>
       - <Footer />
       - <LegalAssistant />

    4. Keep the design brutalist:
       - bg-black
       - Lexis Red accents
       - Hard shadows

    5. This becomes the new landing page
  </action>
  <verify>cat app/page.tsx | grep -c "Hero\|Services\|Booking"</verify>
  <done>app/page.tsx assembles all main page sections</done>
</task>
```

---

### Plan 4.2: Admin Dashboard

**Phase:** 04-assembly  
**Plan:** 02  
**Type:** execute  
**Wave:** 2  
**Depends_on:** [04-assembly-01]  
**Files_modified:** `app/admin/page.tsx`, `src/components/admin/Sidebar.tsx`

```xml
<task type="auto">
  <name>Create Admin Sidebar component</name>
  <files>src/components/admin/Sidebar.tsx</files>
  <action>
    Create src/components/admin/Sidebar.tsx with:

    1. Fixed left sidebar:
       - Width: 280px
       - bg-black2, border-r-2 border-border
       - Height: 100vh (sticky)

    2. Logo at top:
       - MOKOENA LEGAL text

    3. Navigation items:
       - Bookings (with pending count badge)
       - Matters
       - Clients
       - Documents
       - SMS Logs

    4. Active state:
       - border-l-4 border-red
       - text-red bg-red/5
       - Hover: bg-white/5

    5. Logout button at bottom

    6. Props:
       - currentView: string
       - onViewChange: function
       - bookings: Booking[]
  </action>
  <verify>cat src/components/admin/Sidebar.tsx | grep -c "Sidebar"</verify>
  <done>Sidebar component exists with navigation</done>
</task>

<task type="auto">
  <name>Update admin page with new dashboard</name>
  <files>app/admin/page.tsx</files>
  <action>
    Update app/admin/page.tsx to:

    1. Keep the login system (password: lexislaw2026)

    2. After login, show dashboard with:
       - Sidebar (import from @/components/admin/Sidebar)
       - Main content area

    3. Views (switch based on sidebar selection):
       - Bookings: Table with all bookings, status badges, update button
       - Matters: Table with matters, progress stepper
       - Simple placeholder views for Clients, Documents, SMS

    4. Stats row at top:
       - Total Bookings
       - Pending
       - Confirmed
       - Today's bookings

    5. Use Card, Badge, Button from @/components/ui
    6. Load data with api.getBookings(), api.getMatters()
    7. Modal for updating matter status
  </action>
  <verify>cat app/admin/page.tsx | grep -c "Sidebar\|Bookings\|Matters"</verify>
  <done>Admin page exists with sidebar navigation and data tables</done>
</task>
```

---

## PHASE 5: DATA LAYER

---

### Plan 5.1: API Client Update

**Phase:** 05-data  
**Plan:** 01  
**Type:** execute  
**Wave:** 1  
**Depends_on:** [04-assembly-02]  
**Files_modified:** `src/lib/api.ts`

```xml
<task type="auto">
  <name>Update API client with proper Convex integration</name>
  <files>src/lib/api.ts</files>
  <action>
    Update src/lib/api.ts to:

    1. Keep the existing Convex URL structure:
       const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '...'

    2. Export a typed api object with:
       - createBooking(data: BookingInput): Promise<BookingResult>
       - getMatterByReference(ref: string): Promise<Matter | null>
       - getBookings(): Promise<Booking[]>
       - getMatters(): Promise<Matter[]>
       - updateMatterStatus(ref: string, status: number, nextAction: string): Promise<void>

    3. Convex integration:
       - convexQuery(path, args)
       - convexMutation(path, args)
       - Proper error handling

    4. Fallback to localStorage:
       - If Convex fails, use localStorage
       - Store in localStorage keys: 'lexislaw_bookings', 'lexislaw_matters'
       - Generate REF-XXXXX references

    5. Import types from ../types
    6. Add proper TypeScript types throughout
  </action>
  <verify>cat src/lib/api.ts | grep -c "export const api"</verify>
  <done>API client exists with typed functions and localStorage fallback</done>
</task>
```

---

## VERIFICATION CHECKLIST

After completing all plans, verify:

- [ ] `npm run build` completes without errors
- [ ] All pages render correctly
- [ ] Booking form submits and shows confirmation
- [ ] Tracker searches and displays results
- [ ] Admin dashboard loads with data
- [ ] AI chat responds to messages
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] TypeScript compiles with no errors

---

## ATOMIC EXECUTION REMINDER

**DO NOT SKIP THIS:**

When executing this plan, follow this sequence:

1. **Read** the current task's action and verify sections
2. **Implement** only that one task
3. **Verify** by running the specified command
4. **Commit** with atomic message: `feat: [task name]`
5. **Report** completion and wait for next task

**Bad:** "I'll do tasks 1, 2, 3, 4, 5 all at once"  
**Good:** "Completing task 1.1, now verifying..."

---

## FILE STRUCTURE (FINAL TARGET)

```
src/
├── types.ts                    # All TypeScript interfaces
├── lib/
│   └── api.ts                 # API client with Convex + localStorage
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   └── Services.tsx
│   ├── booking/
│   │   └── BookingFlow.tsx
│   ├── tracker/
│   │   ├── Tracker.tsx
│   │   ├── ProgressStepper.tsx
│   │   └── MatterDetails.tsx
│   ├── assistant/
│   │   └── LegalAssistant.tsx
│   └── admin/
│       └── Sidebar.tsx
└── app/
    ├── globals.css            # Design tokens & brutalist utilities
    ├── page.tsx               # Main landing page
    └── admin/
        └── page.tsx           # Admin dashboard
```

---

**PLAN VERSION:** 1.0  
**GENERATED:** 2026-03-18  
**STATUS:** Ready for Execution
