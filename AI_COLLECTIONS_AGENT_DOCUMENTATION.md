# AI Collections Agent - Complete Implementation Documentation

## 📋 Overview

The AI Collections Agent is a comprehensive automated communication and payment tracking system for Mokoena Legal Services. It uses Claude AI to generate context-aware client communications, automates payment reminders with escalation, and implements a friction-based case cancellation flow.

---

## 🏗️ Architecture

### Technology Stack
- **AI Engine**: Anthropic Claude (claude-sonnet-4-20250514)
- **Email Service**: Resend
- **Database**: Convex (real-time serverless)
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Email Templates**: React Email

### Core Components

```
/convex/
  ├── schema.js              # Database tables (4 new tables added)
  ├── agent.js               # AI prompt generation + email dispatch
  ├── agentRunner.js         # Scheduled task execution logic
  ├── crons.ts               # Cron job configuration
  └── functions.js           # Queries & mutations (extended)

/components/
  ├── admin/agent/           # Admin dashboard components
  │   ├── AgentActivityFeed.tsx
  │   ├── EscalationQueue.tsx
  │   ├── PaymentOverview.tsx
  │   ├── InvoiceManagement.tsx
  │   ├── PaymentRecordForm.tsx
  │   └── CancellationRequests.tsx
  └── portal/
      └── CancellationFlow.tsx  # Client-facing cancellation UI

/emails/
  ├── PaymentReminderEmail.tsx
  └── CaseReminderEmail.tsx

/app/
  ├── admin/page.tsx         # Admin dashboard (updated)
  └── portal/cancel-case/page.tsx  # Client cancellation page
```

---

## 🗄️ Database Schema

### New Tables

#### 1. `agentTasks`
Tracks all automated agent activities.

```javascript
{
  clientId: Id<"clients">,
  caseId?: Id<"matters">,
  taskType: "reminder" | "payment_nudge" | "demand" | "cancellation",
  status: "pending" | "sent" | "escalated" | "resolved",
  scheduledAt: number,         // Unix timestamp
  lastContactAt?: number,      // Unix timestamp
  attemptCount: number,
  generatedMessage?: string,
  channel: "email" | "sms",
  metadata?: string            // JSON string
}
```

**Indexes:** `by_client`, `by_status`, `by_task_type`, `by_scheduled_at`

#### 2. `paymentRecords`
Manages invoices and 4-level payment escalation.

```javascript
{
  clientId: Id<"clients">,
  invoiceId: string,           // Unique invoice reference
  caseId?: Id<"matters">,
  amountDue: number,           // ZAR cents (e.g., 150000 = R1500.00)
  dueDate: number,             // Unix timestamp
  status: "unpaid" | "partial" | "paid" | "disputed",
  escalationLevel: 0 | 1 | 2 | 3,
  lastNudgeAt?: number,        // Unix timestamp
  paidAmount?: number,         // ZAR cents
  paidAt?: number,             // Unix timestamp
  notes?: string
}
```

**Indexes:** `by_client`, `by_invoice`, `by_status`, `by_escalation`, `by_due_date`

#### 3. `communicationLog`
Complete audit trail of all agent communications.

```javascript
{
  clientId: Id<"clients">,
  agentTaskId?: Id<"agentTasks">,
  channel: "email" | "sms" | "whatsapp",
  subject?: string,
  body: string,
  sentAt: number,              // Unix timestamp
  openedAt?: number,           // Unix timestamp
  responseReceived: boolean,
  responseText?: string,
  responseAt?: number,         // Unix timestamp
  status: "sent" | "delivered" | "opened" | "failed" | "bounced"
}
```

**Indexes:** `by_client`, `by_task`, `by_sent_at`, `by_status`

#### 4. `cancellationRequests`
Multi-step friction-based cancellation tracking.

```javascript
{
  clientId: Id<"clients">,
  caseId: Id<"matters">,
  step: 1 | 2 | 3 | 4,
  reason?: string,
  outstandingBalance: number,  // ZAR cents
  acknowledgedConsequences: boolean,
  coolingOffExpiry?: number,   // Unix timestamp (48 hours)
  status: "in_progress" | "completed" | "abandoned",
  initiatedAt: number,         // Unix timestamp
  completedAt?: number,        // Unix timestamp
  notes?: string               // Admin notes
}
```

**Indexes:** `by_client`, `by_case`, `by_status`, `by_initiated_at`

---

## 🤖 AI Prompt Engine

### Claude Integration

The system uses **claude-sonnet-4-20250514** to generate contextually appropriate communications.

#### Prompt Structure

```javascript
const prompt = `You are the professional communications agent for Mokoena Legal Services...

CRITICAL RULES:
- Maintain professional, respectful tone
- Be clear and concise
- Follow South African legal communication standards
- Reference POPIA compliance where appropriate
- Never make threats
- Always provide clear next steps

Generate ONLY the email subject line and body. Format your response as:

SUBJECT: [subject line]

BODY:
[email body]

---

[Task-specific context and instructions]
`;
```

#### Task Types

1. **Payment Nudge** (Levels 0-3)
   - Level 0: Friendly reminder
   - Level 1: Firm notice (5-day deadline)
   - Level 2: Urgent warning (legal action mentioned)
   - Level 3: Formal demand (LOD, 5 business days)

2. **Case Reminder**
   - Court dates (T-7, T-2, T-0)
   - Consultations
   - Document deadlines

3. **Letter of Demand**
   - Formal legal language
   - National Credit Act references
   - Final deadline specification

4. **Cancellation Acknowledgment**
   - Empathetic tone
   - Next steps outlined
   - Outstanding obligations mentioned

---

## ⏰ Automated Scheduling

### Cron Jobs

#### 1. Daily Agent Runner
**Schedule:** 11:00 AM SAST (9:00 UTC)
**Function:** `internal.agentRunner.runDailyAgent`

Processes all pending agent tasks:
- Fetches tasks where `status = "pending"` and `scheduledAt <= now`
- Generates AI messages via Claude
- Dispatches emails via Resend
- Updates task status and attempt count
- Logs all communications

#### 2. Payment Escalation Check
**Schedule:** 11:00 AM & 5:00 PM SAST (9:00 & 15:00 UTC)
**Function:** `internal.agentRunner.checkPaymentEscalations`

Auto-escalates overdue payments:
- **Level 0 → 1:** After 3 days overdue
- **Level 1 → 2:** After 10 days total (7 more days)
- **Level 2 → 3:** After 24 days total (14 more days)

Creates new agent tasks for each escalation.

#### 3. Case Reminder Scanner
**Schedule:** 9:30 AM SAST (7:30 UTC)
**Function:** `internal.agentRunner.scanCaseReminders`

Scans upcoming case events and creates reminders at:
- T-7 days (1 week before)
- T-2 days (2 days before)
- T-0 (day of event)

#### 4. Cancellation Cooling-Off Checker
**Schedule:** Every 6 hours
**Function:** `internal.agentRunner.checkCancellationCoolingOff`

Monitors 48-hour cooling-off periods and auto-advances cancellation steps when expired.

---

## 📊 Admin Dashboard

### Navigation

New "AI Collections Agent" section in sidebar with 5 views:

1. **Agent Activity Feed**
2. **Escalation Queue**
3. **Payment Overview**
4. **Invoice Management** ⭐ NEW
5. **Cancellation Requests**

### Views

#### 1. Agent Activity Feed
**Component:** `AgentActivityFeed.tsx`

Real-time log of all AI agent actions:
- Merged timeline of tasks and communications
- Color-coded by type and urgency
- Status indicators (sent, escalated, failed)
- Relative timestamps (5m ago, 2h ago, etc.)
- Preview of generated messages

**Features:**
- Auto-refreshes with Convex reactivity
- Filterable by type and status
- Shows last 50 activities

#### 2. Escalation Queue
**Component:** `EscalationQueue.tsx`

Displays Level 2+ clients requiring attention:
- 3-tier visual escalation (Orange → Red)
- Days overdue calculation
- Payment details and status
- Quick action buttons (call, email, review demand)
- Admin notes section

**Features:**
- Sorted by escalation level (highest first)
- Outstanding balance highlighted
- Last contact timestamp
- LOD review for Level 3

#### 3. Payment Overview
**Component:** `PaymentOverview.tsx`

Financial dashboard with metrics:
- **Total Outstanding:** Sum of unpaid/partial invoices
- **Total Overdue:** Sum of past-due invoices
- **Total Collected:** Sum of paid invoices
- **Total Invoices:** Count of all invoices

**Breakdowns:**
- Payment Status (unpaid, partial, paid, disputed)
- Escalation Levels (0, 1, 2, 3)

**Features:**
- Brutalist design with color-coded stats
- Hover effects and transitions
- Average days overdue calculation

#### 4. Invoice Management ⭐
**Component:** `InvoiceManagement.tsx`

Complete invoice CRUD interface:
- Create new payment records
- Edit existing invoices
- Search and filter (status, escalation, client)
- Quick stats bar
- Bulk actions

**Features:**
- Modal form for create/edit
- Client and case dropdowns (auto-populated)
- Amount formatting (R1,500.00)
- Escalation level selector
- Admin notes field
- Table with inline actions

**Form Component:** `PaymentRecordForm.tsx`
- Validation (required fields, amount > 0)
- Auto-generated invoice IDs
- Date picker for due dates
- Optional case association
- Real-time error display

#### 5. Cancellation Requests
**Component:** `CancellationRequests.tsx`

Multi-step cancellation tracking:
- 4-step progress stepper
- Outstanding balance display
- Cooling-off timer (48 hours)
- Approve/reject admin actions
- Cancellation reason display

**Features:**
- Active vs completed tabs
- Days in progress calculation
- Contact client button
- Admin override capabilities

---

## 🧑‍💼 Client Portal

### Cancellation Flow
**Route:** `/portal/cancel-case`
**Component:** `CancellationFlow.tsx`

Multi-step friction-based cancellation process:

#### Step 1: Reason Selection
- Radio button selection
- 7 predefined reasons + "Other"
- Custom reason text area
- Validation before proceeding

#### Step 2: Outstanding Balance Review
- Large prominent balance display
- Payment terms outlined
- Alternative payment plan suggestion
- Financial difficulties note

#### Step 3: Consequence Acknowledgment
- 6 key consequences listed with warning icons
- Required checkbox acknowledgment
- Legal implications explained
- "I understand" confirmation

#### Step 4: 48-Hour Cooling-Off Period
- Live countdown timer
- Explanation of waiting period
- "Why the wait?" information box
- Withdraw option available
- Final confirmation (disabled until time expires)

**Features:**
- Progress stepper (visual indicator)
- Back navigation allowed
- Can abandon at any time
- Auto-saves progress in database
- Email confirmations at each step

---

## 📧 Email Templates

### 1. PaymentReminderEmail.tsx

Professional, POPIA-compliant payment reminder with 4 escalation tones.

**Dynamic Elements:**
- Client name personalization
- Invoice details (ID, amount, due date)
- Matter reference (if applicable)
- Escalation-appropriate tone

**Escalation Tones:**

**Level 0 (Friendly):**
```
Subject: Payment Reminder - Invoice INV-12345
Tone: "This is a friendly reminder that payment for invoice..."
Urgency: "We kindly request that you settle..."
```

**Level 1 (Firm):**
```
Subject: Outstanding Payment Notice - Invoice INV-12345
Tone: "Our records indicate that invoice..., due on [date], remains unpaid."
Urgency: "We request payment within 5 business days..."
```

**Level 2 (Urgent):**
```
Subject: URGENT: Payment Required - Invoice INV-12345
Tone: "Despite previous reminders, invoice... remains outstanding..."
Urgency: "Immediate payment required within 3 business days. Failure may result in legal action."
```

**Level 3 (Formal Demand):**
```
Subject: FORMAL DEMAND FOR PAYMENT - Invoice INV-12345
Tone: "This serves as formal notice that invoice... remains unpaid."
Urgency: "You have 5 business days... Failure will result in Letter of Demand and legal proceedings."
```

**Styling:**
- Brutalist design matching LexisLaw branding
- Lexis Red accents (#DC2626)
- Monospace fonts for data
- Payment instructions clearly boxed
- Bank details included

### 2. CaseReminderEmail.tsx

Event reminders for court dates, consultations, and deadlines.

**Event Types:**
- Court appearance
- Consultation appointment
- Document submission deadline
- General events

**Urgency Indicators:**
- **Today:** Red background, "TODAY" emphasis
- **Tomorrow:** Orange background
- **2-3 days:** Yellow background
- **7+ days:** Blue background (informational)

**Checklists:**

**Court Appearance:**
- ✓ Arrive 30 minutes early
- ✓ Bring valid identification
- ✓ Bring all relevant documents
- ✓ Dress formally and conservatively
- ✓ Turn off mobile devices

**Consultation:**
- ✓ Prepare list of questions
- ✓ Bring all relevant documents
- ✓ Arrive 10 minutes early
- ✓ Confirm attendance if unavailable

**Document Deadline:**
- ✓ Ensure documents complete and signed
- ✓ Make copies for records
- ✓ Submit before deadline
- ✓ Request confirmation of receipt

---

## 🔑 Setup Instructions

### 1. Environment Variables

Add to `.env`:

```env
# AI Collections Agent
ANTHROPIC_API_KEY=sk-ant-xxxxx
RESEND_API_KEY=re_xxxxx
```

**Getting API Keys:**

1. **Anthropic API Key:**
   - Sign up at https://console.anthropic.com
   - Navigate to API Keys
   - Create new key
   - Starts with `sk-ant-`

2. **Resend API Key:**
   - Sign up at https://resend.com
   - Navigate to API Keys
   - Create new key
   - Starts with `re_`

### 2. Deploy Convex Schema

```bash
# Start Convex development server
npx convex dev

# Or deploy to production
npx convex deploy
```

This will create the 4 new database tables.

### 3. Configure Resend Email Domain

**Option A: Use Test Domain (Development)**
- Resend provides a test domain automatically
- Emails sent to: `onboarding@resend.dev`
- No verification needed

**Option B: Verify Custom Domain (Production)**
1. Add domain in Resend dashboard
2. Add DNS records (TXT, MX, CNAME)
3. Wait for verification (usually 5-15 minutes)
4. Update `from` address in `/convex/agent.js`:
   ```javascript
   from: "Mokoena Legal Services <collections@mokoenalegal.co.za>"
   ```

### 4. Test the System

#### Create Test Payment Record

1. Navigate to `/admin`
2. Password: `lexislaw2026`
3. Click "Invoice Management" in sidebar
4. Click "New Invoice"
5. Fill form:
   - Select client
   - Enter amount
   - Set due date
   - Set escalation level to 0
6. Click "Create Payment Record"

#### Manually Trigger Agent

```bash
# In Convex dashboard, run internal mutation:
internal.agentRunner.runDailyAgent()
```

#### Check Results

1. **Agent Activity Feed:** See generated task
2. **Communication Log:** View sent email
3. **Client Email:** Check inbox (Resend dashboard)

---

## 📱 Usage Workflows

### Admin Workflow: Creating Invoice

1. Click "Invoice Management" in sidebar
2. Click "New Invoice" button
3. Select client from dropdown
4. (Optional) Select associated case
5. Auto-generated invoice ID appears
6. Enter amount in ZAR (e.g., 1500.00)
7. Select due date
8. Set initial escalation level (usually 0)
9. Add admin notes (optional)
10. Click "Create Payment Record"

**Result:** Invoice created, agent will send initial reminder based on schedule.

### Admin Workflow: Reviewing Escalations

1. Click "Escalation Queue" in sidebar
2. View all Level 2+ clients
3. Sort by escalation level (highest first)
4. Click "Call Client" or "Send Email" for manual follow-up
5. For Level 3: Click "Review Demand Letter"
6. Approve or modify LOD before sending

### Admin Workflow: Monitoring Activity

1. Click "Agent Activity" in sidebar
2. See real-time log of all agent actions
3. Filter by type (payment nudge, reminder, demand)
4. Check message previews
5. Verify delivery status

### Client Workflow: Case Cancellation

1. Navigate to `/portal/cancel-case?ref=REF-12345&balance=150000`
2. Review warning screen and alternatives
3. Click "Proceed with Cancellation"
4. **Step 1:** Select cancellation reason
5. **Step 2:** Review outstanding balance and terms
6. **Step 3:** Acknowledge consequences (6 items)
7. **Step 4:** Wait 48 hours (cooling-off period)
8. After 48 hours: Click "Confirm Cancellation"
9. Receive confirmation email

**Admin Notification:** Appears in "Cancellation Requests" view.

---

## 🧪 Testing Checklist

### Payment Escalation Flow

- [ ] Create payment record with Level 0
- [ ] Wait 3 days (or manually run escalation check)
- [ ] Verify Level 0 → 1 escalation
- [ ] Check email sent (Resend dashboard)
- [ ] Wait 7 days → Level 1 → 2
- [ ] Wait 14 days → Level 2 → 3 (LOD)
- [ ] Verify admin approval required for Level 3

### Cancellation Flow

- [ ] Access `/portal/cancel-case` page
- [ ] Complete Step 1 (reason selection)
- [ ] Complete Step 2 (balance review)
- [ ] Complete Step 3 (consequences acknowledgment)
- [ ] Verify 48-hour timer appears
- [ ] Verify "Confirm" button disabled
- [ ] (Manually set expiry to past) → Button enables
- [ ] Complete cancellation
- [ ] Check admin dashboard for request

### Email Templates

- [ ] Payment reminder Level 0 renders correctly
- [ ] Payment reminder Level 3 (LOD) uses formal language
- [ ] Case reminder includes checklist
- [ ] All emails display in Resend preview
- [ ] Emails are mobile-responsive

### Admin Dashboard

- [ ] All 5 agent views load without errors
- [ ] Payment overview stats calculate correctly
- [ ] Invoice management search works
- [ ] Invoice form validation functions
- [ ] Escalation queue sorts by level
- [ ] Agent activity feed shows recent actions

---

## 🐛 Troubleshooting

### Issue: Emails not sending

**Check:**
1. `RESEND_API_KEY` is set in `.env`
2. Resend domain is verified (production)
3. Check Resend dashboard → Logs for errors
4. Verify `from` address matches verified domain

**Solution:**
```javascript
// In /convex/agent.js, temporarily use test domain:
from: "Mokoena Legal <onboarding@resend.dev>"
```

### Issue: Claude API errors

**Check:**
1. `ANTHROPIC_API_KEY` is set in `.env`
2. API key is valid (check console.anthropic.com)
3. Account has sufficient credits
4. Model name is correct: `claude-sonnet-4-20250514`

**Solution:**
- Regenerate API key
- Check Anthropic dashboard for quota limits

### Issue: Cron jobs not running

**Check:**
1. Convex deployment is production (not dev)
2. `/convex/crons.ts` is deployed
3. Check Convex dashboard → Cron Jobs section
4. Verify time zone (UTC vs SAST)

**Solution:**
```bash
npx convex deploy
# Then check Convex dashboard → Cron Jobs → Should show 4 jobs
```

### Issue: Payment escalation not working

**Check:**
1. Payment record has `status = "unpaid"` or `"partial"`
2. Payment record `dueDate` is in the past
3. Escalation level is < 3
4. Cron job `checkPaymentEscalations` is running

**Debug:**
```javascript
// In Convex dashboard, run:
internal.agentRunner.checkPaymentEscalations()
// Check output for escalated count
```

### Issue: Cancellation timer not updating

**Check:**
1. `coolingOffExpiry` timestamp is set correctly
2. Client browser JavaScript is enabled
3. Component re-renders (React hooks)

**Solution:**
- Check browser console for errors
- Verify `useEffect` hook in `CancellationFlow.tsx`

---

## 🔒 Security & Compliance

### POPIA Compliance

The system is designed with POPIA (Protection of Personal Information Act) compliance:

1. **Consent:**
   - Clients must opt-in to communications
   - `whatsapp_consent` and `popia_consent` fields in database

2. **Data Minimization:**
   - Only collect necessary information
   - Payment data stored securely in Convex

3. **Audit Trail:**
   - `communicationLog` table tracks all communications
   - Timestamps for all actions
   - Ability to prove compliance

4. **Right to Access:**
   - Clients can view their communication history
   - Admin can export data on request

5. **Automated Processing:**
   - Clients informed that communications are AI-generated
   - Email footer: "This is an automated communication from our collections system"

### Data Security

- **API Keys:** Stored in environment variables (never committed)
- **Database:** Convex provides encryption at rest and in transit
- **Email:** Resend uses TLS encryption
- **Authentication:** Admin dashboard password-protected

### Best Practices

- **Never commit `.env` to git**
- **Rotate API keys quarterly**
- **Monitor Resend/Anthropic usage for anomalies**
- **Regular database backups** (Convex automatic)
- **Audit communication logs** monthly

---

## 📈 Future Enhancements

### Phase 6: Email Open Tracking
- Integrate Resend webhooks
- Track email opens in `communicationLog.openedAt`
- Display read receipts in admin dashboard

### Phase 7: SMS Integration
- Add Twilio SMS dispatch
- Multi-channel communications (email + SMS)
- SMS templates for urgent reminders

### Phase 8: WhatsApp Integration
- WhatsApp Business API
- Interactive message templates
- Rich media support (PDFs, payment links)

### Phase 9: Payment Gateway
- Integrate PayFast/Yoco
- Payment links in emails
- Automatic payment record updates on success

### Phase 10: AI Response Parsing
- Detect client email replies
- AI categorization (dispute, payment proof, question)
- Auto-create admin tasks for manual review

### Phase 11: Reporting & Analytics
- Monthly collections report
- Escalation effectiveness metrics
- Revenue forecasting based on escalation levels
- Client retention analysis

---

## 📞 Support

For implementation assistance or bug reports, contact:

**Mokoena Legal Services - IT Department**
Email: dev@mokoenalegal.co.za
Phone: +27 11 XXX XXXX

---

## 📝 Changelog

### Version 1.0.0 (2026-04-29)
- ✅ Initial release
- ✅ 4 new database tables
- ✅ AI prompt engine with Claude
- ✅ 4 automated cron jobs
- ✅ 5 admin dashboard views
- ✅ Invoice management CRUD
- ✅ Multi-step cancellation flow
- ✅ 2 email templates (payment, case reminder)
- ✅ Full POPIA compliance
- ✅ Brutalist design system integration

---

**Built with ❤️ for Mokoena Legal Services**
*Automating collections while maintaining client relationships*
