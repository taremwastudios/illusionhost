import { NextResponse } from "next/server";
import { getSystemInfo } from "@/lib/hestia";

export async function GET() {
  try {
    const systemInfo = await getSystemInfo();
    
    if (!systemInfo) {
      // Return demo/mock data when HestiaCP is not configured
      return NextResponse.json({
        cpu: 23,
        ram: 45,
        storage: 67,
        status: "healthy",
        isDemo: true,
        message: "Running in demo mode - configure HESTIA_HOST and HESTIA_API_KEY for real data"
      });
    }
    
    // Calculate percentage usage
    const cpu = Math.min(100, Math.round((systemInfo.load?.[0] || 0) * 10));
    const ram = systemInfo.memory 
      ? Math.round((systemInfo.memory.used / systemInfo.memory.total) * 100)
      : 0;
    const storage = systemInfo.disk
      ? Math.round((systemInfo.disk.used / systemInfo.disk.total) * 100)
      : 0;
    
    // Determine status based on thresholds
    let status: "healthy" | "warning" | "failing" = "healthy";
    if (cpu > 90 || ram > 90 || storage > 95) {
      status = "failing";
    } else if (cpu > 70 || ram > 75 || storage > 85) {
      status = "warning";
    }
    
    return NextResponse.json({
      cpu,
      ram,
      storage,
      status,
      isDemo: false,
      raw: {
        load: systemInfo.load,
        memory: systemInfo.memory,
        disk: systemInfo.disk
      }
    });
  } catch (error) {
    console.error("[Resource Usage] Error:", error);
    // Return demo data on error
    return NextResponse.json({
      cpu: 23,
      ram: 45,
      storage: 67,
      status: "healthy",
      isDemo: true,
      error: "Failed to fetch real data"
    });
  }
}
