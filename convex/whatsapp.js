// LexisLaw WhatsApp Notifications for Convex
// Send WhatsApp messages to clients and admin

import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Admin phone number
const ADMIN_PHONE = "+2785962689";

// Twilio WhatsApp configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "+14155238871"; // Twilio sandbox

// Send WhatsApp via Twilio
async function sendWhatsApp(to, message) {
  // Demo mode if no credentials
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.log(`
╔════════════════════════════════════════╗
║  WHATSAPP (DEMO MODE)                ║
╠════════════════════════════════════════╣
║  To: ${to.padEnd(35)}║
║  Message: ${message.substring(0, 30).padEnd(30)}║
╚════════════════════════════════════════╝
    `);
    return { sid: "DEMO", status: "sent" };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      Body: message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send WhatsApp");
  }

  return { sid: data.sid, status: "sent" };
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// Send WhatsApp message
export const sendWhatsAppMessage = mutation({
  args: {
    to: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedTo = args.to.replace(/\s/g, "").replace(/^0/, "+27");
    return await sendWhatsApp(normalizedTo, args.message);
  },
});

// Send booking confirmation to client
export const sendBookingConfirmation = mutation({
  args: {
    client_phone: v.string(),
    reference: v.string(),
    date: v.string(),
    time: v.string(),
    matter_type: v.string(),
  },
  handler: async (ctx, args) => {
    const phone = args.client_phone.replace(/\s/g, "").replace(/^0/, "+27");

    const message = `*LEXIS LAW — BOOKING CONFIRMED* 🔴

Reference: *${args.reference}*

Your consultation:
📅 ${args.date}
🕐 ${args.time}
⚖️ ${args.matter_type}

Please arrive 10 minutes early and bring any relevant documents.

Reply CONFIRM to acknowledge.

_Justice Starts Here_`;

    return await sendWhatsApp(phone, message);
  },
});

// Send new booking notification to admin
export const sendAdminNotification = mutation({
  args: {
    client_name: v.string(),
    client_phone: v.string(),
    client_email: v.optional(v.string()),
    matter_type: v.string(),
    preferred_date: v.string(),
    preferred_time: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const message = `*🔴 NEW BOOKING RECEIVED*

Reference: *${generateReference()}*

Client: ${args.client_name}
Phone: ${args.client_phone}
Email: ${args.client_email || "N/A"}
Matter: ${args.matter_type}
Date: ${args.preferred_date} at ${args.preferred_time}

Description: ${args.description || "None"}

Please assign an attorney in the dashboard.`;

    return await sendWhatsApp(ADMIN_PHONE, message);
  },
});

// Send status update to client
export const sendStatusUpdate = mutation({
  args: {
    client_phone: v.string(),
    reference: v.string(),
    status: v.string(),
    next_action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const phone = args.client_phone.replace(/\s/g, "").replace(/^0/, "+27");

    const statusEmoji = {
      pending: "⏳",
      in_progress: "⚙️",
      awaiting_docs: "📄",
      hearing: "🏛️",
      resolved: "✅",
    };

    const statusMessages = {
      pending: "Your matter is pending review.",
      in_progress: "Your matter is now in progress.",
      awaiting_docs: "We are awaiting documents from you.",
      hearing: "A hearing has been scheduled.",
      resolved: "Your matter has been resolved.",
    };

    const message = `*LEXIS LAW — STATUS UPDATE* 🔴

Ref: *${args.reference}*
${statusEmoji[args.status] || ""} Status: *${args.status.replace("_", " ").toUpperCase()}*

${args.next_action || statusMessages[args.status] || ""}

Track your matter: https://lexislaw.co.za/tracker

_Justice Starts Here_`;

    return await sendWhatsApp(phone, message);
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════════════

function generateReference() {
  return "REF-" + String(Math.floor(10000 + Math.random() * 89999));
}
