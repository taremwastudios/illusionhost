import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

// Demo mode detection - use in-memory storage when no DB_URL
const DB_URL = process.env.DB_URL || "";
export const isDemoMode = !DB_URL;

// Lazy database initialization - only create when DB_URL is set
export const db = DB_URL ? createDatabase(schema, { url: DB_URL, token: process.env.DB_TOKEN }) : null;

// In-memory user storage for demo mode (same as in auth.ts)
const demoUsersMap: Map<string, { id: number; name: string; email: string; password: string }> = new Map();
let demoUserIdCounter = 1;

export const demoUsers = {
  get: (email: string) => demoUsersMap.get(email),
  set: (email: string, user: { id: number; name: string; email: string; password: string }) => demoUsersMap.set(email, user),
  has: (email: string) => demoUsersMap.has(email),
  getAll: () => Array.from(demoUsersMap.values()),
  getNextId: () => demoUserIdCounter++,
};
