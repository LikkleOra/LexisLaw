// LexisLaw SMS Notifications for Convex
// Handlers for logging and triggering SMS/WhatsApp notifications

import { query, internalMutation } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// ═══════════════════════════════════════════════════════════════════════════
// INTERNAL MUTATIONS (Called by Actions)
// ═══════════════════════════════════════════════════════════════════════════

export const logSMSSuccess = internalMutation({
  args: {
    client_id: v.optional(v.id("clients")),
    phone: v.string(),
    message: v.string(),
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sms_logs", {
      client_id: args.client_id,
      phone: args.phone,
      message: args.message,
      status: "sent",
      sent_at: Date.now(),
    });
  },
});

export const logSMSFailure = internalMutation({
  args: {
    client_id: v.optional(v.id("clients")),
    phone: v.string(),
    message: v.string(),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sms_logs", {
      client_id: args.client_id,
      phone: args.phone,
      message: args.message,
      status: "failed",
      sent_at: Date.now(),
    });
  },
});

export const logWASuccess = internalMutation({
  args: {
    bookingRef: v.string(),
    clientName: v.string(),
    phone: v.string(),
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("whatsapp_logs", {
      bookingRef: args.bookingRef,
      clientName: args.clientName,
      phone: args.phone,
      type: args.type,
      message: args.message,
      status: "delivered", // Twilio confirmed submission
      timestamp: new Date().toISOString(),
    });
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// Mutations no longer call fetch() directly. 
// They should be orchestrated by the frontend or internal functions that call actions.
// Since Convex doesn't allow calling Actions from Mutations, 
// the usual pattern is Mutation -> Action (via client or scheduler).

// Get SMS logs for a client
export const getClientSMSLogs = query({
  args: {
    client_id: v.id("clients"),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("sms_logs")
      .withIndex("by_client", (q) => q.eq("client_id", args.client_id))
      .collect();

    return logs.map((l) => ({
      id: l._id,
      phone: l.phone,
      message: l.message,
      status: l.status,
      sent_at: l.sent_at,
    }));
  },
});

// Get all SMS logs (admin)
export const getAllSMSLogs = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let logs;

    if (args.status) {
      logs = await ctx.db
        .query("sms_logs")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .collect();
    } else {
      logs = await ctx.db.query("sms_logs").collect();
    }

    // Get client info
    const results = await Promise.all(
      logs.map(async (l) => {
        const client = l.client_id ? await ctx.db.get(l.client_id) : null;
        return {
          id: l._id,
          client_name: client?.name || "Unknown",
          phone: l.phone,
          message: l.message,
          status: l.status,
          sent_at: l.sent_at,
        };
      })
    );

    return results.sort((a, b) => b.sent_at - a.sent_at);
  },
});
