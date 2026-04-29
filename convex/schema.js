// LexisLaw Database Schema for Convex
// Define your tables and their structure

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Attorneys who work at the firm
  attorneys: defineTable({
    name: v.string(),
    email: v.string(),
    initials: v.string(),
    specialty: v.string(),
    activeCases: v.number(),
    resolvedCases: v.number(),
    specializations: v.array(v.string()), // Existing field, keeping for compatibility
  }).index("by_email", ["email"]),

  // Clients who book consultations (linked to Clerk)
  clients: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    clerk_id: v.optional(v.string()), // Clerk user ID
    whatsapp_consent: v.boolean(),
    popia_consent: v.boolean(),
  })
    .index("by_phone", ["phone"])
    .index("by_clerk_id", ["clerk_id"]),

  // Booking records for consultations
  bookings: defineTable({
    client_id: v.id("clients"),
    ref: v.string(), // e.g., REF-XXXXX
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    matter: v.string(), // Corresponds to matter_type
    date: v.string(), // Corresponds to preferred_date
    time: v.string(), // Corresponds to preferred_time
    attorney: v.optional(v.string()), // Attorney name or ID
    matter_type: v.string(), // Existing, keeping for compatibility
    preferred_date: v.string(), // Existing, keeping for compatibility
    preferred_time: v.string(), // Existing, keeping for compatibility
    description: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("in-progress"),
      v.literal("awaiting"),
      v.literal("hearing"),
      v.literal("resolved"),
      v.literal("confirmed"), // Compatibility
      v.literal("completed"), // Compatibility
      v.literal("cancelled") // Compatibility
    ),
    bookingStatus: v.optional(v.string()), // Specialized booking status
    created: v.string(), // ISO format
    updated: v.string(), // ISO format
  })
    .index("by_client", ["client_id"])
    .index("by_ref", ["ref"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // Matters (legal cases)
  matters: defineTable({
    booking_id: v.id("bookings"),
    client_id: v.id("clients"),
    reference: v.string(), // REF-XXXXX format
    attorney_id: v.optional(v.id("attorneys")),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("awaiting_docs"),
      v.literal("hearing"),
      v.literal("resolved")
    ),
    next_action: v.optional(v.string()),
  })
    .index("by_reference", ["reference"])
    .index("by_client", ["client_id"])
    .index("by_status", ["status"]),

  // Documents (uploaded files)
  documents: defineTable({
    client_id: v.id("clients"),
    matter_reference: v.string(),
    filename: v.string(),
    file_type: v.string(),
    file_size: v.number(),
    storage_id: v.string(), // Convex storage ID
  })
    .index("by_client", ["client_id"])
    .index("by_matter", ["matter_reference"]),

  // WhatsApp Logs (notification history for the dashboard)
  whatsapp_logs: defineTable({
    bookingRef: v.string(),
    clientName: v.string(),
    phone: v.string(),
    type: v.string(), // e.g., "Confirmation", "Reminder", "Update"
    message: v.string(),
    status: v.union(
      v.literal("delivered"),
      v.literal("read"),
      v.literal("failed"),
      v.literal("pending")
    ),
    timestamp: v.string(), // ISO format
  })
    .index("by_ref", ["bookingRef"])
    .index("by_status", ["status"]),

  // SMS Logs (notification history)
  sms_logs: defineTable({
    client_id: v.optional(v.id("clients")),
    phone: v.string(),
    message: v.string(),
    status: v.union(v.literal("sent"), v.literal("delivered"), v.literal("failed")),
    sent_at: v.number(),
  })
    .index("by_client", ["client_id"])
    .index("by_status", ["status"]),

  // Users for authentication (separate from clients for role management)
  users: defineTable({
    email: v.string(),
    password_hash: v.string(),
    client_id: v.optional(v.id("clients")), // Link to clients table (optional for admin users)
    role: v.union(v.literal("client"), v.literal("admin")),
    created_at: v.number(), // Unix timestamp
  }).index("by_email", ["email"]),

  // ═══════════════════════════════════════════════════════════════
  // AI COLLECTIONS AGENT TABLES
  // ═══════════════════════════════════════════════════════════════

  // Agent Tasks - Tracks all automated agent activities
  agentTasks: defineTable({
    clientId: v.id("clients"),
    caseId: v.optional(v.id("matters")),
    taskType: v.union(
      v.literal("reminder"),
      v.literal("payment_nudge"),
      v.literal("demand"),
      v.literal("cancellation")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
    scheduledAt: v.number(), // Unix timestamp
    lastContactAt: v.optional(v.number()), // Unix timestamp
    attemptCount: v.number(),
    generatedMessage: v.optional(v.string()),
    channel: v.union(v.literal("email"), v.literal("sms")),
    metadata: v.optional(v.string()), // JSON string for additional context
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_task_type", ["taskType"])
    .index("by_scheduled_at", ["scheduledAt"]),

  // Payment Records - Tracks invoices and payment escalations
  paymentRecords: defineTable({
    clientId: v.id("clients"),
    invoiceId: v.string(), // Unique invoice reference
    caseId: v.optional(v.id("matters")),
    amountDue: v.number(), // Amount in ZAR cents (e.g., 150000 = R1500.00)
    dueDate: v.number(), // Unix timestamp
    status: v.union(
      v.literal("unpaid"),
      v.literal("partial"),
      v.literal("paid"),
      v.literal("disputed")
    ),
    escalationLevel: v.number(), // 0, 1, 2, or 3
    lastNudgeAt: v.optional(v.number()), // Unix timestamp of last nudge
    paidAmount: v.optional(v.number()), // Amount paid in ZAR cents
    paidAt: v.optional(v.number()), // Unix timestamp of payment
    notes: v.optional(v.string()),
  })
    .index("by_client", ["clientId"])
    .index("by_invoice", ["invoiceId"])
    .index("by_status", ["status"])
    .index("by_escalation", ["escalationLevel"])
    .index("by_due_date", ["dueDate"]),

  // Communication Log - Full audit trail of all agent communications
  communicationLog: defineTable({
    clientId: v.id("clients"),
    agentTaskId: v.optional(v.id("agentTasks")),
    channel: v.union(v.literal("email"), v.literal("sms"), v.literal("whatsapp")),
    subject: v.optional(v.string()), // For emails
    body: v.string(),
    sentAt: v.number(), // Unix timestamp
    openedAt: v.optional(v.number()), // Unix timestamp (email tracking)
    responseReceived: v.boolean(),
    responseText: v.optional(v.string()),
    responseAt: v.optional(v.number()), // Unix timestamp
    status: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("failed"),
      v.literal("bounced")
    ),
  })
    .index("by_client", ["clientId"])
    .index("by_task", ["agentTaskId"])
    .index("by_sent_at", ["sentAt"])
    .index("by_status", ["status"]),

  // Cancellation Requests - Multi-step friction-based cancellation tracking
  cancellationRequests: defineTable({
    clientId: v.id("clients"),
    caseId: v.id("matters"),
    step: v.number(), // 1, 2, 3, or 4
    reason: v.optional(v.string()), // Selected cancellation reason
    outstandingBalance: v.number(), // Amount in ZAR cents
    acknowledgedConsequences: v.boolean(),
    coolingOffExpiry: v.optional(v.number()), // Unix timestamp (48 hours from step 3)
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    initiatedAt: v.number(), // Unix timestamp
    completedAt: v.optional(v.number()), // Unix timestamp
    notes: v.optional(v.string()), // Admin notes
  })
    .index("by_client", ["clientId"])
    .index("by_case", ["caseId"])
    .index("by_status", ["status"])
    .index("by_initiated_at", ["initiatedAt"]),
});
