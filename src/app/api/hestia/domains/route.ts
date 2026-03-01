import { NextResponse } from "next/server";
import { listWebDomains, addWebDomain, deleteWebDomain } from "@/lib/hestia";

export async function GET() {
  try {
    const domains = await listWebDomains();
    return NextResponse.json({ domains });
  } catch (error) {
    console.error("[HestiaCP Domains] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, domain, user, ...options } = body;

    if (action === "add") {
      const success = await addWebDomain(domain, user, options);
      return NextResponse.json({ success });
    }

    if (action === "delete") {
      const success = await deleteWebDomain(domain, user);
      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'add' or 'delete'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[HestiaCP Domains POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
