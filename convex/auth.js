// LexisLaw Clerk Authentication for Convex
// Uses Clerk for authentication, syncs users to Convex

import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Clerk webhook handler - syncs Clerk users to Convex
export const syncClerkUser = mutation({
  args: {
    clerk_id: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if client with this clerk_id exists
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .collect();

    if (existing.length > 0) {
      // Update existing client
      await ctx.db.patch(existing[0]._id, {
        name: args.name,
        email: args.email,
        phone: args.phone || existing[0].phone,
      });
      return { success: true, client_id: existing[0]._id, is_new: false };
    }

    // Check if client with this email exists
    const byEmail = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (byEmail.length > 0) {
      // Link existing client to Clerk
      await ctx.db.patch(byEmail[0]._id, {
        clerk_id: args.clerk_id,
      });
      return { success: true, client_id: byEmail[0]._id, is_new: false };
    }

    // Create new client
    const clientId = await ctx.db.insert("clients", {
      name: args.name,
      phone: args.phone || "+27",
      email: args.email,
      clerk_id: args.clerk_id,
      whatsapp_consent: false,
      popia_consent: true,
    });

    return { success: true, client_id: clientId, is_new: true };
  },
});

// Get client by Clerk ID
export const getClientByClerk = query({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    const clients = await ctx.db
      .query("clients")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .collect();

    if (clients.length === 0) {
      return null;
    }

    const client = clients[0];

    // Get their matters
    const matters = await ctx.db
      .query("matters")
      .withIndex("by_client", (q) => q.eq("client_id", client._id))
      .collect();

    return {
      ...client,
      matters: matters.map((m) => ({
        reference: m.reference,
        status: m.status,
        next_action: m.next_action,
      })),
    };
  },
});

// Get client by email (for booking lookup)
export const getClientByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const clients = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (clients.length === 0) {
      return null;
    }

    return clients[0];
  },
});

// Link existing client to Clerk account
export const linkClerkAccount = mutation({
  args: {
    client_id: v.id("clients"),
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if clerk_id already linked
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .collect();

    if (existing.length > 0) {
      throw new Error("This Clerk account is already linked to another client");
    }

    await ctx.db.patch(args.client_id, {
      clerk_id: args.clerk_id,
    });

    return { success: true };
  },
});
