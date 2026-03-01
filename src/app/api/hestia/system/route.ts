import { NextResponse } from "next/server";
import { getSystemInfo } from "@/lib/hestia";

export async function GET() {
  try {
    const systemInfo = await getSystemInfo();
    
    if (!systemInfo) {
      return NextResponse.json(
        { error: "Failed to retrieve system info" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error("[HestiaCP System] Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to HestiaCP" },
      { status: 500 }
    );
  }
}
