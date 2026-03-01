import { NextResponse } from "next/server";
import { db, isDemoMode } from "@/db";
import { users, HostingPlan } from "@/db/schema";
import { eq } from "drizzle-orm";

// Update user's hosting plan
export async function PUT(request: Request) {
  // Demo mode - return success without actually updating
  if (isDemoMode || !db) {
    const body = await request.json();
    const { userId, plan } = body;
    
    if (!userId || !plan) {
      return NextResponse.json(
        { error: "userId and plan required" },
        { status: 400 }
      );
    }
    
    const validPlans: HostingPlan[] = ["free", "starter", "professional", "business"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be: free, starter, professional, or business" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      userId: parseInt(String(userId)),
      plan,
      message: `Demo mode: Plan updated to ${plan}`,
    });
  }
  
  const body = await request.json();
  const { userId, plan } = body;

  if (!userId || !plan) {
    return NextResponse.json(
      { error: "userId and plan required" },
      { status: 400 }
    );
  }

  const validPlans: HostingPlan[] = ["free", "starter", "professional", "business"];
  if (!validPlans.includes(plan)) {
    return NextResponse.json(
      { error: "Invalid plan. Must be: free, starter, professional, or business" },
      { status: 400 }
    );
  }

  const userIdNum = parseInt(String(userId));
  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userIdNum),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.update(users).set({ plan }).where(eq(users.id, userIdNum));

  return NextResponse.json({
    success: true,
    userId: userIdNum,
    plan,
    message: `Plan updated to ${plan}`,
  });
}
