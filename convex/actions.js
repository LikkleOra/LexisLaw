import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// ═══════════════════════════════════════════════════════════════════════════
// WHATSAPP & SMS ACTIONS (Server-side third-party calls)
// ═══════════════════════════════════════════════════════════════════════════

export const sendWhatsAppAction = action({
  args: {
    to: v.string(),
    message: v.string(),
    bookingRef: v.string(),
    clientName: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !from) {
      console.warn("Twilio credentials not configured.");
      return { success: false, error: "Credentials not configured" };
    }

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `whatsapp:${args.to}`,
            From: from,
            Body: args.message,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Twilio WhatsApp error:", data.message);
        return { success: false, error: data.message };
      }

      // Log success to database via internal mutation
      await ctx.runMutation(internal.sms.logWASuccess, {
        bookingRef: args.bookingRef,
        clientName: args.clientName,
        phone: args.to,
        type: args.type,
        message: args.message,
      });

      return { success: true, sid: data.sid };
    } catch (e) {
      console.error("WhatsApp Action catch:", e.message);
      return { success: false, error: e.message };
    }
  },
});

export const sendSMSAction = action({
  args: {
    to: v.string(),
    message: v.string(),
    client_id: v.optional(v.id("clients")),
    provider: v.union(v.literal("clickatell"), v.literal("twilio")),
  },
  handler: async (ctx, args) => {
    try {
      if (args.provider === "clickatell") {
        const apiKey = process.env.CLICKATELL_API_KEY;
        if (!apiKey) throw new Error("Clickatell API Key not found");

        const response = await fetch("https://platform.clickatell.com/v1/message", {
          method: "POST",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [args.to.replace("+", "")],
            content: args.message,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Clickatell failed");
        
        const messageId = data.messages?.[0]?.["message-id"];
        await ctx.runMutation(internal.sms.logSMSSuccess, {
          client_id: args.client_id,
          phone: args.to,
          message: args.message,
          messageId: messageId || "UNKNOWN",
        });

        return { success: true, messageId };
      } else {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_SMS_NUMBER;

        if (!accountSid || !authToken || !from) throw new Error("Twilio credentials not found");

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: args.to,
              From: from,
              Body: args.message,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        await ctx.runMutation(internal.sms.logSMSSuccess, {
          client_id: args.client_id,
          phone: args.to,
          message: args.message,
          messageId: data.sid,
        });

        return { success: true, sid: data.sid };
      }
    } catch (e) {
      console.error("SMS Action catch:", e.message);
      await ctx.runMutation(internal.sms.logSMSFailure, {
        client_id: args.client_id,
        phone: args.to,
        message: args.message,
        error: e.message,
      });
      return { success: false, error: e.message };
    }
  },
});
