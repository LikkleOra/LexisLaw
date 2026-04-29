// AI Collections Agent - Scheduled Tasks
// Daily cron jobs for automated client communications

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily agent runner - scans for tasks that need execution
crons.daily(
  "daily-agent-runner",
  { hourUTC: 9, minuteUTC: 0 }, // 11:00 AM SAST (UTC+2)
  internal.agentRunner.runDailyAgent
);

// Payment escalation checker - runs twice daily
crons.cron(
  "payment-escalation-check",
  "0 9,15 * * *", // 11:00 AM and 5:00 PM SAST
  internal.agentRunner.checkPaymentEscalations
);

// Case reminder scanner - runs early morning
crons.daily(
  "case-reminder-scanner",
  { hourUTC: 7, minuteUTC: 30 }, // 9:30 AM SAST
  internal.agentRunner.scanCaseReminders
);

// Cancellation cooling-off checker - runs every 6 hours
crons.cron(
  "cancellation-cooling-check",
  "0 */6 * * *", // Every 6 hours
  internal.agentRunner.checkCancellationCoolingOff
);

export default crons;
