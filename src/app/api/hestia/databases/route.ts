import { NextResponse } from "next/server";
import { listDatabases, addDatabase, deleteDatabase } from "@/lib/hestia";

export async function GET() {
  try {
    const databases = await listDatabases();
    return NextResponse.json({ databases });
  } catch (error) {
    console.error("[HestiaCP Databases] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch databases" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, database, user, dbUser, dbPassword, type, charset } = body;

    if (action === "add") {
      const success = await addDatabase(database, user, { dbUser, dbPassword, type, charset });
      return NextResponse.json({ success });
    }

    if (action === "delete") {
      const success = await deleteDatabase(database, user);
      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'add' or 'delete'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[HestiaCP Databases POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
