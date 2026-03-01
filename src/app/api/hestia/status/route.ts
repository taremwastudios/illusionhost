import { NextResponse } from "next/server";
import { isHestiaAvailable } from "@/lib/hestia";

export async function GET() {
  try {
    const available = await isHestiaAvailable();
    
    return NextResponse.json({
      available,
      message: available 
        ? "HestiaCP is connected and ready" 
        : "HestiaCP is not configured. Add HESTIA_HOST and HESTIA_API_KEY to your environment.",
    });
  } catch (error) {
    console.error("[HestiaCP Status] Error:", error);
    return NextResponse.json(
      { available: false, error: "Failed to connect to HestiaCP" },
      { status: 500 }
    );
  }
}
