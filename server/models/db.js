import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('✗ Database connection error:', err.message);
});

// Helper function to run queries
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed', { text: text.substring(0, 50), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

// Helper to get single row
export async function getOne(text, params) {
  const result = await query(text, params);
  return result.rows[0];
}

// Helper to get all rows
export async function getAll(text, params) {
  const result = await query(text, params);
  return result.rows;
}

// Generate reference number
export async function generateReference() {
  const refNum = 'REF-' + String(Math.floor(10000 + Math.random() * 89999));
  // Check if exists
  const existing = await getOne('SELECT reference FROM matters WHERE reference = $1', [refNum]);
  if (existing) return generateReference(); // Recursively try again
  return refNum;
}

export default pool;
