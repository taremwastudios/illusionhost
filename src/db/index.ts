import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

export const db = createDatabase(schema);

// Demo mode detection and in-memory storage
const DB_URL = process.env.DB_URL || "";
export const isDemoMode = !DB_URL;

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
