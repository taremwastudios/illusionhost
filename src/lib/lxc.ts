// LXC Container Service - Simulates Proxmox LXC for demo/development
// Replace with real Proxmox API calls in production

export interface LXContainer {
  id: number;
  vmid: string;
  name: string;
  ostemplate: string;
  cores: number;
  memory: number;
  swap: number;
  disk: number;
  ip: string;
  status: "running" | "stopped" | "suspended";
  uptime: number;
  cpu: number;
  created: number;
  hostname: string;
  password: string;
}

export interface ContainerStats {
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
}

export interface CreateContainerParams {
  name: string;
  hostname: string;
  cores: number;
  memory: number;
  disk: number;
  password: string;
  ostemplate: string;
}

// In-memory storage for demo (replace with database in production)
const containers: Map<string, LXContainer> = new Map();
let nextVmid = 1000;

const defaultTemplates = [
  { id: "ubuntu-22.04", name: "Ubuntu 22.04 LTS", size: "512MB" },
  { id: "ubuntu-24.04", name: "Ubuntu 24.04 LTS", size: "512MB" },
  { id: "debian-12", name: "Debian 12 Bookworm", size: "256MB" },
  { id: "almalinux-9", name: "AlmaLinux 9", size: "320MB" },
  { id: "centos-7", name: "CentOS 7 (EOL)", size: "320MB" },
];

// Simulate container creation with random IP
function generateIp(): string {
  const base = "10.0.";
  const a = Math.floor(Math.random() * 254) + 1;
  const b = Math.floor(Math.random() * 254) + 1;
  return `${base}${a}.${b}`;
}

// Get all containers
export async function listContainers(userId: string): Promise<LXContainer[]> {
  return Array.from(containers.values()).filter(c => c.name.startsWith(`user${userId}-`));
}

// Get container by VMID
export async function getContainer(vmid: string): Promise<LXContainer | null> {
  return containers.get(vmid) || null;
}

// Get container statistics
export async function getContainerStats(vmid: string): Promise<ContainerStats> {
  const container = containers.get(vmid);
  if (!container) {
    throw new Error("Container not found");
  }
  
  return {
    cpu: container.status === "running" ? Math.random() * 30 + 5 : 0,
    memory: container.status === "running" ? Math.floor(container.memory * (0.4 + Math.random() * 0.3)) : 0,
    disk: container.disk,
    networkIn: container.status === "running" ? Math.floor(Math.random() * 1000000) : 0,
    networkOut: container.status === "running" ? Math.floor(Math.random() * 500000) : 0,
  };
}

// Create new container
export async function createContainer(userId: string, params: CreateContainerParams): Promise<LXContainer> {
  const vmid = String(nextVmid++);
  const container: LXContainer = {
    id: nextVmid,
    vmid,
    name: `${userId}-${params.name.toLowerCase().replace(/\s+/g, "-")}`,
    ostemplate: params.ostemplate,
    cores: params.cores,
    memory: params.memory,
    swap: Math.floor(params.memory / 2),
    disk: params.disk,
    ip: generateIp(),
    status: "stopped",
    uptime: 0,
    cpu: 0,
    created: Date.now(),
    hostname: params.hostname,
    password: params.password,
  };
  
  containers.set(vmid, container);
  return container;
}

// Start container
export async function startContainer(vmid: string): Promise<LXContainer> {
  const container = containers.get(vmid);
  if (!container) {
    throw new Error("Container not found");
  }
  
  if (container.status === "running") {
    throw new Error("Container is already running");
  }
  
  container.status = "running";
  container.uptime = Date.now();
  container.ip = generateIp(); // Simulate new IP on start
  containers.set(vmid, container);
  
  return container;
}

// Stop container
export async function stopContainer(vmid: string): Promise<LXContainer> {
  const container = containers.get(vmid);
  if (!container) {
    throw new Error("Container not found");
  }
  
  if (container.status !== "running") {
    throw new Error("Container is not running");
  }
  
  container.status = "stopped";
  container.uptime = 0;
  containers.set(vmid, container);
  
  return container;
}

// Restart container
export async function restartContainer(vmid: string): Promise<LXContainer> {
  const container = containers.get(vmid);
  if (!container) {
    throw new Error("Container not found");
  }
  
  // Simulate restart
  container.uptime = Date.now();
  containers.set(vmid, container);
  
  return container;
}

// Delete container
export async function deleteContainer(vmid: string): Promise<void> {
  const container = containers.get(vmid);
  if (!container) {
    throw new Error("Container not found");
  }
  
  containers.delete(vmid);
}

// Get available OS templates
export function getTemplates() {
  return defaultTemplates;
}

// Get console URL (simulated - in production this would connect to Proxmox noVNC)
export function getConsoleUrl(vmid: string): string {
  return `/api/lxc/console/${vmid}`;
}
