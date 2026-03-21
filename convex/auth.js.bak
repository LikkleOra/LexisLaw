// LexisLaw Custom Authentication for Convex
// Implements register, login (JWT), and getCurrentUser queries/mutations.

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_DEFAULT_FALLBACK_KEY";
const TOKEN_EXPIRY = "1h";

// --- HELPERS ---

function generateToken(userId, role) {
  return sign({ sub: userId, role: role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// --- MUTATIONS ---

/**
 * Register a new client user.
 */
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.string(),
    whatsapp_consent: v.boolean(),
    popia_consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    // 1. Validate email format (basic check)
    if (!args.email.includes('@')) {
      throw new Error("Invalid email format.");
    }
    
    // 2. Validate password strength (minimum 8 chars)
    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    // 3. Check if email or phone already exists in users table
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // 4. Create client record (Phase 1 table)
    const normalizedPhone = args.phone.replace(/\s/g, "").replace(/^0/, "+27");
    let client = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("phone"), normalizedPhone))
      .first();
      
    let clientId;

    if (!client) {
      clientId = await ctx.db.insert("clients", {
        name: args.name,
        phone: normalizedPhone,
        email: args.email,
        whatsapp_consent: args.whatsapp_consent,
        popia_consent: args.popia_consent,
      });
    } else {
        clientId = client._id;
    }
    
    // 5. Hash password
    const password_hash = await hash(args.password, 10);

    // 6. Create user record
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password_hash: password_hash,
      client_id: clientId,
      role: "client",
      created_at: Date.now(),
    });

    // 7. Generate token
    const token = generateToken(userId, "client");

    return { 
      success: true, 
      token: token,
      userId: userId,
      role: "client"
    };
  },
});

/**
 * Login a user and return a JWT.
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Authentication failed: User not found.");
    }

    const isMatch = await compare(args.password, user.password_hash);

    if (!isMatch) {
      throw new Error("Authentication failed: Invalid credentials.");
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Optionally fetch client phone for immediate use if client role
    let clientPhone = null;
    if (user.role === 'client' && user.client_id) {
        const client = await ctx.db.get(user.client_id);
        clientPhone = client?.phone || null;
    }

    return { 
      success: true, 
      token: token, 
      userId: user._id,
      role: user.role,
      clientPhone: clientPhone
    };
  },
});

// --- QUERIES ---

/**
 * Get current user data by validating the JWT token.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
    // Get token from request headers (Convex utility)
    const token = ctx.request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return null; // Not logged in
    }

    try {
      const payload = verify(token, JWT_SECRET);
      
      const user = await ctx.db.get(payload.sub);
      
      if (!user) {
          return null; // User deleted or token invalid
      }

      // Fetch associated client data if role is client
      let clientData = null;
      if (user.role === 'client' && user.client_id) {
          const client = await ctx.db.get(user.client_id);
          clientData = {
              name: client?.name,
              phone: client?.phone,
              email: client?.email,
          };
      }

      return {
        userId: user._id,
        email: user.email,
        role: user.role,
        clientData: clientData,
      };

    } catch (e) {
      console.error("JWT Verification failed:", e.message);
      return null; // Token expired or invalid
    }
  },
});

/**
 * Syncs Admin users from server-side setup (for now, we use a simple admin check)
 */
export const createAdminUser = mutation({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        // Check if admin user exists - for initial setup only
        const existingAdmin = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
        if (existingAdmin) return { success: true, message: "Admin already exists." };

        if (args.password.length < 8) throw new Error("Admin password too weak.");

        const hashPass = await hash(args.password, 10);

        const userId = await ctx.db.insert("users", {
            email: args.email,
            password_hash: hashPass,
            role: "admin",
            created_at: Date.now(),
        });

        return { success: true, userId, role: "admin" };
    }
})