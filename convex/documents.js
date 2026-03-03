// LexisLaw Document Management for Convex
// Upload, retrieve, and manage client documents

import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Allowed file types and max size
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Get storage context
async function getStorage(ctx) {
  return await ctx.storage;
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// Upload a document
export const uploadDocument = mutation({
  args: {
    client_id: v.id("clients"),
    matter_reference: v.string(),
    file: v.file(),
  },
  handler: async (ctx, args) => {
    const file = args.file;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed: PDF, PNG, JPG, DOC, DOCX`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size: 10MB`);
    }

    // Store file in Convex storage
    const storageId = await ctx.storage.store(file);

    // Determine file type category
    let fileType = "other";
    if (file.type === "application/pdf") fileType = "pdf";
    else if (file.type.startsWith("image/")) fileType = "image";
    else if (file.type.includes("word")) fileType = "document";

    // Create document record
    const documentId = await ctx.db.insert("documents", {
      client_id: args.client_id,
      matter_reference: args.matter_reference,
      filename: file.name,
      file_type: fileType,
      file_size: file.size,
      storage_id: storageId,
    });

    return {
      success: true,
      document_id: documentId,
      filename: file.name,
      size: file.size,
    };
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: {
    document_id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.document_id);
    if (!doc) {
      throw new Error("Document not found");
    }

    // Delete from storage
    await ctx.storage.delete(doc.storage_id);

    // Delete record
    await ctx.db.delete(args.document_id);

    return { success: true };
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════

// Get documents for a client
export const getClientDocuments = query({
  args: {
    client_id: v.id("clients"),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_client", (q) => q.eq("client_id", args.client_id))
      .collect();

    return docs.map((d) => ({
      id: d._id,
      matter_reference: d.matter_reference,
      filename: d.filename,
      file_type: d.file_type,
      file_size: d.file_size,
      uploaded_at: d._creationTime,
    }));
  },
});

// Get documents for a specific matter
export const getMatterDocuments = query({
  args: {
    matter_reference: v.string(),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_matter", (q) =>
        q.eq("matter_reference", args.matter_reference)
      )
      .collect();

    return docs.map((d) => ({
      id: d._id,
      client_id: d.client_id,
      filename: d.filename,
      file_type: d.file_type,
      file_size: d.file_size,
      uploaded_at: d._creationTime,
    }));
  },
});

// Get all documents (admin)
export const getAllDocuments = query({
  args: {},
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("documents").collect();

    // Get client info for each
    const results = await Promise.all(
      docs.map(async (d) => {
        const client = await ctx.db.get(d.client_id);
        return {
          id: d._id,
          client_name: client?.name || "Unknown",
          client_email: client?.email,
          matter_reference: d.matter_reference,
          filename: d.filename,
          file_type: d.file_type,
          file_size: d.file_size,
          uploaded_at: d._creationTime,
        };
      })
    );

    return results;
  },
});

// Generate download URL
export const getDownloadUrl = query({
  args: {
    document_id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.document_id);
    if (!doc) {
      throw new Error("Document not found");
    }

    // Generate URL (valid for 1 hour)
    const url = await ctx.storage.getUrl(doc.storage_id);

    return {
      url,
      filename: doc.filename,
    };
  },
});
