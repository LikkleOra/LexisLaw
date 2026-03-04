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
});
