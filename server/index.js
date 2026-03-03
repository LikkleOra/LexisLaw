import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(join(__dirname, '../src')));

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve admin pages
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, '../src/admin/dashboard.html'));
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../src/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   LEXIS LAW SERVER RUNNING                       ║
║   ─────────────────────────────────────────────   ║
║   Frontend: http://localhost:${PORT}               ║
║   Admin:    http://localhost:${PORT}/admin          ║
║   API:      http://localhost:${PORT}/api (fallback)║
║                                                    ║
║   Backend:  Run 'npx convex dev' for Convex       ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;
