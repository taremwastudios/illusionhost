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
  ArrowUpRight, ArrowDownRight, Send, HelpCircle, Clock, DollarSign, Server
} from "lucide-react";
import HestiaCPanel from "@/components/HestiaCPanel";

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

interface DNSRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  priority?: number;
  ttl: number;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [activeTab, setActiveTab] = useState("domains");
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [isEditingDNS, setIsEditingDNS] = useState(false);
  const [newDNSRecord, setNewDNSRecord] = useState<Partial<DNSRecord>>({ type: "A", ttl: 3600 });
  
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

    // Load DNS records
    const storedDNS = localStorage.getItem("dns_records");
    if (storedDNS) {
      try {
        const parsed = JSON.parse(storedDNS);
        setTimeout(() => setDnsRecords(parsed), 0);
      } catch (e) {
        console.error("Failed to parse DNS records", e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("logout"));
    router.push("/");
  };

  const saveDNSRecord = () => {
    if (!newDNSRecord.name || !newDNSRecord.value) return;
    
    const record: DNSRecord = {
      id: `dns-${Date.now()}`,
      type: newDNSRecord.type as DNSRecord["type"],
      name: newDNSRecord.name,
      value: newDNSRecord.value,
      priority: newDNSRecord.priority,
      ttl: newDNSRecord.ttl || 3600,
    };
    
    const updated = [...dnsRecords, record];
    setDnsRecords(updated);
    localStorage.setItem("dns_records", JSON.stringify(updated));
    setNewDNSRecord({ type: "A", ttl: 3600 });
    setIsEditingDNS(false);
  };

  const deleteDNSRecord = (id: string) => {
    const updated = dnsRecords.filter(r => r.id !== id);
    setDnsRecords(updated);
    localStorage.setItem("dns_records", JSON.stringify(updated));
  };

  const domainItems = purchasedItems.filter(item => item.type === "domain");
  const hostingItems = purchasedItems.filter(item => item.type === "hosting");

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
            { id: "hostingPlans", label: "Hosting Plans", icon: Monitor, count: hostingItems.length },
            { id: "dns", label: "DNS", icon: Network, count: dnsRecords.length },
            { id: "database", label: "Database", icon: Database, count: 0 },
            { id: "wallet", label: "Wallet", icon: Wallet, count: 0 },
            { id: "builder", label: "Site Builder", icon: Palette, count: 0 },
            { id: "vps", label: "VPS", icon: Cloud, count: 0 },
            { id: "more", label: "More", icon: Package, count: 0 },
            { id: "assistant", label: "Illusion Assistant", icon: Sparkles, count: 0 },
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

        {/* Quota Display */}
        {quota && (
          <div style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "var(--text-white)", margin: 0 }}>
                <BarChart3 size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Resource Usage ({quota.plan.charAt(0).toUpperCase() + quota.plan.slice(1)} Plan)
              </h3>
              <Link href="/hosting" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.875rem" }}>Upgrade Plan</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Domains", used: quota.usage.domains, limit: quota.limits.domains, icon: Globe },
                { label: "Databases", used: quota.usage.databases, limit: quota.limits.databases, icon: Database },
                { label: "Disk Space", used: Math.round(quota.usage.diskMB / 1024), limit: quota.limits.diskGB, unit: "GB", icon: Server },
                { label: "DNS Records", used: quota.usage.dnsRecords, limit: quota.limits.dnsRecords, icon: Network },
                { label: "Email Accounts", used: quota.usage.emailAccounts, limit: quota.limits.emailAccounts, icon: Mail },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "var(--dark-bg)", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
                  <item.icon size={20} style={{ color: "var(--primary)", marginBottom: "0.5rem" }} />
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-white)" }}>
                    {item.used}/{item.limit}{item.unit || ""}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{item.label}</div>
                  <div style={{ 
                    height: "4px", 
                    background: "var(--border)", 
                    borderRadius: "2px", 
                    marginTop: "0.5rem",
                    overflow: "hidden" 
                  }}>
                    <div style={{ 
                      height: "100%", 
                      width: `${Math.min(100, (item.used / item.limit) * 100)}%`,
                      background: item.used >= item.limit ? "#ef4444" : "var(--primary)",
                      transition: "width 0.3s"
                    }} />
                  </div>
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
                        onClick={() => setActiveTab("dns")}
                        style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                      >
                        Manage DNS
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

        {/* Hosting Plans Tab */}
        {activeTab === "hostingPlans" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>My Hosting Plans</h2>
            {hostingItems.length === 0 ? (
              <div style={{ background: "var(--dark-secondary)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}><Monitor size={64} color="var(--primary)" /></div>
                <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>No hosting plans yet</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>Get hosting to power your websites</p>
                <Link href="/hosting" className="domain-action-btn">View Hosting Plans</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {hostingItems.map((item, index) => (
                  <div key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-white)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {item.details} • ${item.price}/{item.period}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.75rem", 
                        background: "#065f46",
                        color: "white",
                        borderRadius: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: "600"
                      }}>
                        <><CheckCircle size={14} /> Active</>
                      </span>
                      <button style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "dns" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ color: "var(--text-white)", margin: 0 }}>DNS Management</h2>
              <button 
                onClick={() => setIsEditingDNS(true)}
                style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
              >
                + Add Record
              </button>
            </div>

            {dnsRecords.length === 0 ? (
              <div style={{ background: "var(--dark-secondary)", padding: "3rem", borderRadius: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}><Network size={64} color="var(--primary)" /></div>
                <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>No DNS records</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>Add DNS records to point your domain to your website or services</p>
                <button 
                  onClick={() => setIsEditingDNS(true)}
                  className="domain-action-btn"
                >
                  Add First Record
                </button>
              </div>
            ) : (
              <div style={{ background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--primary)", borderBottom: "2px solid var(--border)" }}>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Type</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Name</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>Value</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "white" }}>TTL</th>
                      <th style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: "white" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((record) => (
                      <tr key={record.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ 
                            padding: "0.25rem 0.5rem", 
                            background: record.type === "A" ? "#1e3a8a" : record.type === "MX" ? "#854d0e" : "#3730a3",
                            color: "white",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "700"
                          }}>
                            {record.type}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontFamily: "monospace", color: "var(--text-white)" }}>{record.name}</td>
                        <td style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.875rem", color: "var(--text-light)" }}>{record.value}</td>
                        <td style={{ padding: "1rem", color: "var(--text-light)" }}>{record.ttl}s</td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button 
                            onClick={() => deleteDNSRecord(record.id)}
                            style={{ background: "#991b1b", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add DNS Record Modal */}
            {isEditingDNS && (
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
                  <h3 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>Add DNS Record</h3>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Record Type</label>
                    <select 
                      value={newDNSRecord.type}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, type: e.target.value as DNSRecord["type"] })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    >
                      <option value="A">A</option>
                      <option value="AAAA">AAAA</option>
                      <option value="CNAME">CNAME</option>
                      <option value="MX">MX</option>
                      <option value="TXT">TXT</option>
                      <option value="NS">NS</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Name</label>
                    <input 
                      type="text"
                      value={newDNSRecord.name || ""}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, name: e.target.value })}
                      placeholder="@ or subdomain"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Value</label>
                    <input 
                      type="text"
                      value={newDNSRecord.value || ""}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, value: e.target.value })}
                      placeholder="IP address or hostname"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    />
                  </div>

                  {newDNSRecord.type === "MX" && (
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>Priority</label>
                      <input 
                        type="number"
                        value={newDNSRecord.priority || 10}
                        onChange={(e) => setNewDNSRecord({ ...newDNSRecord, priority: parseInt(e.target.value) })}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>TTL</label>
                    <select 
                      value={newDNSRecord.ttl}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, ttl: parseInt(e.target.value) })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "1rem", background: "var(--dark)", color: "white" }}
                    >
                      <option value={300}>5 minutes</option>
                      <option value={900}>15 minutes</option>
                      <option value={1800}>30 minutes</option>
                      <option value={3600}>1 hour</option>
                      <option value={7200}>2 hours</option>
                      <option value={86400}>24 hours</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => setIsEditingDNS(false)}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--border)", color: "var(--text-white)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveDNSRecord}
                      style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
                    >
                      Save Record
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Database Tab */}
        {activeTab === "database" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--text-white)" }}>My Databases</h2>
            <div style={{ background: "var(--dark-secondary)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Server size={28} color="white" /></div>
                <div>
                  <h3 style={{ color: "var(--text-white)", marginBottom: "0.25rem" }}>Managed Databases</h3>
                  <p style={{ color: "var(--text-light)", margin: 0 }}>MySQL, PostgreSQL, MongoDB and more</p>
                </div>
              </div>
              <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                Create New Database
              </button>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>Available Database Types</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {[
                { name: "MySQL", desc: "Popular open-source relational database", icon: Database },
                { name: "PostgreSQL", desc: "Advanced object-relational database", icon: Database },
                { name: "MongoDB", desc: "NoSQL document database", icon: Database },
                { name: "Redis", desc: "In-memory data structure store", icon: Database },
              ].map((db, index) => (
                <div key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <db.icon size={20} color="var(--primary)" />
                    <div style={{ fontWeight: "600", color: "var(--text-white)" }}>{db.name}</div>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "1rem" }}>{db.desc}</div>
                  <button style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" }}>Provision</button>
                </div>
              ))}
            </div>
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
              <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                Provision New VPS
              </button>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>VPS Plans</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { name: "VPS Starter", cpu: "1 vCPU", ram: "1GB RAM", storage: "25GB SSD", price: 5 },
                { name: "VPS Professional", cpu: "2 vCPU", ram: "4GB RAM", storage: "80GB SSD", price: 20 },
                { name: "VPS Business", cpu: "4 vCPU", ram: "8GB RAM", storage: "160GB SSD", price: 40 },
              ].map((plan, index) => (
                <div key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.5rem" }}>{plan.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "1rem" }}>
                    <div>{plan.cpu}</div>
                    <div>{plan.ram}</div>
                    <div>{plan.storage}</div>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--primary)" }}>${plan.price}/mo</div>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--text-white)" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "Reboot Server", icon: RefreshCcw, desc: "Restart your VPS" },
                { name: "View Statistics", icon: BarChart3, desc: "CPU, RAM, Bandwidth" },
                { name: "Console Access", icon: Terminal, desc: "Web-based terminal" },
                { name: "Snapshots", icon: Database, desc: "Backup your server" },
                { name: "Firewall", icon: Flame, desc: "Configure firewall rules" },
                { name: "Backups", icon: Package, desc: "Manage backups", },
              ].map((action, index) => (
                <button key={index} style={{ background: "var(--dark-secondary)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><action.icon size={24} color="white" /></div>
                  <div>
                    <div style={{ fontWeight: "600", color: "var(--text-white)", marginBottom: "0.25rem" }}>{action.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>{action.desc}</div>
                  </div>
                </button>
              ))}
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
