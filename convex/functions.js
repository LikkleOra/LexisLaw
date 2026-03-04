// LexisLaw API Functions for Convex
// Queries and mutations for bookings, matters, and clients

import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Admin phone number for notifications
const ADMIN_PHONE = "+2785962689";

// ═══════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════

// Get a matter by reference number
export const getMatterByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    // Find matter by reference
    const matters = await ctx.db
      .query("matters")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .collect();

    if (matters.length === 0) {
      return null;
    }

    const matter = matters[0];

    // Get related data
    const booking = await ctx.db.get(matter.booking_id);
    const client = await ctx.db.get(matter.client_id);
    const attorney = matter.attorney_id
      ? await ctx.db.get(matter.attorney_id)
      : null;

    return {
      reference: matter.reference,
      name: client?.name,
      phone: client?.phone,
      email: client?.email,
      matter: booking?.matter_type,
      date: `${formatDate(booking?.preferred_date)}, ${booking?.preferred_time}`,
      attorney: attorney?.name || "To be assigned",
      updated: formatDate(matter._creationTime),
      next: matter.next_action || "Awaiting initial consultation",
      status: getStatusNumber(matter.status),
      statusLabel: getStatusLabel(matter.status),
      statusClass: getStatusClass(matter.status),
      wa: client?.phone,
    };
  },
});

// Get all bookings (for admin)
export const getBookings = query({
  args: {
    status: v.optional(v.string()),
    from_date: v.optional(v.string()),
    to_date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let bookingsQuery = ctx.db.query("bookings");

    // Apply filters
    if (args.status) {
      bookingsQuery = bookingsQuery.and(
        ctx.db.query("bookings").withIndex("by_status", (q) =>
          q.eq("status", args.status)
        )
      );
    }

    const bookings = await bookingsQuery.collect();

    // Get client and matter info for each booking
    const results = await Promise.all(
      bookings.map(async (booking) => {
        const client = await ctx.db.get(booking.client_id);
        const matters = await ctx.db
          .query("matters")
          .withIndex("by_client", (q) => q.eq("client_id", booking.client_id))
          .collect();

        const matter = matters.find((m) => m.booking_id === booking._id);
        const attorney = matter?.attorney_id
          ? await ctx.db.get(matter.attorney_id)
          : null;

        return {
          _id: booking._id,
          reference: matter?.reference || "—",
          client_name: client?.name || "Unknown",
          client_phone: client?.phone || "—",
          client_email: client?.email,
          matter_type: booking.matter_type,
          preferred_date: booking.preferred_date,
          preferred_time: booking.preferred_time,
          status: booking.status,
          attorney_name: attorney?.name,
        };
      })
    );

    // Sort by date descending
    return results.sort(
      (a, b) =>
        new Date(b.preferred_date).getTime() -
        new Date(a.preferred_date).getTime()
    );
  },
});

// Get all attorneys
export const getAttorneys = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("attorneys").collect();
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// Admin phone number for notifications
const ADMIN_PHONE = "+2785962689";
const ADMIN_WHATSAPP = "whatsapp:+2785962689";

// Create a new booking
export const createBooking = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    matter_type: v.string(),
    preferred_date: v.string(),
    preferred_time: v.string(),
    description: v.optional(v.string()),
    whatsapp_consent: v.boolean(),
    popia_consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Normalize phone
    const normalizedPhone = args.phone.replace(/\s/g, "").replace(/^0/, "+27");

    // Find or create client
    let clients = await ctx.db
      .query("clients")
      .withIndex("by_phone", (q) => q.eq("phone", normalizedPhone))
      .collect();

    let clientId;
    if (clients.length > 0) {
      clientId = clients[0]._id;
    } else {
      clientId = await ctx.db.insert("clients", {
        name: args.name,
        phone: normalizedPhone,
        email: args.email,
        whatsapp_consent: args.whatsapp_consent,
        popia_consent: args.popia_consent,
      });
    }

    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      client_id: clientId,
      matter_type: args.matter_type,
      preferred_date: args.preferred_date,
      preferred_time: args.preferred_time,
      description: args.description,
      status: "pending",
    });

    // Generate reference and create matter
    const reference = generateReference();
    const matterId = await ctx.db.insert("matters", {
      booking_id: bookingId,
      client_id: clientId,
      reference,
      status: "pending",
      next_action: "Awaiting initial consultation",
    });

    // Send WhatsApp confirmation to client (if consented)
    if (args.whatsapp_consent) {
      const dateFormatted = formatDate(args.preferred_date);
      try {
        await ctx.scheduler.runAfter(0, api.whatsapp.sendBookingConfirmation, {
          client_phone: normalizedPhone,
          reference,
          date: dateFormatted,
          time: args.preferred_time,
          matter_type: args.matter_type,
        });
      } catch (e) {
        console.error("Failed to send client WhatsApp:", e.message);
      }
    }

    // Send WhatsApp notification to admin
    try {
      await ctx.scheduler.runAfter(0, api.whatsapp.sendAdminNotification, {
        client_name: args.name,
        client_phone: normalizedPhone,
        client_email: args.email,
        matter_type: args.matter_type,
        preferred_date: formatDate(args.preferred_date),
        preferred_time: args.preferred_time,
        description: args.description,
      });
    } catch (e) {
      console.error("Failed to send admin WhatsApp:", e.message);
    }

    return {
      success: true,
      reference,
      booking_id: bookingId,
    };
  },
});

// Get all matters (for admin)
export const getMatters = query({
  args: {},
  handler: async (ctx) => {
    const matters = await ctx.db.query("matters").collect();

    return await Promise.all(
      matters.map(async (matter) => {
        const client = await ctx.db.get(matter.client_id);
        const booking = await ctx.db.get(matter.booking_id);
        const attorney = matter.attorney_id
          ? await ctx.db.get(matter.attorney_id)
          : null;

        return {
          _id: matter._id,
          reference: matter.reference,
          name: client?.name || "Unknown",
          matter: booking?.matter_type || "General",
          attorney: attorney?.name || "Unassigned",
          status: getStatusNumber(matter.status),
          statusLabel: getStatusLabel(matter.status),
          next: matter.next_action || "Pending review",
        };
      })
    );
  },
});

// Update matter status (admin)
export const updateMatterStatus = mutation({
  args: {
    reference: v.string(),
    status: v.number(), // Accepts 0-4
    next_action: v.optional(v.string()),
    attorney_id: v.optional(v.id("attorneys")),
  },
  handler: async (ctx, args) => {
    const statusMap = ["pending", "in_progress", "awaiting_docs", "hearing", "resolved"];
    const statusString = statusMap[args.status] || "pending";

    const matters = await ctx.db
      .query("matters")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .collect();

    if (matters.length === 0) throw new Error("Matter not found");

    await ctx.db.patch(matters[0]._id, {
      status: statusString,
      next_action: args.next_action,
      attorney_id: args.attorney_id,
    });

    return { success: true };
  },
});

// Approve booking (placeholder for more complex logic if needed)
export const approveBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.id);
    if (!booking) throw new Error("Booking not found");

    // Find associated matter
    const matters = await ctx.db.query("matters")
      .filter(q => q.eq(q.field("booking_id"), args.id))
      .collect();

    if (matters.length > 0) {
      await ctx.db.patch(matters[0]._id, {
        status: "in_progress",
        next_action: "Consultation approved"
      });
    }

    await ctx.db.patch(args.id, { status: "confirmed" });
    return { success: true };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function generateReference() {
  return "REF-" + String(Math.floor(10000 + Math.random() * 89999));
}

function formatDate(timestampOrDate) {
  if (!timestampOrDate) return "—";
  const date = typeof timestampOrDate === "number" ? new Date(timestampOrDate) : new Date(timestampOrDate);
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

function getStatusNumber(status) {
  const map = { pending: 0, in_progress: 1, awaiting_docs: 2, hearing: 3, resolved: 4 };
  return map[status] || 0;
}

function getStatusLabel(status) {
  const labels = { pending: "PENDING", in_progress: "IN PROGRESS", awaiting_docs: "AWAITING DOCS", hearing: "HEARING SCHEDULED", resolved: "RESOLVED" };
  return labels[status] || "PENDING";
}

function getStatusClass(status) {
  const classes = { pending: "status-pending", in_progress: "status-in-progress", awaiting_docs: "status-awaiting", hearing: "status-scheduled", resolved: "status-resolved" };
  return classes[status] || "status-pending";
}
