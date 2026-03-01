import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/lxc";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vmid: string }> }
) {
  const { vmid } = await params;
  
  try {
    const container = await getContainer(vmid);
    
    if (!container) {
      return NextResponse.json({ error: "Container not found" }, { status: 404 });
    }
    
    if (container.status !== "running") {
      return NextResponse.json(
        { error: "Container must be running to access console" },
        { status: 400 }
      );
    }
    
    // In production, this would return a real noVNC/WebSocket URL
    // For demo, we return connection details
    return NextResponse.json({
      consoleUrl: `/account/vps/console/${vmid}`,
      connection: {
        type: "ssh",
        host: container.ip,
        port: 22,
        username: "root",
        // Note: In production, never expose passwords like this
        // Use key-based auth or a proxy service
        password: container.password,
      },
      vnc: {
        url: `wss://console.example.com/vnc/${vmid}`,
        token: `demo-token-${vmid}`,
      },
      message: "Demo mode - console access simulated",
    });
  } catch (error) {
    console.error("LXC console error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
