-- LexisLaw Database Schema
-- Run this against your PostgreSQL database (e.g., Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Attorneys table
CREATE TABLE attorneys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
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
CREATE TABLE bookings (
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
CREATE TABLE matters (
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
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_date ON bookings(preferred_date);
CREATE INDEX idx_matters_reference ON matters(reference);
CREATE INDEX idx_matters_status ON matters(status);
CREATE INDEX idx_clients_phone ON clients(phone);

-- Seed attorneys data
INSERT INTO attorneys (name, email, specializations) VALUES
    ('Adv. T. Nkosi', 'tnkosi@lexislaw.co.za', ARRAY['Criminal Defence', 'Family Law']),
    ('Adv. S. Mokoena', 'smokoena@lexislaw.co.za', ARRAY['Commercial Law', 'Civil Litigation']),
    ('Adv. N. Pillay', 'npillay@lexislaw.co.za', ARRAY['Estate Planning', 'Property Law']),
    ('Adv. L. van der Merwe', 'lvdm@lexislaw.co.za', ARRAY['Labour Law', 'Contract Law']);

-- Function to generate reference number
CREATE OR REPLACE FUNCTION generate_reference()
RETURNS VARCHAR(10) AS $$
DECLARE
    ref_num VARCHAR(10);
    exists_ref BOOLEAN := TRUE;
BEGIN
    WHILE exists_ref LOOP
        ref_num := 'REF-' || LPAD(FLOOR(10000 + RANDOM() * 89999)::TEXT, 5, '0');
        SELECT EXISTS(SELECT 1 FROM matters WHERE reference = ref_num) INTO exists_ref;
    END LOOP;
    RETURN ref_num;
END;
$$ LANGUAGE plpgsql;

-- View for matter details with joins
CREATE OR REPLACE VIEW matter_details AS
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
    b.created_at AS booking_date,
    a.name AS attorney_name,
    a.email AS attorney_email
FROM matters m
JOIN bookings b ON m.booking_id = b.id
JOIN clients c ON m.client_id = c.id
LEFT JOIN attorneys a ON m.attorney_id = a.id;
