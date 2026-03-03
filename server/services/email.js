import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter (optional)
let transporter = null;
const adminEmail = 'admin@lexislaw.co.za'; // Firm's main email

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✓ Email service initialized');
} else {
  console.log('ℹ Email: Running in demo mode (no credentials)');
}

/**
 * Send booking confirmation email to client
 */
export async function sendBookingConfirmation(email, data) {
  const { name, reference, date, time, matter } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Courier New', monospace; background: #0A0A0A; color: #F0EDE8; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; border: 2px solid #E63329; padding: 30px; }
        .header { font-size: 32px; color: #E63329; margin-bottom: 20px; font-family: sans-serif; font-weight: bold; }
        .ref { background: #E63329; color: white; padding: 10px 20px; font-size: 20px; letter-spacing: 3px; display: inline-block; margin: 15px 0; }
        .details { background: #1E1E1E; padding: 20px; margin: 20px 0; }
        .details p { margin: 8px 0; color: #8A8A8A; }
        .details strong { color: #F0EDE8; }
        .footer { margin-top: 30px; font-size: 12px; color: #8A8A8A; border-top: 1px solid #2E2E2E; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">LEXIS LAW</div>
        <p>Dear ${name},</p>
        <p>Your consultation has been confirmed.</p>
        
        <div class="ref">${reference}</div>
        
        <div class="details">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Matter:</strong> ${matter}</p>
        </div>
        
        <p>Please arrive 10 minutes early and bring any relevant documents to your consultation.</p>
        
        <p>Track your matter: <a href="#" style="color: #E63329;">https://lexislaw.co.za/tracker</a></p>
        
        <div class="footer">
          <p>Lexis Law Inc. — Johannesburg, South Africa</p>
          <p>This email was sent to ${email}</p>
          <p>POPIA Compliant — Your data is protected</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `LEXIS LAW — BOOKING CONFIRMED

Reference: ${reference}

Dear ${name},

Your consultation has been confirmed:
Date: ${date}
Time: ${time}
Matter: ${matter}

Please arrive 10 minutes early and bring any relevant documents.

Track your matter: https://lexislaw.co.za/tracker

Lexis Law Inc. — Justice Starts Here`;

  return sendEmail(email, `Booking Confirmed — ${reference}`, htmlContent, textContent);
}

/**
 * Send admin notification when new booking comes in
 */
export async function sendAdminNotification(data) {
  const { name, phone, matter, date } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: monospace; background: #0A0A0A; color: #F0EDE8; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; border: 2px solid #2DB34A; padding: 20px; }
        h2 { color: #2DB34A; }
        .details { background: #1E1E1E; padding: 15px; }
        .details p { margin: 10px 0; }
        .highlight { color: #E63329; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>📋 NEW BOOKING</h2>
        <div class="details">
          <p><strong>Client:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Matter:</strong> ${matter}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(adminEmail, `🔴 New Booking: ${name} — ${matter}`, htmlContent);
}

/**
 * Core function to send email
 */
async function sendEmail(to, subject, html, text) {
  if (!transporter) {
    console.log(`
╔════════════════════════════════════════╗
║  EMAIL MESSAGE (DEMO MODE)           ║
╠════════════════════════════════════════╣
║  To: ${to.padEnd(35)}║
║  Subject: ${subject.substring(0, 30).padEnd(30)}║
╚════════════════════════════════════════╝
    `);
    return { messageId: 'DEMO_MODE' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Lexis Law" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    });
    
    console.log(`✓ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('✗ Email send error:', error.message);
    return { error: error.message };
  }
}

export default {
  sendBookingConfirmation,
  sendAdminNotification
};
