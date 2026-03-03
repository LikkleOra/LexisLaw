// LexisLaw SMS Notifications for Convex
// Send SMS notifications to clients

import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// SMS Configuration - set these in your .env
// CLICKATELL_API_KEY or TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN

// Send SMS via Clickatell (recommended for SA)
async function sendClickatellSMS(apiKey, to, message) {
  const response = await fetch("https://platform.clickatell.com/v1/message", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: to.replace("+", ""),
      content: message,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "Failed to send SMS");
  }
  
  return {
    messageId: data.messages?.[0]?.["message-id"],
    status: "sent",
  };
}

// Send SMS via Twilio
async function sendTwilioSMS(accountSid, authToken, from, to, message) {
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: message,
      }),
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Failed to send SMS");
  }
  
  return {
    messageId: data.sid,
    status: "sent",
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// Send SMS to a phone number
export const sendSMS = mutation({
  args: {
    client_id: v.optional(v.id("clients")),
    phone: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Normalize phone
    const normalizedPhone = args.phone.replace(/\s/g, "").replace(/^0/, "+27");

    let result;
    let status = "failed";

    // Try Clickatell first
    if (process.env.CLICKATELL_API_KEY) {
      try {
        result = await sendClickatellSMS(
          process.env.CLICKATELL_API_KEY,
          normalizedPhone,
          args.message
        );
        status = "sent";
      } catch (e) {
        console.error("Clickatell error:", e.message);
      }
    }

    // Fall back to Twilio if Clickatell failed
    if (status === "failed" && process.env.TWILIO_ACCOUNT_SID) {
      try {
        result = await sendTwilioSMS(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
          process.env.TWILIO_SMS_NUMBER || process.env.TWILIO_WHATSAPP_NUMBER,
          normalizedPhone,
          args.message
        );
        status = "sent";
      } catch (e) {
        console.error("Twilio error:", e.message);
      }
    }

    // If no SMS provider configured, log as demo
    if (status === "failed") {
      console.log(`
╔════════════════════════════════════════╗
║  SMS MESSAGE (DEMO MODE)             ║
╠════════════════════════════════════════╣
║  To: ${normalizedPhone.padEnd(30)}║
║  Message: ${args.message.substring(0, 30).padEnd(30)}║
╚════════════════════════════════════════╝
      `);
      result = { messageId: "DEMO", status: "sent" };
    }

    // Log to database
    const logId = await ctx.db.insert("sms_logs", {
      client_id: args.client_id,
      phone: normalizedPhone,
      message: args.message,
      status,
      sent_at: Date.now(),
    });

    return {
      success: status === "sent",
      message_id: result?.messageId,
      status,
    };
  },
});

// Send appointment reminder
export const sendAppointmentReminder = mutation({
  args: {
    client_id: v.id("clients"),
    matter_reference: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.client_id);

    if (!client?.phone) {
      throw new Error("Client has no phone number");
    }

    const message = `LEXIS LAW REMINDER

Your appointment is tomorrow:
📅 ${args.date}
🕐 ${args.time}
Ref: ${args.matter_reference}

Please ensure you have all documents ready.

Justice Starts Here`;

    // Send SMS
    return await ctx.db.runMutation("sendSMS", {
      client_id: args.client_id,
      phone: client.phone,
      message,
    });
  },
});

// Send status update notification
export const sendStatusNotification = mutation({
  args: {
    client_id: v.id("clients"),
    matter_reference: v.string(),
    status: v.string(),
    next_action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.client_id);

    if (!client?.phone) {
      throw new Error("Client has no phone number");
    }

    const statusMessages = {
      pending: "Your matter is pending review.",
      in_progress: "Your matter is now in progress.",
      awaiting_docs: "We are awaiting documents from you.",
      hearing: "A hearing has been scheduled.",
      resolved: "Your matter has been resolved.",
    };

    const message = `LEXIS LAW UPDATE

Ref: ${args.matter_reference}
Status: ${args.status.replace("_", " ").toUpperCase()}

${args.next_action || statusMessages[args.status] || ""}

Track: lexislaw.co.za/tracker

Justice Starts Here`;

    return await ctx.db.runMutation("sendSMS", {
      client_id: args.client_id,
      phone: client.phone,
      message,
    });
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════

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
