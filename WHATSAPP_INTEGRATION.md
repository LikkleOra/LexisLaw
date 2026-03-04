# WhatsApp Integration Documentation

## Overview

The Fadezone barber scheduling app uses WhatsApp as a primary communication channel for booking confirmations and customer reminders. This document describes how the WhatsApp integration was implemented.

---

## Implementation Method

The app uses **WhatsApp's Click to Chat API** - a free, client-side integration that opens WhatsApp with a pre-filled message.

### No API Key Required

This approach uses the public WhatsApp Click to Chat URL format:
```
https://wa.me/{phone_number}?text={encoded_message}
```

---

## Integration Points

### 1. Customer Booking Confirmation

**Location:** `App.tsx` - `processBooking()` function (lines 107-153)

**How it works:**
1. Customer completes the booking form
2. App stores booking in Convex database
3. App opens WhatsApp with pre-filled booking confirmation message

**Code:**
```typescript
const processBooking = async (consultantNumber: string) => {
  if (!selectedService || !selectedTime) return;
  const dateStr = selectedDate.toISOString().split('T')[0];

  // Stylish Message Construction with Markdown formatting
  const msg = `
*FADEZONE BOOKING CONFIRMED* ✂️🔥

*Service:* ${selectedService.name}
*Date:* ${dateStr}
*Time:* ${selectedTime}
*Client:* ${customerName}
*Price:* R${selectedService.price}

Vibe the vibe! We'll see you soon. 
📍 *424 Commissioner St, Kensington*

_Need to book again?_
https://fadezone-grooming.netlify.app/
  `.trim();

  try {
    // Store in Convex
    const bookingId = await addBookingMutation({
      serviceId: selectedService.id,
      date: dateStr,
      time: selectedTime,
      customerName,
      customerPhone,
      notes,
      status: 'confirmed'
    });

    setLastBookingId(bookingId);

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${consultantNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    // Reset UI
    setStep(0);
    setSelectedService(null);
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Something went wrong with the booking. Please try again.");
  }
};
```

---

### 2. Staff Dashboard Reminder

**Location:** `App.tsx` - Staff dashboard section (lines 626-635)

**How it works:**
1. Staff views bookings in the admin dashboard
2. Staff clicks "Send Reminder" button
3. App opens WhatsApp with pre-filled reminder message

**Code:**
```typescript
onClick={() => {
  const msg = `Yo ${booking.customerName}! Just a reminder of your legendary fade tomorrow at ${booking.time} at Fadezone. See you then! 🔥`;
  const whatsappUrl = `https://wa.me/${booking.customerPhone}?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, '_blank');
}}
```

---

## Configuration

### Phone Number Format

The phone number must be provided in specific format:
- **Country code included** (e.g., `27812687806` for South Africa)
- **No + symbol** - just digits
- **No spaces or dashes**

Example from `constants.tsx`:
```typescript
phone: '27812687806'
```

### Message Formatting

WhatsApp supports basic Markdown-style formatting:

| Format | Syntax | Example |
|--------|--------|---------|
| Bold | `*text*` | `*Hello*` → **Hello** |
| Italic | `_text_` | `_Hello_` → _Hello_ |
| Strikethrough | `~text~` | `~Hello~` → ~~Hello~~ |

---

## Technical Details

### Prerequisites
- User must have WhatsApp installed (mobile app or WhatsApp Web)
- Phone number must include correct country code

### Limitations

| Limitation | Impact |
|------------|--------|
| Requires WhatsApp installed | Users without WhatsApp cannot receive messages |
| Manual user action | Cannot send automated notifications |
| No delivery tracking | No confirmation that message was read |
| Phone number visible | Customer sees barber's number (and vice versa) |
| Rate limiting | WhatsApp may block if too many messages sent quickly |

### Browser Compatibility
- Works in all modern browsers
- Opens in new tab/window
- Works on mobile and desktop

---

## Alternative Approaches

If automated WhatsApp notifications are needed in the future:

### Option 1: WhatsApp Business API
- **Provider:** Meta (Facebook)
- **Cost:** Per-message pricing
- **Pros:** Official, supports automated messages, delivery receipts
- **Cons:** Requires business verification, more complex setup

### Option 2: Twilio API for WhatsApp
- **Provider:** Twilio
- **Cost:** Per-message pricing (similar to SMS)
- **Pros:** Reliable, good documentation, supports templates
- **Cons:** Requires WhatsApp Business account

### Option 3: Third-Party Services
- **Examples:** Infobip, MessageBird, ClickSend
- **Pros:** Often easier setup than direct API
- **Cons:** Additional intermediary, potential latency

---

## Security Considerations

1. **Phone Number Storage:** Customer phone numbers are stored in the Convex database - ensure proper access controls
2. **Message Content:** Booking confirmations contain price information - be mindful of what data is shared
3. **Staff Access:** The dashboard with customer phone numbers is protected by password (see `VITE_STAFF_PASSWORD`)

---

## Files Involved

| File | Purpose |
|------|---------|
| `App.tsx` | Main booking flow and WhatsApp URL generation |
| `constants.tsx` | Barber configuration including phone number |
| `convex/bookings.ts` | Booking data storage and retrieval |
| `.env.example` | Environment variables template |

---

## Testing Checklist

- [ ] Booking confirmation opens WhatsApp with correct message
- [ ] Phone number format works (with and without country code)
- [ ] Message formatting renders correctly in WhatsApp
- [ ] Special characters (emojis, line breaks) display properly
- [ ] Staff reminder button sends correct message
- [ ] Works on mobile browsers
- [ ] Works on desktop browsers with WhatsApp Web
