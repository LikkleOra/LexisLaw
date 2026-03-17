// LexisLaw WhatsApp Integration
// Uses the free WhatsApp Click-to-Chat API (wa.me) — no API keys required.
// The frontend opens a WhatsApp link with a pre-filled message after a booking is saved.

// Admin WhatsApp number — South Africa format (no + sign)
export const ADMIN_WHATSAPP_NUMBER = "27785962689";

/**
 * Normalizes a phone number to the WhatsApp format (digits only, with country code).
 * e.g. "0785962689" → "27785962689"
 */
export function normalizePhone(phone) {
  if (!phone) return ADMIN_WHATSAPP_NUMBER;
  return phone.replace(/\s/g, "").replace(/^0/, "27").replace(/^\+/, "");
}

/**
 * Generates a WhatsApp Click-to-Chat URL with a pre-filled message.
 * @param {string} phone - recipient phone number (any format)
 * @param {string} message - plain text message
 * @returns {string} wa.me URL
 */
export function buildWhatsAppUrl(phone, message) {
  const number = normalizePhone(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the booking confirmation message for the LAW FIRM ADMIN.
 */
export function buildAdminNotificationMessage({ name, phone, email, matter_type, preferred_date, preferred_time, description, reference }) {
  return `*🔴 NEW BOOKING — LEXIS LAW*

Reference: *${reference}*

Client: ${name}
Phone: ${phone}
Email: ${email || "N/A"}
Matter: ${matter_type}
Date: ${preferred_date}
Time: ${preferred_time}

Description: ${description || "None provided"}

Please log in to the dashboard to assign an attorney.
https://lexislaw.co.za/admin`;
}

/**
 * Builds the booking confirmation message for the CLIENT.
 */
export function buildClientConfirmationMessage({ name, reference, matter_type, preferred_date, preferred_time }) {
  return `*LEXIS LAW — REQUEST RECEIVED* ⚖️

Dear ${name},

Your consultation request has been submitted successfully.

Reference: *${reference}*
Matter: ${matter_type}
Preferred Date: ${preferred_date}
Preferred Time: ${preferred_time}

Our team will reach out to confirm your appointment shortly.

_Justice Starts Here._
https://lexislaw.co.za`;
}
