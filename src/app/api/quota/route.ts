import { NextResponse } from "next/server";
import { db, isDemoMode, demoUsers } from "@/db";
import { users, PLAN_LIMITS } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get user's current plan, limits, and usage
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const userIdNum = parseInt(userId);
  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  // Handle demo mode
  if (isDemoMode) {
    const allDemoUsers = demoUsers.getAll();
    const demoUser = allDemoUsers.find(u => u.id === userIdNum);
    if (!demoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      plan: "free",
      limits: PLAN_LIMITS.free,
      usage: {
        domains: 0,
        databases: 0,
        diskMB: 0,
        dnsRecords: 0,
        emailAccounts: 0,
      },
    });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userIdNum),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const plan = (user.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return NextResponse.json({
    plan,
    limits,
    usage: {
      domains: user.domainsUsed || 0,
      databases: user.databasesUsed || 0,
      diskMB: user.diskUsedMB || 0,
      dnsRecords: user.dnsRecordsUsed || 0,
      emailAccounts: user.emailAccountsUsed || 0,
    },
  });
}

// Check if user can add a specific resource
export async function POST(request: Request) {
  const body = await request.json();
  const { userId, resourceType, amount = 1 } = body;

  if (!userId || !resourceType) {
    return NextResponse.json(
      { error: "userId and resourceType required" },
      { status: 400 }
    );
  }

  const userIdNum = parseInt(String(userId));
  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const validResources = [
    "domains",
    "databases",
    "disk",
    "dnsRecords",
    "emailAccounts",
  ];
  if (!validResources.includes(resourceType)) {
    return NextResponse.json(
      { error: "Invalid resource type" },
      { status: 400 }
    );
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userIdNum),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const plan = (user.plan || "free") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan];

  // Map resource type to limit key and current usage
  const resourceMap: Record<string, { limitKey: keyof typeof limits; used: number }> = {
    domains: { limitKey: "domains", used: user.domainsUsed || 0 },
    databases: { limitKey: "databases", used: user.databasesUsed || 0 },
    disk: { limitKey: "diskGB", used: Math.round((user.diskUsedMB || 0) / 1024) },
    dnsRecords: { limitKey: "dnsRecords", used: user.dnsRecordsUsed || 0 },
    emailAccounts: { limitKey: "emailAccounts", used: user.emailAccountsUsed || 0 },
  };

  const { limitKey, used } = resourceMap[resourceType];
  const limit = limits[limitKey] as number;

  const canAdd = used + amount <= limit;

  return NextResponse.json({
    canAdd,
    current: used,
    limit,
    remaining: Math.max(0, limit - used),
    plan,
  });
}

// Update usage after adding/removing resources
export async function PUT(request: Request) {
  const body = await request.json();
  const { userId, resourceType, amount = 1, operation = "add" } = body;

  if (!userId || !resourceType) {
    return NextResponse.json(
      { error: "userId and resourceType required" },
      { status: 400 }
    );
  }

  const userIdNum = parseInt(String(userId));
  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const validResources = [
    "domains",
    "databases",
    "disk",
    "dnsRecords",
    "emailAccounts",
  ];
  if (!validResources.includes(resourceType)) {
    return NextResponse.json(
      { error: "Invalid resource type" },
      { status: 400 }
    );
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userIdNum),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Map resource type to database column
  const columnMap: Record<string, any> = {
    domains: users.domainsUsed,
    databases: users.databasesUsed,
    disk: users.diskUsedMB,
    dnsRecords: users.dnsRecordsUsed,
    emailAccounts: users.emailAccountsUsed,
  };

  const column = columnMap[resourceType];
  const currentValue = (user as any)[resourceType === "disk" ? "diskUsedMB" : `${resourceType}Used`] || 0;
  const newValue = operation === "add" ? currentValue + amount : Math.max(0, currentValue - amount);

  await db.update(users).set({ [resourceType === "disk" ? "diskUsedMB" : `${resourceType}Used`]: newValue }).where(eq(users.id, userIdNum));

  return NextResponse.json({
    success: true,
    resourceType,
    operation,
    previousValue: currentValue,
    newValue,
  });
}
