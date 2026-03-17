// LexisLaw Convex Client Configuration
// Initializes Convex client with Clerk authentication

import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";

// Convex deployment URL - replace with your deployment after running `npx convex dev`
const CONVEX_ADDRESS = import.meta.env.VITE_CONVEX_URL || "https://your-deployment.convex.cloud";

// Create Convex client
const convex = new ConvexReactClient(CONVEX_ADDRESS);

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_your_key";

// Export for use in the app
export { convex, CLERK_PUBLISHABLE_KEY };

// Standalone Convex client (without Clerk) for non-authenticated routes
export function createConvexClient() {
  return new ConvexReactClient(CONVEX_ADDRESS);
}

// Helper to check if user is authenticated
export async function isAuthenticated() {
  const token = sessionStorage.getItem("clerk_token");
  return !!token;
}

// Helper to get current user ID
export function getCurrentUserId() {
  return sessionStorage.getItem("clerk_token");
}

// Initialize Convex with Clerk authentication
// Call this in your app entry point
export function initConvexWithClerk() {
  // Check if Clerk is available
  if (typeof window !== "undefined" && window.Clerk) {
    Clerk.configureClerk(window.__Clerk);

    // Listen for auth changes
    Clerk.addListener("clerk:user", (session) => {
      if (session) {
        // Set up Convex auth with Clerk token
        convex.setAuth(async () => {
          const token = await Clerk.getToken({ template: "convex" });
          return token;
        });
      } else {
        convex.clearAuth();
      }
    });
  }

  return convex;
}

// Export Convex query/mutation helpers for vanilla JS
export const api = {
  // Bookings
  createBooking: (data) => convex.mutation("createBooking", data),
  getBookings: (filters) => convex.query("getBookings", filters || {}),

  // Matters
  getMatterByReference: (ref) => convex.query("getMatterByReference", { reference: ref }),
  getMatters: () => convex.query("getMatters", {}),
  updateMatterStatus: (ref, status, next) => convex.mutation("updateMatterStatus", { reference: ref, status, next_action: next }),
  approveBooking: (id) => convex.mutation("approveBooking", { id }),

  // Attorneys
  getAttorneys: () => convex.query("getAttorneys", {}),

  // Auth
  getClientByClerk: (clerkId) => convex.query("getClientByClerk", { clerk_id: clerkId }),
  syncClerkUser: (data) => convex.mutation("syncClerkUser", data),

  // Documents
  uploadDocument: (data) => convex.mutation("uploadDocument", data),
  getClientDocuments: (clientId) => convex.query("getClientDocuments", { client_id: clientId }),
  getMatterDocuments: (ref) => convex.query("getMatterDocuments", { matter_reference: ref }),
  getDownloadUrl: (docId) => convex.query("getDownloadUrl", { document_id: docId }),

  // SMS
  sendSMS: (data) => convex.mutation("sendSMS", data),
  getClientSMSLogs: (clientId) => convex.query("getClientSMSLogs", { client_id: clientId }),
};

// Make available globally
if (typeof window !== "undefined") {
  window.lexisLawApi = api;
  window.convexClient = convex;
}

console.log("✓ LexisLaw Convex client initialized");
