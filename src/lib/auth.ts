"use server";

import bcrypt from "bcryptjs";

// Demo mode storage (in-memory, works without database)
const demoUsers: Map<string, { id: number; name: string; email: string; password: string }> = new Map();
let demoUserIdCounter = 1;

// Check if we're in demo mode (no database)
const isDemoMode = !process.env.DB_URL;

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  console.log("[signup] Received request for:", email);
  
  if (isDemoMode) {
    // Demo mode - use in-memory storage
    console.log("[signup] Demo mode - using in-memory storage");
    
    if (demoUsers.has(email)) {
      return { success: false, error: "An account with this email already exists" };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: demoUserIdCounter++,
      name,
      email,
      password: hashedPassword,
    };
    demoUsers.set(email, user);
    
    console.log("[signup] Demo user created:", email);
    return { success: true };
  }
  
  // Real database mode
  try {
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    
    if (!db) {
      return { success: false, error: "Database not configured" };
    }
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log("[signup] Existing user check:", existingUser.length > 0 ? "found" : "none");

    if (existingUser.length > 0) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[signup] Password hashed successfully");

    // Create the user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    console.log("[signup] User created successfully!");
    return { success: true };
  } catch (error) {
    console.error("[signup] Error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult & { user?: { id: number; name: string; email: string } }> {
  
  if (isDemoMode) {
    // Demo mode - use in-memory storage
    console.log("[login] Demo mode - using in-memory storage");
    
    const user = demoUsers.get(email);
    
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
  
  // Real database mode
  try {
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    
    if (!db) {
      return { success: false, error: "Database not configured" };
    }
    
    // Find user by email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }

    const user = existingUser[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}
