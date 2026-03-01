import { NextResponse } from "next/server";
import { listDNSRecords, addDNSRecord, deleteDNSRecord } from "@/lib/hestia";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const user = searchParams.get("user") || "admin";

    if (!domain) {
      return NextResponse.json(
        { error: "Domain parameter is required" },
        { status: 400 }
      );
    }

    const records = await listDNSRecords(domain, user);
    return NextResponse.json({ records });
  } catch (error) {
    console.error("[HestiaCP DNS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch DNS records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, domain, record, type, value, user, priority, ttl } = body;

    if (action === "add") {
      const success = await addDNSRecord(domain, record, type, value, user, { priority, ttl });
      return NextResponse.json({ success });
    }

    if (action === "delete") {
      const success = await deleteDNSRecord(domain, record, user);
      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'add' or 'delete'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[HestiaCP DNS POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
