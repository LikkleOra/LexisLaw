import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client for SMS (optional - will work in demo mode if not configured)
let twilioClient = null;
let twilioPhoneNumber = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+14155238871';
    console.log('✓ Twilio SMS service initialized');
  } catch (error) {
    console.warn('⚠ Twilio SMS initialization failed:', error.message);
  }
} else {
  console.log('ℹ SMS: Running in demo mode (no credentials)');
}

/**
 * Send booking confirmation SMS to client
 * @param {string} clientId - Client database ID
 * @param {string} phone - Client's phone number (format: +27xxxxxxxxx)
 * @param {string} reference - Matter reference number
 * @param {string} date - Formatted date
 * @param {string} time - Time slot
 * @param {string} matter - Matter type
 */
export async function sendBookingSMS(clientId, phone, reference, date, time, matter) {
  const message = `LEXIS LAW - Booking Confirmed\n\nRef: ${reference}\nDate: ${date}\nTime: ${time}\nMatter: ${matter}\n\nTrack: https://lexislaw.co.za/tracker\n\nJustice Starts Here`;

  return sendSMS(phone, message);
}

/**
 * Send appointment reminder SMS to client
 * @param {string} clientId - Client database ID
 * @param {string} phone - Client's phone number
 * @param {string} reference - Matter reference
 * @param {string} date - Appointment date
 * @param {string} time - Appointment time
 */
export async function sendAppointmentReminderSMS(clientId, phone, reference, date, time) {
  const message = `LEXIS LAW - Reminder\n\nYour consultation is scheduled:\nRef: ${reference}\nDate: ${date}\nTime: ${time}\n\nPlease arrive 10 minutes early.\n\nJustice Starts Here`;

  return sendSMS(phone, message);
}

/**
 * Send status update SMS to client
 * @param {string} clientId - Client database ID
 * @param {string} reference - Matter reference
 * @param {string} status - New status
 * @param {string} message - Status message
 */
export async function sendStatusUpdateSMS(clientId, reference, status, message) {
  // Get client phone from database if not provided
  const smsMessage = `LEXIS LAW - Status Update\n\nRef: ${reference}\nStatus: ${status.replace('_', ' ').toUpperCase()}\n\n${message}\n\nTrack: https://lexislaw.co.za/tracker\n\nJustice Starts Here`;

  // In real implementation, would fetch phone from DB using clientId
  // For now, this will be called with actual phone from the API
  return smsMessage;
}

/**
 * Core function to send SMS via Twilio
 */
async function sendSMS(phone, message) {
  // Ensure phone format is correct
  const normalizedPhone = phone.replace(/\s/g, '').replace(/^0/, '+27');

  if (!twilioClient) {
    // Demo mode - log message instead of sending
    console.log(`
╔════════════════════════════════════════╗
║  SMS MESSAGE (DEMO MODE)               ║
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
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: normalizedPhone
    });

    console.log(`✓ SMS sent: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('✗ SMS send error:', error.message);
    // Don't throw - don't block booking for SMS failures
    return { sid: 'ERROR', error: error.message };
  }
}

export default {
  sendBookingSMS,
  sendAppointmentReminderSMS,
  sendStatusUpdateSMS
};
