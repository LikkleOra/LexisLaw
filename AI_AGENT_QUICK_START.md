# AI Collections Agent - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Add API Keys (2 minutes)

Open `.env` and add:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
RESEND_API_KEY=re_xxxxx
```

**Where to get keys:**
- **Anthropic:** https://console.anthropic.com → API Keys
- **Resend:** https://resend.com → API Keys

### Step 2: Deploy Database (1 minute)

```bash
npx convex dev
```

This creates 4 new tables:
- ✅ agentTasks
- ✅ paymentRecords
- ✅ communicationLog
- ✅ cancellationRequests

### Step 3: Access Admin Dashboard (30 seconds)

1. Navigate to `http://localhost:3000/admin`
2. Password: `lexislaw2026`
3. Click **"AI Collections Agent"** section in sidebar

You'll see 5 new views:
- 🤖 Agent Activity
- ⚠️ Escalation Queue
- 💰 Payment Overview
- 📄 Invoice Management
- ❌ Cancellations

### Step 4: Create Your First Invoice (1 minute)

1. Click **"Invoice Management"**
2. Click **"New Invoice"** button
3. Fill form:
   - Select a client
   - Amount: `1500.00` (automatically formatted as R1,500.00)
   - Due date: Today's date
   - Escalation: Level 0
4. Click **"Create Payment Record"**

### Step 5: Test the AI Agent (30 seconds)

Option A: **Wait for scheduled run** (11:00 AM SAST tomorrow)

Option B: **Trigger manually** (instant):
1. Open Convex dashboard
2. Run internal mutation:
   ```
   internal.agentRunner.runDailyAgent()
   ```
3. Check **Agent Activity** view for results

---

## ✅ What You Get

### Automated Features (No Manual Work Required)

1. **Daily Payment Reminders** (11:00 AM SAST)
   - AI-generated, context-aware emails
   - Automatically escalates after 3, 10, 24 days
   - Professional tone appropriate to escalation level

2. **Auto-Escalation** (11:00 AM & 5:00 PM SAST)
   - Level 0 → 1 → 2 → 3 (LOD)
   - Creates new tasks automatically
   - Logs all actions

3. **Case Reminders** (9:30 AM SAST)
   - Court dates (7 days, 2 days, day-of)
   - Consultations
   - Document deadlines

4. **Cancellation Monitoring** (Every 6 hours)
   - 48-hour cooling-off periods
   - Auto-advances steps
   - Admin notifications

### Admin Dashboard

5. **Real-Time Monitoring**
   - Live activity feed
   - Payment statistics
   - Escalation queue
   - Invoice management

6. **Client Portal**
   - Multi-step cancellation flow
   - Friction-based retention
   - Email confirmations

---

## 🎯 Common Tasks

### Create Payment Record
Admin → Invoice Management → New Invoice → Fill form → Save

### Review Escalated Clients
Admin → Escalation Queue → See Level 2+ clients → Take action

### Monitor AI Activity
Admin → Agent Activity → See all agent actions in real-time

### Handle Cancellation Request
Admin → Cancellations → Review → Approve/Reject

### Manual Email Send
Invoice Management → Find invoice → Click mail icon → Sends immediately

---

## 🔧 Quick Customization

### Change Email Sender
Edit `/convex/agent.js`:
```javascript
from: "Your Name <your-email@yourdomain.com>"
```

### Adjust Escalation Timing
Edit `/convex/agentRunner.js`:
```javascript
const escalationSchedule = {
  0: 3 * oneDayMs,   // Level 0 → 1: After 3 days (change this)
  1: 7 * oneDayMs,   // Level 1 → 2: After 7 more days
  2: 14 * oneDayMs,  // Level 2 → 3: After 14 more days
};
```

### Change Cron Schedule
Edit `/convex/crons.ts`:
```typescript
crons.daily(
  "daily-agent-runner",
  { hourUTC: 9, minuteUTC: 0 }, // Change time here
  internal.agentRunner.runDailyAgent
);
```

---

## 📊 Quick Stats

After setup, you can immediately:

✅ Track **unlimited invoices**
✅ Send **unlimited AI-generated emails**
✅ Monitor **4-level escalation** automatically
✅ Manage **client cancellations** with friction
✅ View **complete audit trail** of all communications
✅ Generate **professional Letters of Demand**

---

## 🆘 Quick Troubleshooting

### Emails not sending?
```bash
# Check Resend dashboard → Logs
# Verify API key in .env
# Use test domain: onboarding@resend.dev
```

### Agent not running?
```bash
# Deploy Convex:
npx convex deploy

# Check Convex dashboard → Cron Jobs (should show 4)
```

### Dashboard not showing data?
```bash
# Ensure Convex is running:
npx convex dev

# Check browser console for errors
```

---

## 📚 Full Documentation

See `AI_COLLECTIONS_AGENT_DOCUMENTATION.md` for:
- Complete architecture details
- Database schema reference
- Email template customization
- Security & POPIA compliance
- Advanced configuration

---

## 🎉 You're All Set!

The AI Collections Agent is now:
- ✅ Monitoring overdue payments
- ✅ Sending automated reminders
- ✅ Escalating as needed
- ✅ Logging all communications
- ✅ Tracking cancellation requests

**Sit back and let the AI do the work!** 🤖

---

**Questions?** Check the full documentation or contact dev@mokoenalegal.co.za
