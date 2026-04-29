// AI Collections Agent - Convex Actions
// Handles Claude AI integration and email dispatch via Resend

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { render } from "@react-email/render";

// Initialize clients (keys from environment variables)
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
};

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

// ═══════════════════════════════════════════════════════════════
// AI PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate communication content using Claude AI
 */
export const generateAgentMessage = action({
  args: {
    clientName: v.string(),
    taskType: v.union(
      v.literal("reminder"),
      v.literal("payment_nudge"),
      v.literal("demand"),
      v.literal("cancellation")
    ),
    context: v.object({
      matterType: v.optional(v.string()),
      reference: v.optional(v.string()),
      amountDue: v.optional(v.number()),
      dueDate: v.optional(v.string()),
      escalationLevel: v.optional(v.number()),
      attemptCount: v.optional(v.number()),
      eventDate: v.optional(v.string()),
      eventType: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const anthropic = getAnthropicClient();

    // Build context-specific prompt
    const prompt = buildPrompt(args.clientName, args.taskType, args.context);

    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Extract text content from Claude's response
      const generatedText = message.content[0]?.text || "";

      // Parse subject and body from response
      const parsed = parseClaudeResponse(generatedText);

      return {
        success: true,
        subject: parsed.subject,
        body: parsed.body,
        rawResponse: generatedText,
      };
    } catch (error) {
      console.error("Claude API error:", error);
      return {
        success: false,
        error: error.message,
        subject: "",
        body: "",
      };
    }
  },
});

/**
 * Build Claude prompt based on task type and context
 */
function buildPrompt(clientName, taskType, context) {
  const baseInstructions = `You are the professional communications agent for Mokoena Legal Services, a South African law firm.

Your role is to generate professional, legally-appropriate email communications to clients.

CRITICAL RULES:
- Maintain professional, respectful tone
- Be clear and concise
- Follow South African legal communication standards
- Reference POPIA compliance where appropriate
- Never make threats
- Always provide clear next steps

Generate ONLY the email subject line and body. Format your response as:

SUBJECT: [subject line]

BODY:
[email body]

---

`;

  switch (taskType) {
    case "payment_nudge":
      return (
        baseInstructions +
        buildPaymentNudgePrompt(clientName, context)
      );

    case "reminder":
      return (
        baseInstructions +
        buildReminderPrompt(clientName, context)
      );

    case "demand":
      return (
        baseInstructions +
        buildDemandPrompt(clientName, context)
      );

    case "cancellation":
      return (
        baseInstructions +
        buildCancellationPrompt(clientName, context)
      );

    default:
      return baseInstructions + `Generate a professional follow-up email to ${clientName}.`;
  }
}

function buildPaymentNudgePrompt(clientName, context) {
  const escalationLevel = context.escalationLevel || 0;
  const amount = context.amountDue
    ? `R${(context.amountDue / 100).toFixed(2)}`
    : "the outstanding amount";
  const dueDate = context.dueDate || "the due date";
  const attemptCount = context.attemptCount || 1;

  let tone = "";
  if (escalationLevel === 0) {
    tone = "GENTLE — This is the first reminder. Be friendly and understanding.";
  } else if (escalationLevel === 1) {
    tone = "FIRM — This is the second reminder. Maintain professionalism but convey urgency.";
  } else if (escalationLevel === 2) {
    tone = "URGENT — This is the third reminder. Make the urgency clear and reference potential consequences.";
  } else {
    tone = "FORMAL DEMAND — This is a final notice. Use formal legal language while remaining professional.";
  }

  return `Client: ${clientName}
Matter Reference: ${context.reference || "N/A"}
Outstanding Amount: ${amount}
Original Due Date: ${dueDate}
Previous Attempts: ${attemptCount}
Escalation Level: ${escalationLevel}/3

TONE: ${tone}

Generate a payment reminder email that:
1. References the outstanding invoice
2. States the amount clearly
3. Provides payment instructions
4. ${escalationLevel >= 2 ? "Mentions potential legal action if payment is not received" : "Requests payment within a reasonable timeframe"}
5. ${escalationLevel >= 1 ? "References previous communication attempts" : "Maintains a friendly, professional tone"}

End with contact information for queries and sign off as "Mokoena Legal Services — Collections Department"`;
}

function buildReminderPrompt(clientName, context) {
  const eventType = context.eventType || "scheduled event";
  const eventDate = context.eventDate || "the scheduled date";

  return `Client: ${clientName}
Matter Reference: ${context.reference || "N/A"}
Event Type: ${eventType}
Event Date: ${eventDate}

TONE: PROFESSIONAL & HELPFUL

Generate a case reminder email that:
1. Reminds the client of their upcoming ${eventType}
2. Provides all relevant details (date, time, location if applicable)
3. Includes any preparation instructions
4. Offers assistance if they have questions
5. Maintains a supportive, professional tone

End with contact information and sign off as "Mokoena Legal Services"`;
}

function buildDemandPrompt(clientName, context) {
  const amount = context.amountDue
    ? `R${(context.amountDue / 100).toFixed(2)}`
    : "the outstanding amount";
  const dueDate = context.dueDate || "the original due date";

  return `Client: ${clientName}
Matter Reference: ${context.reference || "N/A"}
Outstanding Amount: ${amount}
Original Due Date: ${dueDate}

TONE: FORMAL LEGAL DEMAND

Generate a Letter of Demand email that:
1. Formally demands payment of the outstanding amount
2. References previous communication attempts
3. Provides a final deadline (5 business days)
4. States consequences of non-payment (legal action under National Credit Act)
5. Maintains professional legal language throughout

This is a serious legal communication. Use appropriate formal language.

End with "Mokoena Legal Services — Legal Department"`;
}

function buildCancellationPrompt(clientName, context) {
  return `Client: ${clientName}
Matter Reference: ${context.reference || "N/A"}

TONE: PROFESSIONAL & EMPATHETIC

The client has initiated a cancellation request. Generate an acknowledgment email that:
1. Acknowledges their cancellation request
2. Expresses understanding while highlighting the firm's commitment
3. Outlines the next steps in the cancellation process
4. Mentions any outstanding obligations
5. Maintains a professional, non-confrontational tone

End with "Mokoena Legal Services"`;
}

/**
 * Parse Claude's response to extract subject and body
 */
function parseClaudeResponse(text) {
  const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
  const bodyMatch = text.match(/BODY:\s*([\s\S]+?)(?:\n---|\n\nSUBJECT:|$)/i);

  return {
    subject: subjectMatch ? subjectMatch[1].trim() : "Important Notice from Mokoena Legal Services",
    body: bodyMatch ? bodyMatch[1].trim() : text.trim(),
  };
}

// ═══════════════════════════════════════════════════════════════
// EMAIL DISPATCH
// ═══════════════════════════════════════════════════════════════

/**
 * Send email via Resend
 */
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    isHTML: v.optional(v.boolean()),
    clientId: v.id("clients"),
    agentTaskId: v.optional(v.id("agentTasks")),
  },
  handler: async (ctx, args) => {
    const resend = getResendClient();

    try {
      const result = await resend.emails.send({
        from: "Mokoena Legal Services <collections@mokoenalegal.co.za>",
        to: args.to,
        subject: args.subject,
        [args.isHTML ? "html" : "text"]: args.body,
      });

      // Log communication in database
      const logId = await ctx.runMutation(api.functions.logCommunication, {
        clientId: args.clientId,
        agentTaskId: args.agentTaskId,
        channel: "email",
        subject: args.subject,
        body: args.body,
        sentAt: Date.now(),
        status: "sent",
      });

      return {
        success: true,
        emailId: result.id,
        logId,
      };
    } catch (error) {
      console.error("Resend email error:", error);

      // Log failed attempt
      if (args.clientId) {
        await ctx.runMutation(api.functions.logCommunication, {
          clientId: args.clientId,
          agentTaskId: args.agentTaskId,
          channel: "email",
          subject: args.subject,
          body: args.body,
          sentAt: Date.now(),
          status: "failed",
        });
      }

      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Generate and send payment reminder (combines AI + email)
 */
export const sendPaymentReminder = action({
  args: {
    clientId: v.id("clients"),
    paymentRecordId: v.id("paymentRecords"),
  },
  handler: async (ctx, args) => {
    // Get client and payment data
    const client = await ctx.runQuery(api.functions.getClient, {
      id: args.clientId,
    });

    const payment = await ctx.runQuery(api.functions.getPaymentRecord, {
      id: args.paymentRecordId,
    });

    if (!client || !payment) {
      return { success: false, error: "Client or payment record not found" };
    }

    // Generate message with Claude
    const generated = await generateAgentMessage(ctx, {
      clientName: client.name,
      taskType: "payment_nudge",
      context: {
        reference: payment.invoiceId,
        amountDue: payment.amountDue,
        dueDate: new Date(payment.dueDate).toLocaleDateString("en-ZA"),
        escalationLevel: payment.escalationLevel,
        attemptCount: payment.lastNudgeAt ? 1 : 0,
      },
    });

    if (!generated.success) {
      return { success: false, error: "Failed to generate message" };
    }

    // Send email
    const emailResult = await sendEmail(ctx, {
      to: client.email,
      subject: generated.subject,
      body: generated.body,
      isHTML: false,
      clientId: args.clientId,
    });

    // Update payment record
    if (emailResult.success) {
      await ctx.runMutation(api.functions.updatePaymentRecord, {
        id: args.paymentRecordId,
        lastNudgeAt: Date.now(),
      });
    }

    return emailResult;
  },
});
