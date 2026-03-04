import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("lawoffice.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    role TEXT,
    firstName TEXT,
    lastName TEXT,
    isActive INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    caseNumber TEXT UNIQUE,
    clientId TEXT,
    lawyerId TEXT,
    title TEXT,
    type TEXT,
    status TEXT,
    priority TEXT,
    description TEXT,
    deadlineAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(clientId) REFERENCES users(id),
    FOREIGN KEY(lawyerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    caseId TEXT,
    uploadedBy TEXT,
    fileName TEXT,
    fileSize INTEGER,
    mimeType TEXT,
    visibility TEXT,
    isPrivileged INTEGER DEFAULT 0,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(caseId) REFERENCES cases(id),
    FOREIGN KEY(uploadedBy) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    caseId TEXT,
    clientId TEXT,
    lawyerId TEXT,
    requestedAt DATETIME,
    confirmedAt DATETIME,
    status TEXT,
    type TEXT,
    durationMinutes INTEGER,
    notes TEXT,
    FOREIGN KEY(caseId) REFERENCES cases(id),
    FOREIGN KEY(clientId) REFERENCES users(id),
    FOREIGN KEY(lawyerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    caseId TEXT,
    senderId TEXT,
    receiverId TEXT,
    content TEXT,
    isRead INTEGER DEFAULT 0,
    sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(caseId) REFERENCES cases(id),
    FOREIGN KEY(senderId) REFERENCES users(id),
    FOREIGN KEY(receiverId) REFERENCES users(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (id, email, role, firstName, lastName) VALUES (?, ?, ?, ?, ?)");
  insertUser.run("u1", "lawyer@lawoffice.pro", "lawyer", "Marcus", "Dlamini");
  insertUser.run("u2", "client@example.com", "client", "Thomas", "Johnson");
  insertUser.run("u3", "admin@lawoffice.pro", "admin", "Sarah", "Smith");

  const insertCase = db.prepare("INSERT INTO cases (id, caseNumber, clientId, lawyerId, title, type, status, priority, deadlineAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insertCase.run("c1", "CASE-001", "u2", "u1", "Johnson vs. State", "Criminal", "Active", "High", "2026-03-15");
  insertCase.run("c2", "CASE-002", "u2", "u1", "Property Dispute - Sandton", "Property", "Pending", "Medium", "2026-04-02");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/me", (req, res) => {
    // Mocking a logged in lawyer for the demo
    const user = db.prepare("SELECT * FROM users WHERE role = 'lawyer'").get();
    res.json(user);
  });

  app.get("/api/cases", (req, res) => {
    const cases = db.prepare(`
      SELECT c.*, u.firstName as clientFirstName, u.lastName as clientLastName 
      FROM cases c 
      JOIN users u ON c.clientId = u.id
    `).all();
    res.json(cases);
  });

  app.get("/api/stats", (req, res) => {
    const activeCases = db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'Active'").get() as any;
    const pendingAppts = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'Requested'").get() as any;
    const totalDocs = db.prepare("SELECT COUNT(*) as count FROM documents").get() as any;
    
    res.json({
      activeCases: activeCases.count,
      pendingAppts: pendingAppts.count,
      totalDocs: totalDocs.count,
      winRate: 94 // Mocked as per PRD
    });
  });

  app.get("/api/messages/:caseId", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages WHERE caseId = ? ORDER BY sentAt ASC").all(req.params.caseId);
    res.json(messages);
  });

  app.get("/api/documents/:caseId", (req, res) => {
    const docs = db.prepare("SELECT * FROM documents WHERE caseId = ? ORDER BY uploadedAt DESC").all(req.params.caseId);
    res.json(docs);
  });

  app.post("/api/documents", (req, res) => {
    const { id, caseId, uploadedBy, fileName, fileSize, mimeType, visibility, isPrivileged } = req.body;
    
    try {
      const insert = db.prepare(`
        INSERT INTO documents (id, caseId, uploadedBy, fileName, fileSize, mimeType, visibility, isPrivileged)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(id, caseId, uploadedBy, fileName, fileSize, mimeType, visibility, isPrivileged ? 1 : 0);
      
      const newDoc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
      res.status(201).json(newDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save document metadata" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
