import express from 'express';
import { query, getOne, getAll, generateReference } from '../models/db.js';
import { sendConfirmation, sendReminder, sendStatusUpdate } from '../services/whatsapp.js';
import { sendBookingConfirmation, sendAdminNotification } from '../services/email.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES: Health & Utils
// ═══════════════════════════════════════════════════════════════════════════

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE: POST /api/bookings - Create new booking
// ═══════════════════════════════════════════════════════════════════════════

router.post('/bookings', async (req, res) => {
  try {
    const { name, phone, email, matter_type, preferred_date, preferred_time, description, whatsapp_consent, popia_consent } = req.body;

    // Validation
    const errors = [];
    if (!name || name.length < 2) errors.push('Name is required');
    if (!phone || !phone.match(/^(\+27|0)[0-9]{9}$/)) errors.push('Valid SA phone number required');
    if (!matter_type) errors.push('Matter type is required');
    if (!preferred_date) errors.push('Preferred date is required');
    if (!preferred_time) errors.push('Preferred time is required');
    if (!popia_consent) errors.push('POPIA consent is required');

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Normalize phone (remove spaces, ensure +27 format)
    const normalizedPhone = phone.replace(/\s/g, '').replace(/^0/, '+27');

    // Find existing client or create new
    let client = await getOne('SELECT * FROM clients WHERE phone = $1', [normalizedPhone]);
    
    if (!client) {
      const clientResult = await query(
        `INSERT INTO clients (name, phone, email, whatsapp_consent, popia_consent) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, normalizedPhone, email || null, whatsapp_consent || false, popia_consent]
      );
      client = clientResult.rows[0];
    }

    // Create booking
    const bookingResult = await query(
      `INSERT INTO bookings (client_id, matter_type, preferred_date, preferred_time, description, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [client.id, matter_type, preferred_date, preferred_time, description || null]
    );
    const booking = bookingResult.rows[0];

    // Generate reference and create matter
    const reference = await generateReference();
    const matterResult = await query(
      `INSERT INTO matters (booking_id, client_id, reference, status, next_action) 
       VALUES ($1, $2, $3, 'pending', 'Awaiting initial consultation') RETURNING *`,
      [booking.id, client.id, reference]
    );
    const matter = matterResult.rows[0];

    // Format date for display
    const dateObj = new Date(preferred_date);
    const dateFormatted = dateObj.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

    // Send WhatsApp confirmation (async, don't wait)
    if (whatsapp_consent) {
      sendConfirmation(normalizedPhone, reference, dateFormatted, preferred_time, matter_type)
        .then(() => console.log(`✓ WhatsApp sent to ${normalizedPhone}`))
        .catch(err => console.error('WhatsApp error:', err.message));
    }

    // Send email confirmation (async)
    if (email) {
      sendBookingConfirmation(email, { name, reference, date: dateFormatted, time: preferred_time, matter: matter_type })
        .then(() => console.log(`✓ Email sent to ${email}`))
        .catch(err => console.error('Email error:', err.message));
    }

    // Send admin notification (async)
    sendAdminNotification({ name, phone: normalizedPhone, matter: matter_type, date: dateFormatted })
      .catch(err => console.error('Admin email error:', err.message));

    // Store reference for frontend
    client.lastReference = reference;

    console.log(`✓ New booking: ${reference} for ${name}`);

    res.status(201).json({
      success: true,
      reference,
      booking_id: booking.id,
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking', message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE: GET /api/matters/:ref - Get matter by reference
// ═══════════════════════════════════════════════════════════════════════════

router.get('/matters/:ref', async (req, res) => {
  try {
    const { ref } = req.params;
    const reference = ref.toUpperCase().startsWith('REF-') ? ref.toUpperCase() : `REF-${ref.toUpperCase()}`;

    const matter = await getOne(`
      SELECT 
        m.reference,
        m.status AS matter_status,
        m.next_action,
        m.updated_at,
        c.name AS client_name,
        c.phone AS client_phone,
        c.email AS client_email,
        b.matter_type,
        b.preferred_date,
        b.preferred_time,
        b.description,
        b.created_at AS booking_date,
        a.name AS attorney_name,
        a.email AS attorney_email
      FROM matters m
      JOIN bookings b ON m.booking_id = b.id
      JOIN clients c ON m.client_id = c.id
      LEFT JOIN attorneys a ON m.attorney_id = a.id
      WHERE m.reference = $1
    `, [reference]);

    if (!matter) {
      return res.status(404).json({ error: 'Matter not found', reference });
    }

    // Map status to numeric for frontend compatibility
    const statusMap = {
      'pending': 0,
      'in_progress': 1,
      'awaiting_docs': 2,
      'hearing': 3,
      'resolved': 4
    };

    const statusLabels = {
      'pending': 'PENDING',
      'in_progress': 'IN PROGRESS',
      'awaiting_docs': 'AWAITING DOCS',
      'hearing': 'HEARING SCHEDULED',
      'resolved': 'RESOLVED'
    };

    const statusClasses = {
      'pending': 'status-pending',
      'in_progress': 'status-in-progress',
      'awaiting_docs': 'status-awaiting',
      'hearing': 'status-scheduled',
      'resolved': 'status-resolved'
    };

    const formattedDate = new Date(matter.preferred_date).toLocaleDateString('en-ZA', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });

    res.json({
      reference: matter.reference,
      name: matter.client_name,
      phone: matter.client_phone,
      email: matter.client_email,
      matter: matter.matter_type,
      date: `${formattedDate}, ${matter.preferred_time}`,
      attorney: matter.attorney_name || 'To be assigned',
      attorney_email: matter.attorney_email,
      updated: new Date(matter.updated_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
      next: matter.next_action,
      status: statusMap[matter.matter_status] || 0,
      statusLabel: statusLabels[matter.matter_status] || 'PENDING',
      statusClass: statusClasses[matter.matter_status] || 'status-pending',
      wa: matter.client_phone
    });

  } catch (error) {
    console.error('Matter lookup error:', error);
    res.status(500).json({ error: 'Failed to fetch matter', message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE: PATCH /api/matters/:ref/status - Update matter status (Admin)
// ═══════════════════════════════════════════════════════════════════════════

router.patch('/matters/:ref/status', async (req, res) => {
  try {
    const { ref } = req.params;
    const { status, next_action, attorney_id } = req.body;
    const reference = ref.toUpperCase().startsWith('REF-') ? ref.toUpperCase() : `REF-${ref.toUpperCase()}`;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'awaiting_docs', 'hearing', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', valid: validStatuses });
    }

    // Get current matter to find client phone
    const currentMatter = await getOne('SELECT client_id FROM matters WHERE reference = $1', [reference]);
    if (!currentMatter) {
      return res.status(404).json({ error: 'Matter not found' });
    }

    // Get client phone
    const client = await getOne('SELECT phone FROM clients WHERE id = $1', [currentMatter.client_id]);

    // Update matter
    const updates = ['status = $1', 'next_action = $2', 'updated_at = CURRENT_TIMESTAMP'];
    const params = [status, next_action || null];
    
    if (attorney_id) {
      updates.push(`attorney_id = $3`);
      params.push(attorney_id);
    }

    const result = await query(
      `UPDATE matters SET ${updates.join(', ')} WHERE reference = $${params.length} RETURNING *`,
      [...params, reference]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Matter not found' });
    }

    // Send WhatsApp status update
    if (client?.phone) {
      const statusMessages = {
        'pending': 'Your matter is pending review.',
        'in_progress': 'Your matter is now in progress.',
        'awaiting_docs': 'We are awaiting documents from you.',
        'hearing': 'A hearing has been scheduled.',
        'resolved': 'Your matter has been resolved.'
      };
      
      sendStatusUpdate(client.phone, reference, status, next_action || statusMessages[status])
        .catch(err => console.error('WhatsApp update error:', err.message));
    }

    console.log(`✓ Status updated: ${reference} → ${status}`);

    res.json({
      success: true,
      reference,
      status,
      next_action
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE: GET /api/bookings - List all bookings (Admin)
// ═══════════════════════════════════════════════════════════════════════════

router.get('/bookings', async (req, res) => {
  try {
    const { status, from_date, to_date, page = 1, limit = 20 } = req.query;
    
    let whereClause = '';
    const params = [];
    let paramIndex = 1;

    if (status) {
      whereClause += `WHERE b.status = $${paramIndex++}`;
      params.push(status);
    }

    if (from_date) {
      whereClause += whereClause ? ` AND ` : `WHERE `;
      whereClause += `b.preferred_date >= $${paramIndex++}`;
      params.push(from_date);
    }

    if (to_date) {
      whereClause += whereClause ? ` AND ` : `WHERE `;
      whereClause += `b.preferred_date <= $${paramIndex++}`;
      params.push(to_date);
    }

    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const bookings = await getAll(`
      SELECT 
        b.id, b.matter_type, b.preferred_date, b.preferred_time, b.status, b.description, b.created_at,
        c.name AS client_name, c.phone AS client_phone, c.email AS client_email,
        m.reference, m.status AS matter_status, a.name AS attorney_name
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
      LEFT JOIN matters m ON m.booking_id = b.id
      LEFT JOIN attorneys a ON m.attorney_id = a.id
      ${whereClause}
      ORDER BY b.preferred_date DESC, b.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `, params);

    // Get total count
    const countResult = await getOne(`
      SELECT COUNT(*) as total FROM bookings b ${whereClause.replace(/\$/g, '$$')}`, 
      params.slice(0, -2)
    );

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult?.total || 0)
      }
    });

  } catch (error) {
    console.error('Bookings list error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE: GET /api/attorneys - List attorneys
// ═══════════════════════════════════════════════════════════════════════════

router.get('/attorneys', async (req, res) => {
  try {
    const attorneys = await getAll('SELECT id, name, email, specializations FROM attorneys ORDER BY name');
    res.json(attorneys);
  } catch (error) {
    console.error('Attorneys fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch attorneys' });
  }
});

export default router;
