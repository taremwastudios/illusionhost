"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
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
  const [isEditingDNS, setIsEditingDNS] = useState(false);
  const [newDNSRecord, setNewDNSRecord] = useState<Partial<DNSRecord>>({ type: "A", ttl: 3600 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(storedUser);
      setTimeout(() => setUser(parsed), 0);
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
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌐</div>
              <div style={{ fontWeight: "600", color: "var(--dark)" }}>Register Domain</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Find your perfect domain</div>
            </div>
          </Link>
          <Link href="/hosting" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🖥️</div>
              <div style={{ fontWeight: "600", color: "var(--dark)" }}>Add Hosting</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Get more services</div>
            </div>
          </Link>
          <Link href="/cart" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛒</div>
              <div style={{ fontWeight: "600", color: "var(--dark)" }}>Shopping Cart</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>View your cart</div>
            </div>
          </Link>
          <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center", transition: "transform 0.2s" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚪</div>
              <div style={{ fontWeight: "600", color: "var(--dark)" }}>Logout</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Sign out</div>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid #eee", overflowX: "auto" }}>
          {[
            { id: "domains", label: "🌐 Domains", count: domainItems.length },
            { id: "hosting", label: "🖥️ Hosting", count: hostingItems.length },
            { id: "dns", label: "🌍 DNS", count: dnsRecords.length },
            { id: "builder", label: "🎨 Site Builder", count: 0 },
            { id: "vps", label: "☁️ VPS", count: 0 },
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
              {tab.label} {tab.count > 0 && <span style={{ opacity: 0.8 }}>({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Domains Tab */}
        {activeTab === "domains" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--dark)" }}>My Domains</h2>
            {domainItems.length === 0 ? (
              <div style={{ background: "white", padding: "3rem", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌐</div>
                <h3 style={{ color: "var(--dark)", marginBottom: "0.5rem" }}>No domains yet</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>Register your first domain to get started</p>
                <Link href="/domains" className="domain-action-btn">Search Domains</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {domainItems.map((item, index) => (
                  <div key={index} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        Registered: {new Date(item.purchaseDate).toLocaleDateString()} • 
                        Expires: {new Date(item.expirationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.75rem", 
                        background: item.status === "active" ? "#d1fae5" : "#fee2e2",
                        color: item.status === "active" ? "#065f46" : "#991b1b",
                        borderRadius: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: "600"
                      }}>
                        {item.status === "active" ? "✓ Active" : "⚠ Expiring"}
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

        {/* Hosting Tab */}
        {activeTab === "hosting" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--dark)" }}>My Hosting Plans</h2>
            {hostingItems.length === 0 ? (
              <div style={{ background: "white", padding: "3rem", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖥️</div>
                <h3 style={{ color: "var(--dark)", marginBottom: "0.5rem" }}>No hosting plans yet</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>Get hosting to power your websites</p>
                <Link href="/hosting" className="domain-action-btn">View Hosting Plans</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {hostingItems.map((item, index) => (
                  <div key={index} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {item.details} • ${item.price}/{item.period}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.75rem", 
                        background: "#d1fae5",
                        color: "#065f46",
                        borderRadius: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: "600"
                      }}>
                        ✓ Active
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

        {/* DNS Tab */}
        {activeTab === "dns" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ color: "var(--dark)", margin: 0 }}>DNS Management</h2>
              <button 
                onClick={() => setIsEditingDNS(true)}
                style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
              >
                + Add Record
              </button>
            </div>

            {dnsRecords.length === 0 ? (
              <div style={{ background: "white", padding: "3rem", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
                <h3 style={{ color: "var(--dark)", marginBottom: "0.5rem" }}>No DNS records</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>Add DNS records to point your domain to your website or services</p>
                <button 
                  onClick={() => setIsEditingDNS(true)}
                  className="domain-action-btn"
                >
                  Add First Record
                </button>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "2px solid #eee" }}>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Type</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Name</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Value</th>
                      <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>TTL</th>
                      <th style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: "var(--dark)" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((record) => (
                      <tr key={record.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ 
                            padding: "0.25rem 0.5rem", 
                            background: record.type === "A" ? "#dbeafe" : record.type === "MX" ? "#fef3c7" : "#e0e7ff",
                            color: "var(--dark)",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "700"
                          }}>
                            {record.type}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontFamily: "monospace", color: "var(--dark)" }}>{record.name}</td>
                        <td style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.875rem", color: "var(--text-light)" }}>{record.value}</td>
                        <td style={{ padding: "1rem", color: "var(--text-light)" }}>{record.ttl}s</td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button 
                            onClick={() => deleteDNSRecord(record.id)}
                            style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", cursor: "pointer" }}
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
                background: "rgba(0,0,0,0.5)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                zIndex: 1000
              }}>
                <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", maxWidth: "500px", width: "90%" }}>
                  <h3 style={{ marginBottom: "1.5rem", color: "var(--dark)" }}>Add DNS Record</h3>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--dark)" }}>Record Type</label>
                    <select 
                      value={newDNSRecord.type}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, type: e.target.value as DNSRecord["type"] })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd", fontSize: "1rem" }}
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
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--dark)" }}>Name</label>
                    <input 
                      type="text"
                      value={newDNSRecord.name || ""}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, name: e.target.value })}
                      placeholder="@ or subdomain"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd", fontSize: "1rem" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--dark)" }}>Value</label>
                    <input 
                      type="text"
                      value={newDNSRecord.value || ""}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, value: e.target.value })}
                      placeholder="IP address or hostname"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd", fontSize: "1rem" }}
                    />
                  </div>

                  {newDNSRecord.type === "MX" && (
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--dark)" }}>Priority</label>
                      <input 
                        type="number"
                        value={newDNSRecord.priority || 10}
                        onChange={(e) => setNewDNSRecord({ ...newDNSRecord, priority: parseInt(e.target.value) })}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd", fontSize: "1rem" }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--dark)" }}>TTL</label>
                    <select 
                      value={newDNSRecord.ttl}
                      onChange={(e) => setNewDNSRecord({ ...newDNSRecord, ttl: parseInt(e.target.value) })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #ddd", fontSize: "1rem" }}
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
                      style={{ padding: "0.75rem 1.5rem", background: "#e5e7eb", color: "var(--dark)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}
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

        {/* Site Builder Tab */}
        {activeTab === "builder" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--dark)" }}>Site Builder</h2>
            <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "3rem" }}>🎨</div>
                <div>
                  <h3 style={{ color: "var(--dark)", marginBottom: "0.25rem" }}>Create Your Website</h3>
                  <p style={{ color: "var(--text-light)", margin: 0 }}>Choose from 50+ professionally designed templates or start from scratch</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                  Browse Templates
                </button>
                <button style={{ padding: "0.75rem 1.5rem", background: "white", color: "var(--dark)", border: "2px solid #ddd", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                  Start from Scratch
                </button>
              </div>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>Popular Templates</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "Business", emoji: "🏢" },
                { name: "Portfolio", emoji: "🖼️" },
                { name: "Blog", emoji: "📝" },
                { name: "E-Commerce", emoji: "🛒" },
                { name: "Restaurant", emoji: "🍽️" },
                { name: "Photography", emoji: "📷" },
                { name: "Medical", emoji: "🏥" },
                { name: "Education", emoji: "🎓" },
                { name: "Real Estate", emoji: "🏠" },
                { name: "Fitness", emoji: "💪" },
                { name: "Travel", emoji: "✈️" },
                { name: "Music", emoji: "🎵" },
              ].map((template, index) => (
                <div key={index} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{template.emoji}</div>
                  <div style={{ fontWeight: "600", color: "var(--dark)" }}>{template.name}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-light)" }}>+ 38 more templates available</p>
          </div>
        )}

        {/* VPS Tab */}
        {activeTab === "vps" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem", color: "var(--dark)" }}>VPS Management</h2>
            <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "3rem" }}>☁️</div>
                <div>
                  <h3 style={{ color: "var(--dark)", marginBottom: "0.25rem" }}>Virtual Private Server</h3>
                  <p style={{ color: "var(--text-light)", margin: 0 }}>Full root access, scalable resources, and complete control</p>
                </div>
              </div>
              <button style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                Provision New VPS
              </button>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>VPS Plans</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { name: "VPS Starter", cpu: "1 vCPU", ram: "1GB RAM", storage: "25GB SSD", price: 5 },
                { name: "VPS Professional", cpu: "2 vCPU", ram: "4GB RAM", storage: "80GB SSD", price: 20 },
                { name: "VPS Business", cpu: "4 vCPU", ram: "8GB RAM", storage: "160GB SSD", price: 40 },
              ].map((plan, index) => (
                <div key={index} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>{plan.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "1rem" }}>
                    <div>{plan.cpu}</div>
                    <div>{plan.ram}</div>
                    <div>{plan.storage}</div>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--primary)" }}>${plan.price}/mo</div>
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { name: "🔄 Reboot Server", desc: "Restart your VPS" },
                { name: "📊 View Statistics", desc: "CPU, RAM, Bandwidth" },
                { name: "🖥️ Console Access", desc: "Web-based terminal" },
                { name: "💾 Snapshots", desc: "Backup your server" },
                { name: "🔥 Firewall", desc: "Configure firewall rules" },
                { name: "📦 Backups", desc: "Manage backups", },
              ].map((action, index) => (
                <button key={index} style={{ background: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", border: "none", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontWeight: "600", color: "var(--dark)", marginBottom: "0.25rem" }}>{action.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
