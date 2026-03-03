/**
 * Database Initialization Script
 * Run this to set up the PostgreSQL database for LexisLaw
 * 
 * Usage: node server/models/init.js
 * 
 * Or run SQL directly: psql $DATABASE_URL -f server/models/schema.sql
 */

import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Attorneys table
CREATE TABLE IF NOT EXISTS attorneys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    whatsapp_consent BOOLEAN DEFAULT FALSE,
    popia_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(phone)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id),
    matter_type VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(20) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Matters table (legal cases)
CREATE TABLE IF NOT EXISTS matters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    reference VARCHAR(10) NOT NULL UNIQUE,
    attorney_id UUID REFERENCES attorneys(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'awaiting_docs', 'hearing', 'resolved')),
    next_action TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_matters_reference ON matters(reference);
CREATE INDEX IF NOT EXISTS idx_matters_status ON matters(status);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
`;

const seedData = `
-- Seed attorneys data (only if table is empty)
INSERT INTO attorneys (name, email, specializations) 
SELECT 'Adv. T. Nkosi', 'tnkosi@lexislaw.co.za', ARRAY['Criminal Defence', 'Family Law']
WHERE NOT EXISTS (SELECT 1 FROM attorneys WHERE email = 'tnkosi@lexislaw.co.za');

INSERT INTO attorneys (name, email, specializations) 
SELECT 'Adv. S. Mokoena', 'smokoena@lexislaw.co.za', ARRAY['Commercial Law', 'Civil Litigation']
WHERE NOT EXISTS (SELECT 1 FROM attorneys WHERE email = 'smokoena@lexislaw.co.za');

INSERT INTO attorneys (name, email, specializations) 
SELECT 'Adv. N. Pillay', 'npillay@lexislaw.co.za', ARRAY['Estate Planning', 'Property Law']
WHERE NOT EXISTS (SELECT 1 FROM attorneys WHERE email = 'npillay@lexislaw.co.za');

INSERT INTO attorneys (name, email, specializations) 
SELECT 'Adv. L. van der Merwe', 'lvdm@lexislaw.co.za', ARRAY['Labour Law', 'Contract Law']
WHERE NOT EXISTS (SELECT 1 FROM attorneys WHERE email = 'lvdm@lexislaw.co.za');
`;

async function initDatabase() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   LEXIS LAW — Database Initialization             ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠ DATABASE_URL not set in .env');
    console.log('\nPlease create a .env file with:');
    console.log('DATABASE_URL=postgresql://user:password@host:5432/lexislaw');
    console.log('\nOr use Supabase:');
    console.log('DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres\n');
    
    // Exit gracefully in demo mode
    console.log('✓ Database initialization skipped (no DATABASE_URL)');
    console.log('✓ The server will run in demo mode with mock data');
    return;
  }

  try {
    console.log('📊 Creating tables...');
    
    // Split and run schema statements
    const statements = schema.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await query(stmt);
      }
    }
    console.log('✓ Tables created');

    console.log('📊 Seeding attorneys...');
    const seedStatements = seedData.split(';').filter(s => s.trim());
    for (const stmt of seedStatements) {
      if (stmt.trim()) {
        await query(stmt);
      }
    }
    console.log('✓ Seed data inserted');

    // Verify
    const attorneys = await query('SELECT name, email FROM attorneys');
    console.log(`\n✓ Database initialized successfully!`);
    console.log(`✓ ${attorneys.rows.length} attorneys loaded:\n`);
    attorneys.rows.forEach(a => console.log(`   • ${a.name} (${a.email})`));

  } catch (error) {
    console.error('\n✗ Database initialization failed:');
    console.error(error.message);
    console.log('\n✓ Server will run in demo mode');
  }
}

// Run if called directly
initDatabase();

export default initDatabase;
