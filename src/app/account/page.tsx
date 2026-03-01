"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Globe, Monitor, ShoppingCart, LogOut, Network, 
  Palette, Cloud, Mail, Package, Bot, Lock, Shield,
  Database, Rocket, Building2, Image, FileText, Utensils,
  Camera, GraduationCap, Home, Dumbbell, Plane, Music,
  Sparkles, CheckCircle, AlertCircle, RefreshCcw, BarChart3,
  Terminal, Flame, Link2, CreditCard, Settings, Upload, Wallet,
  ArrowUpRight, ArrowDownRight, Send, HelpCircle, Clock, DollarSign, Server,
  Cpu, HardDrive, Activity, XCircle, Check
} from "lucide-react";
import HestiaCPanel from "@/components/HestiaCPanel";
import VPSTerminal from "@/components/vps/Terminal";

interface User {
  id: number;
  name: string;
  email: string;
  plan?: string;
}

interface QuotaInfo {
  plan: string;
  limits: {
    domains: number;
    databases: number;
    diskGB: number;
    dnsRecords: number;
    emailAccounts: number;
    bandwidthGB: number;
  };
  usage: {
    domains: number;
    databases: number;
    diskMB: number;
    dnsRecords: number;
    emailAccounts: number;
  };
}

interface PurchasedItem {
  id: string;
  name: string;
  type: string;
  price: number;
  period: string;
  details?: string;
  purchaseDate: string;
  status: string;
  expirationDate: string;
}

interface VPSContainer {
  id: number;
  vmid: string;
  name: string;
  ostemplate: string;
  cores: number;
  memory: number;
  disk: number;
  ip: string;
  status: "running" | "stopped" | "suspended";
  uptime: number;
  hostname: string;
}

interface VPSTemplate {
  id: string;
  name: string;
  size: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [activeTab, setActiveTab] = useState("domains");
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [containers, setContainers] = useState<VPSContainer[]>([]);
  const [templates, setTemplates] = useState<VPSTemplate[]>([]);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  
  // Debug modal state
  useEffect(() => {
    console.log('Provision modal state:', showProvisionModal);
  }, [showProvisionModal]);
  
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<VPSContainer | null>(null);
  const [provisionForm, setProvisionForm] = useState({
    name: "",
    hostname: "",
    cores: 1,
    memory: 1024,
    disk: 10,
    password: "",
    ostemplate: "ubuntu-22.04",
  });
  const [loadingContainers, setLoadingContainers] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<"healthy" | "failing">("healthy");
  const [resourceUsage, setResourceUsage] = useState({ cpu: 23, ram: 45, storage: 67 });
  const [isResourceDemo, setIsResourceDemo] = useState(true);
  const [sshLogs, setSshLogs] = useState([
    { id: "1", time: "2026-03-01 14:05:23", message: "SSH connection established from 192.168.1.100" },
    { id: "2", time: "2026-03-01 14:04:15", message: "User 'admin' logged in successfully" },
    { id: "3", time: "2026-03-01 14:02:47", message: "Container vps-001 started" },
    { id: "4", time: "2026-03-01 13:58:12", message: "System health check: OK" },
    { id: "5", time: "2026-03-01 13:55:33", message: "Backup completed successfully" },
    { id: "6", time: "2026-03-01 13:45:21", message: "Container vps-002 stopped" },
    { id: "7", time: "2026-03-01 13:30:10", message: "SSH connection closed" },
    { id: "8", time: "2026-03-01 13:15:44", message: "System update available: security patches" },
  ]);
  const [dnsRecords, setDnsRecords] = useState<Array<{id: string, record: string, type: string, value: string, priority: number, ttl: number}>>([]);
  const [databases, setDatabases] = useState<Array<{DB: string, USER: string, HOST: string, TYPE: string, CHARSET: string}>>([]);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  
  // Wallet state
  const [walletBalance, setWalletBalance] = useState(1250.00);
  const [transactions, setTransactions] = useState([
    { id: "1", type: "deposit", amount: 500, description: "Funds added via bank transfer", date: "2026-02-25", status: "completed" },
    { id: "2", type: "payment", amount: -45.99, description: "Domain renewal - example.com", date: "2026-02-24", status: "completed" },
    { id: "3", type: "deposit", amount: 1000, description: "Initial wallet funding", date: "2026-02-20", status: "completed" },
    { id: "4", type: "payment", amount: -199.99, description: "Hosting plan - Starter", date: "2026-02-18", status: "completed" },
    { id: "5", type: "refund", amount: 25.00, description: "Unused service refund", date: "2026-02-15", status: "completed" },
  ]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [inquiryMessage, setInquiryMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(storedUser);
      setTimeout(() => {
        setUser(parsed);
        // Fetch quota info
        fetch(`/api/quota?userId=${parsed.id}`)
          .then(res => res.json())
          .then(data => {
            if (!data.error) setQuota(data);
          })
          .catch(console.error);
        
        // Fetch VPS containers
        setLoadingContainers(true);
        fetch(`/api/lxc?userId=${parsed.id}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setContainers(data);
          })
          .catch(console.error)
          .finally(() => setLoadingContainers(false));
        
        // Fetch templates
        fetch("/api/lxc?action=templates")
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setTemplates(data);
          })
          .catch(console.error);
        
        // Fetch resource usage from HestiaCP
        fetch("/api/hestia/resources")
          .then(res => res.json())
          .then(data => {
            setResourceUsage({ cpu: data.cpu, ram: data.ram, storage: data.storage });
            setSystemStatus(data.status === "failing" ? "failing" : "healthy");
            setIsResourceDemo(data.isDemo || false);
          })
          .catch(console.error);
      }, 0);
    } catch (e) {
      console.error("Failed to parse user", e);
      router.push("/login");
      return;
    }

    const stored = localStorage.getItem("purchased_items");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setPurchasedItems(parsed), 0);
      } catch (e) {
        console.error("Failed to parse items", e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("logout"));
    router.push("/");
  };

  // VPS Container handlers
  const refreshContainers = () => {
    if (!user) return;
    setLoadingContainers(true);
    fetch(`/api/lxc?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setContainers(data);
      })
      .catch(console.error)
      .finally(() => setLoadingContainers(false));
  };

  const handleProvisionContainer = async () => {
    if (!user || !provisionForm.name || !provisionForm.hostname || !provisionForm.password) {
      return;
    }
    
    setActionLoading("provision");
    try {
      const res = await fetch("/api/lxc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...provisionForm,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setShowProvisionModal(false);
        setProvisionForm({
          name: "",
          hostname: "",
          cores: 1,
          memory: 1024,
          disk: 10,
          password: "",
          ostemplate: "ubuntu-22.04",
        });
        refreshContainers();
      }
    } catch (err) {
      console.error("Failed to provision container:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleContainerAction = async (vmid: string, action: "start" | "stop" | "restart") => {
    setActionLoading(vmid);
    try {
      const res = await fetch(`/api/lxc/${vmid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!data.error) {
        refreshContainers();
      }
    } catch (err) {
      console.error(`Failed to ${action} container:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContainer = async (vmid: string) => {
    if (!confirm("Are you sure you want to delete this container? This action cannot be undone.")) {
      return;
    }
    
    setActionLoading(vmid);
    try {
      const res = await fetch(`/api/lxc/${vmid}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.error) {
        refreshContainers();
      }
    } catch (err) {
      console.error("Failed to delete container:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const domainItems = purchasedItems.filter(item => item.type === "domain");
  const hostingItems = purchasedItems.filter(item => item.type === "hosting");

  // Load DNS and Database data when tabs change
  useEffect(() => {
    if (activeTab === "dns" && domainItems.length > 0) {
      // Load DNS for first domain by default
      const firstDomain = domainItems[0]?.name;
      if (firstDomain) {
        setDnsLoading(true);
        fetch(`/api/hestia/dns?domain=${firstDomain}`)
          .then(res => res.json())
          .then(data => {
            setDnsRecords(data.records || []);
          })
          .catch(console.error)
          .finally(() => setDnsLoading(false));
      }
    }
    
    if (activeTab === "database") {
      setDbLoading(true);
      fetch("/api/hestia/databases")
        .then(res => res.json())
        .then(data => {
          setDatabases(data.databases || []);
        })
        .catch(console.error)
        .finally(() => setDbLoading(false));
    }
  }, [activeTab, domainItems]);

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="page-header" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)", color: "white" }}>
        <h1>My Account</h1>
        <p>Welcome back, {user.name || user.email}!</p>
      </section>

      <section className="container" style={{ padding: "2rem 1rem" }}>
        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <Link href="/domains" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><Globe size={28} color="white" /></div>
              <div style={{ fontWeight: "600", color: "var(--text-white)" }}>Register Domain</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Find your perfect domain</div>
            </div>
          </Link>
          <Link href="/hosting" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><Monitor size={28} color="white" /></div>
              <div style={{ fontWeight: "600", color: "var(--text-white)" }}>Add Hosting</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Get more services</div>
            </div>
          </Link>
          <Link href="/cart" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><ShoppingCart size={28} color="white" /></div>
              <div style={{ fontWeight: "600", color: "var(--text-white)" }}>Shopping Cart</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>View your cart</div>
            </div>
          </Link>
          <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><LogOut size={28} color="white" /></div>
              <div style={{ fontWeight: "600", color: "var(--text-white)" }}>Logout</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Sign out</div>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid var(--border)", overflowX: "auto" }}>
          {[
            { id: "domains", label: "Domains", icon: Globe, count: domainItems.length },
            { id: "hosting", label: "Hosting Server", icon: Server, count: 0 },
            { id: "dns", label: "DNS", icon: Network, count: 0 },
            { id: "database", label: "Database", icon: Database, count: 0 },
            { id: "wallet", label: "Wallet", icon: Wallet, count: 0 },
            { id: "builder", label: "Site Builder", icon: Palette, count: 0 },
            { id: "vps", label: "VPS", icon: Cloud, count: 0 },
            { id: "assistant", label: "Illusion", icon: Sparkles, count: 0 },
            { id: "logs", label: "Logs", icon: FileText, count: 0 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.25rem",
                background: activeTab === tab.id ? "var(--primary)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text-light)",
                border: "none",
                borderRadius: "0.5rem 0.5rem 0 0",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              {tab.icon && <tab.icon size={16} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />}
              {tab.label} {tab.count > 0 && <span style={{ opacity: 0.8 }}>({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Resource Usage & System Status - Only show when VPS is configured */}
        {containers.length > 0 ? (
        <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ color: "var(--text-white)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart3 size={20} />
              Resource Usage & System Status
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {isResourceDemo && (
                <span style={{ fontSize: "0.75rem", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                  Demo Mode
                </span>
              )}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                background: systemStatus === "healthy" ? "#065f46" : "#991b1b"
              }}>
                {systemStatus === "healthy" ? <Check size={16} color="white" /> : <XCircle size={16} color="white" />}
                <span style={{ color: "white", fontWeight: "600", fontSize: "0.875rem" }}>
                  System {systemStatus === "healthy" ? "Healthy" : "Overloaded"}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {/* CPU Usage */}
            <div style={{ background: "var(--dark-bg)", padding: "1.25rem", borderRadius: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <Cpu size={20} color="#3b82f6" />
                <span style={{ color: "var(--text-white)", fontWeight: "600" }}>CPU Usage</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "700", color: resourceUsage.cpu > 80 ? "#ef4444" : resourceUsage.cpu > 60 ? "#f59e0b" : "#10b981", marginBottom: "0.5rem" }}>
                {resourceUsage.cpu}%
              </div>
              <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ 
                  height: "100%", 
                  width: `${resourceUsage.cpu}%`,
                  background: resourceUsage.cpu > 80 ? "#ef4444" : resourceUsage.cpu > 60 ? "#f59e0b" : "#10b981",
                  transition: "width 0.3s"
                }} />
              </div>
            </div>

            {/* RAM Usage */}
            <div style={{ background: "var(--dark-bg)", padding: "1.25rem", borderRadius: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <Activity size={20} color="#8b5cf6" />
                <span style={{ color: "var(--text-white)", fontWeight: "600" }}>RAM Usage</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "700", color: resourceUsage.ram > 80 ? "#ef4444" : resourceUsage.ram > 60 ? "#f59e0b" : "#10b981", marginBottom: "0.5rem" }}>
                {resourceUsage.ram}%
              </div>
              <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ 
                  height: "100%", 
                  width: `${resourceUsage.ram}%`,
                  background: resourceUsage.ram > 80 ? "#ef4444" : resourceUsage.ram > 60 ? "#f59e0b" : "#10b981",
                  transition: "width 0.3s"
                }} />
              </div>
            </div>

            {/* Storage Usage */}
            <div style={{ background: "var(--dark-bg)", padding: "1.25rem", borderRadius: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <HardDrive size={20} color="#f59e0b" />
                <span style={{ color: "var(--text-white)", fontWeight: "600" }}>Storage</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "700", color: resourceUsage.storage > 90 ? "#ef4444" : resourceUsage.storage > 75 ? "#f59e0b" : "#10b981", marginBottom: "0.5rem" }}>
                {resourceUsage.storage}%
              </div>
              <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ 
                  height: "100%", 
                  width: `${resourceUsage.storage}%`,
                  background: resourceUsage.storage > 90 ? "#ef4444" : resourceUsage.storage > 75 ? "#f59e0b" : "#10b981",
                  transition: "width 0.3s"
                }} />
              </div>
            </div>
          </div>
          </div>
        ) : (
          <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.5rem", textAlign: "center" }}>
            <Cloud size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
            <p style={{ color: "var(--text-light)", marginBottom: "0.5rem" }}>No VPS Configured</p>
            <p style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>Purchase a hosting plan to provision your first virtual server.</p>
          </div>
        )}

        {/* SSH/Server Logs Tab */}
        {activeTab === "logs" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>Server Logs</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
                View real-time SSH and system logs from your server.
              </p>
              <button 
                onClick={() => setSshLogs([
                  { id: String(Date.now()), time: new Date().toISOString().replace("T", " ").substring(0, 19), message: "Logs refreshed - showing recent activity" },
                  ...sshLogs
                ])}
                style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
              >
                Refresh Logs
              </button>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: "0.5rem", padding: "1rem", maxHeight: "400px", overflowY: "auto", fontFamily: "monospace", fontSize: "0.8rem" }}>
              {sshLogs.map((log) => (
                <div key={log.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #222", display: "flex", gap: "1rem" }}>
                  <span style={{ color: "#6b7280", flexShrink: 0 }}>{log.time}</span>
                  <span style={{ color: "#10b981" }}>$</span>
                  <span style={{ color: "var(--text-light)" }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domains Tab */}
        {activeTab === "domains" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>My Domains</h2>
            {domainItems.length === 0 ? (
              <div style={{ background: "var(--dark-secondary)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}><Globe size={64} color="var(--primary)" /></div>
                <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>No domains yet</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>Register your first domain to get started</p>
                <Link href="/domains" className="domain-action-btn">Search Domains</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {domainItems.map((item, index) => (
                  <div key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-white)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        Registered: {new Date(item.purchaseDate).toLocaleDateString()} • 
                        Expires: {new Date(item.expirationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.75rem", 
                        background: item.status === "active" ? "#065f46" : "#991b1b",
                        color: "white",
                        borderRadius: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: "600"
                      }}>
                        {item.status === "active" ? <><CheckCircle size={14} /> Active</> : <><AlertCircle size={14} /> Expiring</>}
                      </span>
                      <button 
                        style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hosting Server Tab (HestiaCP) */}
        {activeTab === "hosting" && (
          <div>
            <HestiaCPanel />
          </div>
        )}

        {/* DNS Tab */}
        {activeTab === "dns" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>DNS Management</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
                Manage DNS records for your domains. Select a domain from your purchased domains to manage its DNS records.
              </p>
              {domainItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)" }}>
                  <Globe size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                  <p>No domains found. Purchase a domain first to manage DNS records.</p>
                </div>
              ) : (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Select Domain</label>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        setDnsLoading(true);
                        fetch(`/api/hestia/dns?domain=${e.target.value}`)
                          .then(res => res.json())
                          .then(data => {
                            setDnsRecords(data.records || []);
                          })
                          .catch(console.error)
                          .finally(() => setDnsLoading(false));
                      }
                    }}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                  >
                    <option value="">Select a domain...</option>
                    {domainItems.map((item, index) => (
                      <option key={index} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {dnsLoading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)" }}>Loading DNS records...</div>
            ) : dnsRecords.length > 0 ? (
              <div style={{ background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--primary)" }}>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Record</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Type</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Value</th>
                      <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "white" }}>Priority</th>
                      <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "white" }}>TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((record, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1rem", color: "var(--text-white)" }}>{record.record}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ padding: "0.25rem 0.5rem", background: "var(--primary)", color: "white", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "600" }}>
                            {record.type}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-light)", fontFamily: "monospace", fontSize: "0.875rem" }}>{record.value}</td>
                        <td style={{ padding: "1rem", textAlign: "center", color: "var(--text-light)" }}>{record.priority}</td>
                        <td style={{ padding: "1rem", textAlign: "center", color: "var(--text-light)" }}>{record.ttl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)", background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                <Network size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                <p>Select a domain above to view its DNS records.</p>
              </div>
            )}
          </div>
        )}

        {/* Database Tab */}
        {activeTab === "database" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>Database Management</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
                Manage your MySQL/MariaDB databases. You can create, view, and delete databases.
              </p>
              <button 
                onClick={() => {
                  setDbLoading(true);
                  fetch("/api/hestia/databases")
                    .then(res => res.json())
                    .then(data => {
                      setDatabases(data.databases || []);
                    })
                    .catch(console.error)
                    .finally(() => setDbLoading(false));
                }}
                style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
              >
                Refresh Databases
              </button>
            </div>

            {dbLoading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)" }}>Loading databases...</div>
            ) : databases.length > 0 ? (
              <div style={{ background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--primary)" }}>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Database</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>User</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Host</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Type</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Charset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databases.map((db, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1rem", color: "var(--text-white)" }}>{db.DB}</td>
                        <td style={{ padding: "1rem", color: "var(--text-light)" }}>{db.USER}</td>
                        <td style={{ padding: "1rem", color: "var(--text-light)" }}>{db.HOST}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ padding: "0.25rem 0.5rem", background: "#8b5cf6", color: "white", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "600" }}>
                            {db.TYPE}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-light)" }}>{db.CHARSET}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)", background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                <Database size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                <p>No databases found. Click &quot;Refresh Databases&quot; to load your databases.</p>
              </div>
            )}
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>My Wallet</h2>
            
            {/* Balance Card */}
            <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)", padding: "2rem", borderRadius: "1rem", marginBottom: "2rem", color: "white" }}>
              <div style={{ fontSize: "0.875rem", opacity: 0.9, marginBottom: "0.5rem" }}>Available Balance</div>
              <div style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "1rem" }}>
                ${walletBalance.toFixed(2)}
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  style={{ padding: "0.75rem 1.5rem", background: "white", color: "var(--primary)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <ArrowUpRight size={18} /> Withdraw
                </button>
                <button 
                  onClick={() => setShowInquiryModal(true)}
                  style={{ padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid white", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <HelpCircle size={18} /> Make Inquiry
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <ArrowDownRight size={20} color="#10b981" />
                  <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>Total Deposits</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-white)" }}>$1,500.00</div>
              </div>
              <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <ArrowUpRight size={20} color="#ef4444" />
                  <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>Total Payments</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-white)" }}>$244.98</div>
              </div>
              <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <RefreshCcw size={20} color="#f59e0b" />
                  <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>Refunds</span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-white)" }}>$25.00</div>
              </div>
            </div>

            {/* Transaction History */}
            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>Transaction History</h3>
            <div style={{ background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--primary)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Date</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Description</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Type</th>
                    <th style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: "white" }}>Amount</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "white" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem", color: "var(--text-light)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Clock size={14} />
                          {tx.date}
                        </div>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--text-white)" }}>{tx.description}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "1rem", 
                          fontSize: "0.75rem", 
                          fontWeight: "600",
                          background: tx.type === "deposit" ? "#065f46" : tx.type === "payment" ? "#991b1b" : "#1e3a8a",
                          color: "white",
                          textTransform: "capitalize"
                        }}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: tx.amount >= 0 ? "#10b981" : "#ef4444" }}>
                        {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.875rem" }}>
                          <CheckCircle size={14} /> {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
              <div style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: "rgba(0,0,0,0.7)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                zIndex: 1000
              }}>
                <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", maxWidth: "450px", width: "90%" }}>
                  <h3 style={{ marginBottom: "1.5rem", color: "var(--text-white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ArrowUpRight size={24} color="var(--primary)" /> Withdraw Funds
                  </h3>
                  
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ background: "var(--dark)", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Available Balance</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-white)" }}>${walletBalance.toFixed(2)}</div>
                    </div>
                    
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Amount</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}>$</span>
                      <input 
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        max={walletBalance}
                        style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Withdraw Method</label>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <button 
                        onClick={() => setWithdrawMethod("bank")}
                        style={{ 
                          flex: "1",
                          padding: "1rem", 
                          background: withdrawMethod === "bank" ? "var(--primary)" : "var(--dark)", 
                          color: "white", 
                          border: `2px solid ${withdrawMethod === "bank" ? "var(--primary)" : "var(--border)"}`,
                          borderRadius: "0.5rem", 
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <CreditCard size={24} />
                        <span style={{ fontWeight: "600" }}>Bank Transfer</span>
                      </button>
                      <button 
                        onClick={() => setWithdrawMethod("paypal")}
                        style={{ 
                          flex: "1",
                          padding: "1rem", 
                          background: withdrawMethod === "paypal" ? "var(--primary)" : "var(--dark)", 
                          color: "white", 
                          border: `2px solid ${withdrawMethod === "paypal" ? "var(--primary)" : "var(--border)"}`,
                          borderRadius: "0.5rem", 
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <Send size={24} />
                        <span style={{ fontWeight: "600" }}>PayPal</span>
                      </button>
                      <button 
                        onClick={() => setWithdrawMethod("crypto")}
                        style={{ 
                          flex: "1",
                          padding: "1rem", 
                          background: withdrawMethod === "crypto" ? "var(--primary)" : "var(--dark)", 
                          color: "white", 
                          border: `2px solid ${withdrawMethod === "crypto" ? "var(--primary)" : "var(--border)"}`,
                          borderRadius: "0.5rem", 
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <DollarSign size={24} />
                        <span style={{ fontWeight: "600" }}>Crypto</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(""); }}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--border)", color: "var(--text-white)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => { alert("Withdrawal request submitted! Funds will arrive in 3-5 business days."); setShowWithdrawModal(false); setWithdrawAmount(""); }}
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletBalance}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", opacity: (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletBalance) ? 0.5 : 1 }}
                    >
                      Request Withdrawal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inquiry Modal */}
            {showInquiryModal && (
              <div style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: "rgba(0,0,0,0.7)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                zIndex: 1000
              }}>
                <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", maxWidth: "500px", width: "90%" }}>
                  <h3 style={{ marginBottom: "1.5rem", color: "var(--text-white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HelpCircle size={24} color="var(--primary)" /> Make an Inquiry
                  </h3>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Inquiry Type</label>
                    <select 
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    >
                      <option>General Question</option>
                      <option>Payment Issue</option>
                      <option>Transaction Dispute</option>
                      <option>Account Balance</option>
                      <option>Refund Request</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Your Message</label>
                    <textarea 
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Describe your question or concern..."
                      rows={5}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white", resize: "vertical" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => { setShowInquiryModal(false); setInquiryMessage(""); }}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--border)", color: "var(--text-white)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => { alert("Your inquiry has been submitted. Our team will respond within 24-48 hours."); setShowInquiryModal(false); setInquiryMessage(""); }}
                      disabled={!inquiryMessage.trim()}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", opacity: !inquiryMessage.trim() ? 0.5 : 1 }}
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VPS Provision Modal */}
            {showProvisionModal && (
              <div style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: "rgba(0,0,0,0.8)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                zIndex: 9999
              }}>
                <div style={{ background: "#1a1a2e", padding: "2rem", borderRadius: "1rem", border: "2px solid var(--primary)", maxWidth: "500px", width: "90%", position: "relative" }}>
                  <button 
                    onClick={() => setShowProvisionModal(false)}
                    style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.5rem" }}
                  >
                    ×
                  </button>
                  <h3 style={{ marginBottom: "1.5rem", color: "var(--text-white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Cloud size={24} color="var(--primary)" /> Provision New VPS
                  </h3>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Container Name</label>
                    <input 
                      type="text"
                      value={provisionForm.name}
                      onChange={(e) => setProvisionForm({...provisionForm, name: e.target.value})}
                      placeholder="my-container"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Hostname</label>
                    <input 
                      type="text"
                      value={provisionForm.hostname}
                      onChange={(e) => setProvisionForm({...provisionForm, hostname: e.target.value})}
                      placeholder="server.example.com"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>OS Template</label>
                    <select 
                      value={provisionForm.ostemplate}
                      onChange={(e) => setProvisionForm({...provisionForm, ostemplate: e.target.value})}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.size})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>vCPUs</label>
                      <select 
                        value={provisionForm.cores}
                        onChange={(e) => setProvisionForm({...provisionForm, cores: parseInt(e.target.value)})}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                      >
                        {[1,2,4,8].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>RAM (MB)</label>
                      <select 
                        value={provisionForm.memory}
                        onChange={(e) => setProvisionForm({...provisionForm, memory: parseInt(e.target.value)})}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                      >
                        {[512, 1024, 2048, 4096, 8192].map(m => <option key={m} value={m}>{m}MB</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Disk (GB)</label>
                      <select 
                        value={provisionForm.disk}
                        onChange={(e) => setProvisionForm({...provisionForm, disk: parseInt(e.target.value)})}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                      >
                        {[5, 10, 20, 40, 80, 160].map(d => <option key={d} value={d}>{d}GB</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Root Password</label>
                    <input 
                      type="password"
                      value={provisionForm.password}
                      onChange={(e) => setProvisionForm({...provisionForm, password: e.target.value})}
                      placeholder="Enter root password"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => setShowProvisionModal(false)}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--border)", color: "var(--text-white)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProvisionContainer}
                      disabled={actionLoading === "provision" || !provisionForm.name || !provisionForm.hostname || !provisionForm.password}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", opacity: (actionLoading === "provision" || !provisionForm.name || !provisionForm.hostname || !provisionForm.password) ? 0.5 : 1 }}
                    >
                      {actionLoading === "provision" ? "Provisioning..." : "Provision VPS"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Terminal Modal */}
            {showTerminalModal && selectedContainer && (
              <div style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: "rgba(0,0,0,0.9)", 
                display: "flex", 
                flexDirection: "column",
                zIndex: 1000
              }}>
                <div style={{ padding: "1rem", background: "#161b22", borderBottom: "1px solid #30363d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Terminal size={20} color="var(--primary)" />
                    <span style={{ color: "#c9d1d9", fontWeight: 600 }}>{selectedContainer.hostname} ({selectedContainer.ip})</span>
                  </div>
                  <button
                    onClick={() => setShowTerminalModal(false)}
                    style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer", padding: "0.5rem", fontSize: "1.25rem" }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <VPSTerminal containerId={selectedContainer.vmid} onClose={() => setShowTerminalModal(false)} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Site Builder Tab */}
        {activeTab === "builder" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>Site Builder</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Palette size={28} color="white" /></div>
                <div>
                  <h3 style={{ color: "var(--text-white)", marginBottom: "0.25rem" }}>Create Your Website</h3>
                  <p style={{ color: "var(--text-light)", margin: 0 }}>Choose from 50+ professionally designed templates or start from scratch</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                  Browse Templates
                </button>
                <button style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "var(--text-white)", border: "2px solid var(--border)", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                  Start from Scratch
                </button>
              </div>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>Popular Templates</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "Business", icon: Building2 },
                { name: "Portfolio", icon: Image },
                { name: "Blog", icon: FileText },
                { name: "E-Commerce", icon: ShoppingCart },
                { name: "Restaurant", icon: Utensils },
                { name: "Photography", icon: Camera },
                { name: "Medical", icon: Building2 },
                { name: "Education", icon: GraduationCap },
                { name: "Real Estate", icon: Home },
                { name: "Fitness", icon: Dumbbell },
                { name: "Travel", icon: Plane },
                { name: "Music", icon: Music },
              ].map((template, index) => (
                <div key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}><template.icon size={48} color="var(--primary)" /></div>
                  <div style={{ fontWeight: "600", color: "var(--text-white)" }}>{template.name}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-light)" }}>+ 38 more templates available</p>
          </div>
        )}

        {/* VPS Tab */}
        {activeTab === "vps" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>VPS Management</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Cloud size={28} color="white" /></div>
                <div>
                  <h3 style={{ color: "var(--text-white)", marginBottom: "0.25rem" }}>Virtual Private Server</h3>
                  <p style={{ color: "var(--text-light)", margin: 0 }}>Full root access, scalable resources, and complete control</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Opening provision modal');
                  setShowProvisionModal(true);
                }}
                type="button"
                style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600", display: "inline-block", position: "relative", zIndex: 1 }}
              >
                Provision New VPS
              </button>
            </div>

            {/* My Containers */}
            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>My Containers</h3>
            {loadingContainers ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)" }}>Loading containers...</div>
            ) : containers.length === 0 ? (
              <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                <Cloud size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
                <p style={{ color: "var(--text-light)" }}>No containers yet. Provision your first VPS to get started.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                {containers.map((container) => (
                  <div key={container.vmid} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-white)", fontSize: "1.125rem" }}>{container.hostname}</span>
                          <span style={{ 
                            padding: "0.125rem 0.5rem", 
                            borderRadius: "1rem", 
                            fontSize: "0.75rem", 
                            fontWeight: 600,
                            background: container.status === "running" ? "#065f46" : "#374151",
                            color: container.status === "running" ? "#34d399" : "#9ca3af",
                          }}>
                            {container.status}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                          <span>VMID: {container.vmid}</span> • 
                          <span> IP: {container.ip}</span> •
                          <span> {container.cores} vCPU / {container.memory}MB RAM / {container.disk}GB SSD</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {container.status === "running" ? (
                          <>
                            <button 
                              onClick={() => handleContainerAction(container.vmid, "stop")}
                              disabled={actionLoading === container.vmid}
                              style={{ padding: "0.5rem 1rem", background: "#374151", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}
                            >
                              Stop
                            </button>
                            <button 
                              onClick={() => handleContainerAction(container.vmid, "restart")}
                              disabled={actionLoading === container.vmid}
                              style={{ padding: "0.5rem 1rem", background: "#374151", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}
                            >
                              Restart
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleContainerAction(container.vmid, "start")}
                            disabled={actionLoading === container.vmid}
                            style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}
                          >
                            Start
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedContainer(container);
                            setShowTerminalModal(true);
                          }}
                          disabled={container.status !== "running"}
                          style={{ padding: "0.5rem 1rem", background: "#7c3aed", color: "white", border: "none", borderRadius: "0.5rem", cursor: container.status === "running" ? "pointer" : "not-allowed", fontSize: "0.875rem", opacity: container.status === "running" ? 1 : 0.5 }}
                        >
                          Console
                        </button>
                        <button 
                          onClick={() => handleDeleteContainer(container.vmid)}
                          disabled={actionLoading === container.vmid}
                          style={{ padding: "0.5rem 1rem", background: "#dc2626", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <button onClick={refreshContainers} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><RefreshCcw size={24} color="white" /></div>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.25rem" }}>Refresh</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Update container list</div>
                </div>
              </button>
              <button style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BarChart3 size={24} color="white" /></div>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.25rem" }}>Statistics</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>CPU, RAM, Bandwidth</div>
                </div>
              </button>
              <button style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Database size={24} color="white" /></div>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.25rem" }}>Snapshots</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Backup your server</div>
                </div>
              </button>
              <button style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Flame size={24} color="white" /></div>
                <div>
                  <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.25rem" }}>Firewall</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Configure rules</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* More Tab */}
        {activeTab === "more" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>More Services</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {[
                { name: "SSL Certificates", icon: Lock, desc: "Secure your website with premium SSL" },
                { name: "Domain Privacy", icon: Shield, desc: "Protect your personal information" },
                { name: "Email Marketing", icon: Mail, desc: "Reach your customers effectively" },
                { name: "Website Backup", icon: Database, desc: "Automated daily backups" },
                { name: "CDN Services", icon: Rocket, desc: "Global content delivery network" },
                { name: "DDoS Protection", icon: Shield, desc: "Advanced security for your site" },
              ].map((service, index) => (
                <div key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>{service.icon && <service.icon size={28} color="white" />}</div>
                  <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.5rem" }}>{service.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "1rem" }}>{service.desc}</div>
                  <button style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>Learn More</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Illusion Assistant Tab */}
        {activeTab === "assistant" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>Illusion Assistant</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "1.5rem", textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}><Sparkles size={40} color="white" /></div>
              <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem", fontSize: "1.5rem" }}>Your AI-Powered Hosting Assistant</h3>
              <p style={{ color: "var(--text-light)", marginBottom: "1.5rem", maxWidth: "500px", margin: "0 auto 1.5rem" }}>Get instant help with domain setup, DNS configuration, troubleshooting, and more. Our AI assistant is available 24/7 to help you.</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>Start Chat</button>
                <button style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "var(--text-white)", border: "2px solid var(--border)", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>View Help Articles</button>
              </div>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>Quick Help Topics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "How to connect domain", icon: Link2 },
                { name: "Set up email", icon: Mail },
                { name: "Install SSL certificate", icon: Lock },
                { name: "Transfer domain", icon: Upload },
                { name: "Configure DNS", icon: Settings },
                { name: "Billing questions", icon: CreditCard },
              ].map((topic, index) => (
                <button key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><topic.icon size={20} color="white" /></div>
                  <span style={{ fontWeight: "600", color: "var(--text-white)" }}>{topic.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
