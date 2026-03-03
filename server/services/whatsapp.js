import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client (optional - will work in demo mode if not configured)
let client = null;
let twilioNumber = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    console.log('✓ Twilio WhatsApp service initialized');
  } catch (error) {
    console.warn('⚠ Twilio initialization failed:', error.message);
  }
} else {
  console.log('ℹ WhatsApp: Running in demo mode (no credentials)');
}

/**
 * Send WhatsApp confirmation message
 * @param {string} phone - Client's WhatsApp number (format: +27xxxxxxxxx)
 * @param {string} reference - Matter reference number
 * @param {string} date - Formatted date
 * @param {string} time - Time slot
 * @param {string} matter - Matter type
 */
export async function sendConfirmation(phone, reference, date, time, matter) {
  const message = `*LEXIS LAW — BOOKING CONFIRMED* 🔴

Reference: *${reference}*

Your consultation has been scheduled:
📅 ${date}
🕐 ${time}
⚖️ ${matter}

Please arrive 10 minutes early and bring any relevant documents.

Reply CONFIRM to acknowledge.

_Justice Starts Here_`;

  return sendWhatsApp(phone, message);
}

/**
 * Send reminder message
 * @param {string} phone - Client's WhatsApp number
 * @param {string} reference - Matter reference
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
export async function sendReminder(phone, reference, date, time) {
  const message = `*LEXIS LAW — REMINDER* 🔴

Your appointment is tomorrow:
📅 ${date}
🕐 ${time}
Ref: *${reference}*

Please ensure you have all documents ready.

_Justice Starts Here_`;

  return sendWhatsApp(phone, message);
}

/**
 * Send status update notification
 * @param {string} phone - Client's WhatsApp number
 * @param {string} reference - Matter reference
 * @param {string} status - New status
 * @param {string} message - Status message
 */
export async function sendStatusUpdate(phone, reference, status, message) {
  const statusEmoji = {
    'pending': '⏳',
    'in_progress': '⚙️',
    'awaiting_docs': '📄',
    'hearing': '🏛️',
    'resolved': '✅'
  };

  const fullMessage = `*LEXIS LAW — STATUS UPDATE* 🔴

Ref: *${reference}*
${statusEmoji[status] || ''} Status: *${status.replace('_', ' ').toUpperCase()}*

${message}

Track your matter: https://lexislaw.co.za/tracker

_Justice Starts Here_`;

  return sendWhatsApp(phone, fullMessage);
}

/**
 * Core function to send WhatsApp via Twilio
 */
async function sendWhatsApp(phone, message) {
  // Ensure phone format is correct
  const normalizedPhone = phone.replace(/\s/g, '').replace(/^0/, '+27');
  
  if (!client) {
    // Demo mode - log message instead of sending
    console.log(`
╔════════════════════════════════════════╗
║  WHATSAPP MESSAGE (DEMO MODE)          ║
╠════════════════════════════════════════╣
║  To: ${normalizedPhone.padEnd(30)}║
╠════════════════════════════════════════╣
║  ${message.substring(0, 40).padEnd(40)}║
║  ${message.substring(40, 80).padEnd(40)}║
║  ${message.substring(80, 120).padEnd(40)}║
╚════════════════════════════════════════╝
    `);
    return { sid: 'DEMO_MODE', status: 'sent' };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:${normalizedPhone}`
    });
    
    console.log(`✓ WhatsApp sent: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('✗ WhatsApp send error:', error.message);
    // Don't throw - don't block booking for WhatsApp failures
    return { sid: 'ERROR', error: error.message };
  }
}

export default {
  sendConfirmation,
  sendReminder,
  sendStatusUpdate
};
