// AI Collections Agent Runner
// Scheduled functions that execute automated tasks

import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ═══════════════════════════════════════════════════════════════
// MAIN DAILY AGENT RUNNER
// ═══════════════════════════════════════════════════════════════

/**
 * Main daily agent execution
 * Scans all pending tasks and executes them
 */
export const runDailyAgent = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("🤖 Daily Agent Runner - Starting...");

    const now = Date.now();
    const stats = {
      tasksProcessed: 0,
      paymentsNudged: 0,
      remindersSeent: 0,
      demandsIssued: 0,
      errors: 0,
    };

    // Get all pending agent tasks scheduled for today or earlier
    const tasks = await ctx.db
      .query("agentTasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "pending"),
          q.lte(q.field("scheduledAt"), now)
        )
      )
      .collect();

    console.log(`📋 Found ${tasks.length} pending tasks`);

    // Process each task
    for (const task of tasks) {
      try {
        await processAgentTask(ctx, task);
        stats.tasksProcessed++;

        // Categorize by type
        switch (task.taskType) {
          case "payment_nudge":
            stats.paymentsNudged++;
            break;
          case "reminder":
            stats.remindersSeent++;
            break;
          case "demand":
            stats.demandsIssued++;
            break;
        }
      } catch (error) {
        console.error(`❌ Task ${task._id} failed:`, error.message);
        stats.errors++;

        // Mark task as escalated if it fails
        await ctx.db.patch(task._id, {
          status: "escalated",
          lastContactAt: now,
        });
      }
    }

    console.log("✅ Daily Agent Runner - Complete", stats);

    return stats;
  },
});

/**
 * Process a single agent task
 */
async function processAgentTask(ctx, task) {
  // Get client data
  const client = await ctx.db.get(task.clientId);
  if (!client) {
    throw new Error("Client not found");
  }

  // Based on task type, trigger appropriate action
  switch (task.taskType) {
    case "payment_nudge":
      await processPaymentNudge(ctx, task, client);
      break;

    case "reminder":
      await processCaseReminder(ctx, task, client);
      break;

    case "demand":
      await processPaymentDemand(ctx, task, client);
      break;

    case "cancellation":
      await processCancellation(ctx, task, client);
      break;

    default:
      console.warn(`Unknown task type: ${task.taskType}`);
  }

  // Update task status
  await ctx.db.patch(task._id, {
    status: "sent",
    lastContactAt: Date.now(),
    attemptCount: task.attemptCount + 1,
  });
}

/**
 * Process payment nudge task
 */
async function processPaymentNudge(ctx, task, client) {
  // Parse metadata to get payment record ID
  const metadata = task.metadata ? JSON.parse(task.metadata) : {};
  const paymentRecordId = metadata.paymentRecordId;

  if (!paymentRecordId) {
    throw new Error("Payment record ID not found in task metadata");
  }

  // Schedule the payment reminder action
  await ctx.scheduler.runAfter(0, internal.agent.sendPaymentReminder, {
    clientId: client._id,
    paymentRecordId,
  });
}

/**
 * Process case reminder task
 */
async function processCaseReminder(ctx, task, client) {
  // Parse metadata for event details
  const metadata = task.metadata ? JSON.parse(task.metadata) : {};

  // Generate and send reminder via action
  await ctx.scheduler.runAfter(0, internal.agent.generateAndSendReminder, {
    clientId: client._id,
    taskId: task._id,
    eventDetails: metadata,
  });
}

/**
 * Process payment demand (Letter of Demand)
 */
async function processPaymentDemand(ctx, task, client) {
  const metadata = task.metadata ? JSON.parse(task.metadata) : {};
  const paymentRecordId = metadata.paymentRecordId;

  if (!paymentRecordId) {
    throw new Error("Payment record ID not found in task metadata");
  }

  // Generate formal demand letter
  await ctx.scheduler.runAfter(0, internal.agent.generatePaymentDemand, {
    clientId: client._id,
    paymentRecordId,
    taskId: task._id,
  });
}

/**
 * Process cancellation notification
 */
async function processCancellation(ctx, task, client) {
  const metadata = task.metadata ? JSON.parse(task.metadata) : {};

  await ctx.scheduler.runAfter(0, internal.agent.sendCancellationNotice, {
    clientId: client._id,
    cancellationId: metadata.cancellationId,
  });
}

// ═══════════════════════════════════════════════════════════════
// PAYMENT ESCALATION CHECKER
// ═══════════════════════════════════════════════════════════════

/**
 * Check for payments that need escalation
 * Runs twice daily
 */
export const checkPaymentEscalations = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("💰 Payment Escalation Checker - Starting...");

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const escalationSchedule = {
      0: 3 * oneDayMs,  // Level 0 → 1: After 3 days overdue
      1: 7 * oneDayMs,  // Level 1 → 2: After 7 more days (10 total)
      2: 14 * oneDayMs, // Level 2 → 3: After 14 more days (24 total)
    };

    // Get all unpaid/partial payments
    const payments = await ctx.db
      .query("paymentRecords")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "unpaid"),
          q.eq(q.field("status"), "partial")
        )
      )
      .collect();

    let escalated = 0;
    let tasksCreated = 0;

    for (const payment of payments) {
      // Skip if already at max escalation
      if (payment.escalationLevel >= 3) continue;

      // Check if it's time to escalate
      const timeSinceLastNudge = payment.lastNudgeAt
        ? now - payment.lastNudgeAt
        : now - payment.dueDate;

      const escalationThreshold = escalationSchedule[payment.escalationLevel];

      if (timeSinceLastNudge >= escalationThreshold) {
        const newLevel = payment.escalationLevel + 1;

        // Update escalation level
        await ctx.db.patch(payment._id, {
          escalationLevel: newLevel,
        });

        // Create agent task for new nudge
        const taskType = newLevel === 3 ? "demand" : "payment_nudge";

        await ctx.db.insert("agentTasks", {
          clientId: payment.clientId,
          caseId: payment.caseId,
          taskType,
          status: "pending",
          scheduledAt: now,
          attemptCount: 0,
          channel: "email",
          metadata: JSON.stringify({
            paymentRecordId: payment._id,
            escalationLevel: newLevel,
          }),
        });

        escalated++;
        tasksCreated++;
      }
    }

    console.log(`✅ Payment Escalation Check - Escalated: ${escalated}, Tasks Created: ${tasksCreated}`);

    return { escalated, tasksCreated };
  },
});

// ═══════════════════════════════════════════════════════════════
// CASE REMINDER SCANNER
// ═══════════════════════════════════════════════════════════════

/**
 * Scan for upcoming case events and create reminder tasks
 * Sends reminders at T-7 days, T-2 days, and T-0 (day of)
 */
export const scanCaseReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("📅 Case Reminder Scanner - Starting...");

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Reminder windows
    const reminderWindows = [
      { days: 7, sent: false },  // 1 week before
      { days: 2, sent: false },  // 2 days before
      { days: 0, sent: false },  // Day of
    ];

    // Get all active matters
    const matters = await ctx.db
      .query("matters")
      .filter((q) => q.neq(q.field("status"), "resolved"))
      .collect();

    let remindersCreated = 0;

    for (const matter of matters) {
      // Check if matter has a next court date or event
      // This would be enhanced based on your schema
      // For now, we'll skip if no next_action is set
      if (!matter.next_action) continue;

      // TODO: Parse next_action for date information
      // For MVP, you'd add a `next_event_date` field to matters table

      // Example logic (commented out until schema updated):
      /*
      const eventDate = matter.next_event_date;
      const daysUntilEvent = Math.floor((eventDate - now) / oneDayMs);

      for (const window of reminderWindows) {
        if (daysUntilEvent === window.days) {
          // Check if reminder already sent
          const existingTask = await ctx.db
            .query("agentTasks")
            .filter((q) =>
              q.and(
                q.eq(q.field("clientId"), matter.client_id),
                q.eq(q.field("caseId"), matter._id),
                q.eq(q.field("taskType"), "reminder")
              )
            )
            .first();

          if (!existingTask) {
            await ctx.db.insert("agentTasks", {
              clientId: matter.client_id,
              caseId: matter._id,
              taskType: "reminder",
              status: "pending",
              scheduledAt: now,
              attemptCount: 0,
              channel: "email",
              metadata: JSON.stringify({
                eventDate: eventDate,
                daysUntilEvent,
                eventType: "court_date",
              }),
            });

            remindersCreated++;
          }
        }
      }
      */
    }

    console.log(`✅ Case Reminder Scanner - Reminders Created: ${remindersCreated}`);

    return { remindersCreated };
  },
});

// ═══════════════════════════════════════════════════════════════
// CANCELLATION COOLING-OFF CHECKER
// ═══════════════════════════════════════════════════════════════

/**
 * Check cancellation requests for expired cooling-off periods
 */
export const checkCancellationCoolingOff = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("⏱️  Cancellation Cooling-Off Checker - Starting...");

    const now = Date.now();

    // Get all in-progress cancellations with cooling-off periods
    const cancellations = await ctx.db
      .query("cancellationRequests")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "in_progress"),
          q.gte(q.field("step"), 3) // Step 3 starts cooling-off
        )
      )
      .collect();

    let completed = 0;

    for (const cancellation of cancellations) {
      // Check if cooling-off period has expired
      if (cancellation.coolingOffExpiry && now >= cancellation.coolingOffExpiry) {
        // Move to final step (step 4)
        if (cancellation.step === 3) {
          await ctx.db.patch(cancellation._id, {
            step: 4,
          });
        }
      }
    }

    console.log(`✅ Cancellation Cooling-Off Check - Completed: ${completed}`);

    return { completed };
  },
});
