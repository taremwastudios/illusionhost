import { NextRequest, NextResponse } from "next/server";
import { 
  getContainer, 
  startContainer, 
  stopContainer, 
  restartContainer, 
  deleteContainer,
  getContainerStats 
} from "@/lib/lxc";

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
    return NextResponse.json(container);
  } catch (error) {
    console.error("LXC get error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ vmid: string }> }
) {
  const { vmid } = await params;
  
  try {
    await deleteContainer(vmid);
    return NextResponse.json({ success: true, message: "Container deleted" });
  } catch (error) {
    console.error("LXC delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ vmid: string }> }
) {
  const { vmid } = await params;
  
  try {
    const body = await request.json();
    const { action } = body;
    
    let container;
    
    switch (action) {
      case "start":
        container = await startContainer(vmid);
        break;
      case "stop":
        container = await stopContainer(vmid);
        break;
      case "restart":
        container = await restartContainer(vmid);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: start, stop, restart" },
          { status: 400 }
        );
    }
    
    return NextResponse.json(container);
  } catch (error) {
    console.error("LXC action error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
