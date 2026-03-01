import { NextRequest, NextResponse } from "next/server";
import { 
  listContainers, 
  createContainer, 
  getContainer,
  getContainerStats,
  getTemplates 
} from "@/lib/lxc";

// GET /api/lxc - List containers or get templates
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const vmid = searchParams.get("vmid");
  const userId = searchParams.get("userId") || "1";
  
  try {
    // Get container stats
    if (action === "stats" && vmid) {
      const stats = await getContainerStats(vmid);
      return NextResponse.json(stats);
    }
    
    // Get available templates
    if (action === "templates") {
      const templates = getTemplates();
      return NextResponse.json(templates);
    }
    
    // Get single container
    if (vmid) {
      const container = await getContainer(vmid);
      if (!container) {
        return NextResponse.json({ error: "Container not found" }, { status: 404 });
      }
      return NextResponse.json(container);
    }
    
    // List all containers for user
    const containers = await listContainers(userId);
    return NextResponse.json(containers);
  } catch (error) {
    console.error("LXC API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST /api/lxc - Create new container
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, hostname, cores, memory, disk, password, ostemplate } = body;
    
    if (!name || !hostname || !cores || !memory || !disk || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const container = await createContainer(userId || "1", {
      name,
      hostname,
      cores,
      memory,
      disk,
      password,
      ostemplate: ostemplate || "ubuntu-22.04",
    });
    
    return NextResponse.json(container, { status: 201 });
  } catch (error) {
    console.error("LXC create error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
