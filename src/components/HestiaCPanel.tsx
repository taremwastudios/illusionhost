"use client";

import { useState, useEffect } from "react";
import { Server, Globe, Database, RefreshCw, AlertCircle, CheckCircle, ExternalLink, Plus, Trash2, Cpu, HardDrive, Activity } from "lucide-react";

interface HestiaStatus {
  available: boolean;
  message: string;
}

interface WebDomain {
  DOMAIN: string;
  IP: string;
  SSL: string;
  LETSENCRYPT: string;
  U_DISK: number;
}

interface Database {
  DB: string;
  USER: string;
  TYPE: string;
  U_DISK: number;
}

interface DNSRecord {
  id: string;
  record: string;
  type: string;
  value: string;
  priority: number;
  ttl: number;
}

interface SystemInfo {
  hostname: string;
  os: string;
  uptime: number;
  load: number[];
  memory: { total: number; used: number; free: number };
  disk: { total: number; used: number; free: number };
}

export default function HestiaCPanel() {
  const [status, setStatus] = useState<HestiaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"domains" | "databases" | "dns" | "system">("domains");
  const [domains, setDomains] = useState<WebDomain[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (status?.available && activeTab === "domains") {
      loadDomains();
    }
    if (status?.available && activeTab === "databases") {
      loadDatabases();
    }
    if (status?.available && activeTab === "dns" && selectedDomain) {
      loadDNSRecords();
    }
    if (status?.available && activeTab === "system") {
      loadSystemInfo();
    }
  }, [status, activeTab, selectedDomain]);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/hestia/status");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Status check error:", error);
      setStatus({ available: false, message: "Failed to connect" });
    } finally {
      setLoading(false);
    }
  };

  const loadDomains = async () => {
    try {
      const res = await fetch("/api/hestia/domains");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setDomains(data.domains || []);
    } catch (error) {
      console.error("Failed to load domains:", error);
      setDomains([]);
    }
  };

  const loadDatabases = async () => {
    try {
      const res = await fetch("/api/hestia/databases");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setDatabases(data.databases || []);
    } catch (error) {
      console.error("Failed to load databases:", error);
      setDatabases([]);
    }
  };

  const loadDNSRecords = async () => {
    if (!selectedDomain) return;
    try {
      const res = await fetch(`/api/hestia/dns?domain=${encodeURIComponent(selectedDomain)}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setDnsRecords(data.records || []);
    } catch (error) {
      console.error("Failed to load DNS records:", error);
      setDnsRecords([]);
    }
  };

  const loadSystemInfo = async () => {
    try {
      const res = await fetch("/api/hestia/system");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setSystemInfo(data);
    } catch (error) {
      console.error("Failed to load system info:", error);
    }
  };

  const addDNSRecord = async (record: Omit<DNSRecord, "id">) => {
    if (!selectedDomain) return;
    setSaving(true);
    try {
      const res = await fetch("/api/hestia/dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          domain: selectedDomain,
          ...record,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        loadDNSRecords();
      }
    } catch (error) {
      console.error("Failed to add DNS record:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteDNSRecord = async (recordId: string) => {
    if (!selectedDomain) return;
    setSaving(true);
    try {
      const res = await fetch("/api/hestia/dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          domain: selectedDomain,
          record: recordId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadDNSRecords();
      }
    } catch (error) {
      console.error("Failed to delete DNS record:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <RefreshCw className="animate-spin" style={{ width: 24, height: 24, color: "var(--primary)" }} />
        <p style={{ color: "var(--text-light)", marginTop: "1rem" }}>Connecting to hosting server...</p>
      </div>
    );
  }

  if (!status?.available) {
    return (
      <div style={{ 
        background: "var(--dark-secondary)", 
        padding: "2rem", 
        borderRadius: "1rem", 
        border: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <Server size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
        <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>Hosting Not Connected</h3>
        <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
          {status?.message || "Configure HESTIA_HOST and HESTIA_API_KEY to enable hosting management."}
        </p>
        <div style={{ 
          background: "var(--dark)", 
          padding: "1rem", 
          borderRadius: "0.5rem", 
          textAlign: "left",
          fontSize: "0.875rem"
        }}>
          <p style={{ color: "var(--text-light)", marginBottom: "0.5rem" }}>To enable hosting:</p>
          <ol style={{ color: "var(--text-light)", paddingLeft: "1.5rem", margin: 0 }}>
            <li>Get a VPS with HestiaCP installed</li>
            <li>Add <code style={{ background: "var(--border)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>HESTIA_HOST</code> to your environment</li>
            <li>Add <code style={{ background: "var(--border)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>HESTIA_API_KEY</code> to your environment</li>
            <li>Restart the application</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Status Banner */}
      <div style={{ 
        background: "linear-gradient(135deg, #065f46 0%, #047857 100%)", 
        padding: "1rem 1.5rem", 
        borderRadius: "0.75rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}>
        <CheckCircle size={24} color="white" />
        <div>
          <div style={{ color: "white", fontWeight: "600" }}>Hosting Server Connected</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>{status.message}</div>
        </div>
        <button 
          onClick={checkStatus}
          style={{ 
            marginLeft: "auto",
            background: "rgba(255,255,255,0.2)", 
            border: "none", 
            padding: "0.5rem", 
            borderRadius: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <RefreshCw size={18} color="white" />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid var(--border)" }}>
        <button
          onClick={() => setActiveTab("domains")}
          style={{
            padding: "0.75rem 1.25rem",
            background: activeTab === "domains" ? "var(--primary)" : "transparent",
            color: activeTab === "domains" ? "white" : "var(--text-light)",
            border: "none",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Globe size={16} /> Domains ({domains.length})
        </button>
        <button
          onClick={() => setActiveTab("databases")}
          style={{
            padding: "0.75rem 1.25rem",
            background: activeTab === "databases" ? "var(--primary)" : "transparent",
            color: activeTab === "databases" ? "white" : "var(--text-light)",
            border: "none",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Database size={16} /> Databases ({databases.length})
        </button>
        <button
          onClick={() => setActiveTab("dns")}
          style={{
            padding: "0.75rem 1.25rem",
            background: activeTab === "dns" ? "var(--primary)" : "transparent",
            color: activeTab === "dns" ? "white" : "var(--text-light)",
            border: "none",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Server size={16} /> DNS Records
        </button>
        <button
          onClick={() => setActiveTab("system")}
          style={{
            padding: "0.75rem 1.25rem",
            background: activeTab === "system" ? "var(--primary)" : "transparent",
            color: activeTab === "system" ? "white" : "var(--text-light)",
            border: "none",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Cpu size={16} /> Server Stats
        </button>
      </div>

      {/* Domains Tab */}
      {activeTab === "domains" && (
        <div>
          {domains.length === 0 ? (
            <div style={{ 
              background: "var(--dark-secondary)", 
              padding: "3rem", 
              borderRadius: "1rem", 
              border: "1px solid var(--border)",
              textAlign: "center"
            }}>
              <Globe size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
              <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>No hosted domains</h3>
              <p style={{ color: "var(--text-light)" }}>Domains you add will appear here</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {domains.map((domain) => (
                <div 
                  key={domain.DOMAIN}
                  style={{ 
                    background: "var(--dark-secondary)", 
                    padding: "1.5rem", 
                    borderRadius: "0.75rem", 
                    border: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-white)" }}>
                      {domain.DOMAIN}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                      IP: {domain.IP} • Disk: {(domain.U_DISK / 1024).toFixed(1)} MB
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {domain.LETSENCRYPT === "yes" && (
                      <span style={{ 
                        background: "#065f46", 
                        color: "white", 
                        padding: "0.25rem 0.5rem", 
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: "600"
                      }}>
                        SSL
                      </span>
                    )}
                    <button 
                      style={{ 
                        background: "var(--primary)", 
                        color: "white", 
                        border: "none", 
                        padding: "0.5rem 1rem", 
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem"
                      }}
                    >
                      <ExternalLink size={14} /> Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Databases Tab */}
      {activeTab === "databases" && (
        <div>
          {databases.length === 0 ? (
            <div style={{ 
              background: "var(--dark-secondary)", 
              padding: "3rem", 
              borderRadius: "1rem", 
              border: "1px solid var(--border)",
              textAlign: "center"
            }}>
              <Database size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
              <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>No databases</h3>
              <p style={{ color: "var(--text-light)" }}>Databases you create will appear here</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {databases.map((db) => (
                <div 
                  key={db.DB}
                  style={{ 
                    background: "var(--dark-secondary)", 
                    padding: "1.5rem", 
                    borderRadius: "0.75rem", 
                    border: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text-white)" }}>
                      {db.DB}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                      User: {db.USER} • Type: {db.TYPE} • Size: {(db.U_DISK / 1024).toFixed(1)} MB
                    </div>
                  </div>
                  <button 
                    style={{ 
                      background: "#991b1b", 
                      color: "white", 
                      border: "none", 
                      padding: "0.5rem 1rem", 
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DNS Tab */}
      {activeTab === "dns" && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-white)" }}>
              Select Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "var(--dark)",
                color: "white",
                fontSize: "1rem"
              }}
            >
              <option value="">Select a domain...</option>
              {domains.map((d) => (
                <option key={d.DOMAIN} value={d.DOMAIN}>{d.DOMAIN}</option>
              ))}
            </select>
          </div>

          {!selectedDomain ? (
            <div style={{ 
              background: "var(--dark-secondary)", 
              padding: "3rem", 
              borderRadius: "1rem", 
              border: "1px solid var(--border)",
              textAlign: "center"
            }}>
              <Server size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
              <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>Select a domain</h3>
              <p style={{ color: "var(--text-light)" }}>Choose a domain to manage its DNS records</p>
            </div>
          ) : dnsRecords.length === 0 ? (
            <div style={{ 
              background: "var(--dark-secondary)", 
              padding: "3rem", 
              borderRadius: "1rem", 
              border: "1px solid var(--border)",
              textAlign: "center"
            }}>
              <Server size={48} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
              <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>No DNS records</h3>
              <p style={{ color: "var(--text-light)" }}>Add DNS records to configure your domain</p>
            </div>
          ) : (
            <div style={{ background: "var(--dark-secondary)", borderRadius: "0.75rem", border: "1px solid var(--border)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--primary)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", color: "white", fontWeight: "600" }}>Type</th>
                    <th style={{ padding: "1rem", textAlign: "left", color: "white", fontWeight: "600" }}>Record</th>
                    <th style={{ padding: "1rem", textAlign: "left", color: "white", fontWeight: "600" }}>Value</th>
                    <th style={{ padding: "1rem", textAlign: "left", color: "white", fontWeight: "600" }}>TTL</th>
                    <th style={{ padding: "1rem", textAlign: "right", color: "white", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dnsRecords.map((record) => (
                    <tr key={record.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ 
                          background: record.type === "A" ? "#1e3a8a" : record.type === "MX" ? "#854d0e" : "#3730a3",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "700"
                        }}>
                          {record.type}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontFamily: "monospace", color: "var(--text-white)" }}>{record.record}</td>
                      <td style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.875rem", color: "var(--text-light)" }}>{record.value}</td>
                      <td style={{ padding: "1rem", color: "var(--text-light)" }}>{record.ttl}s</td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        <button 
                          onClick={() => deleteDNSRecord(record.id)}
                          disabled={saving}
                          style={{ 
                            background: "#991b1b", 
                            color: "white", 
                            border: "none", 
                            padding: "0.25rem 0.5rem", 
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            opacity: saving ? 0.5 : 1
                          }}
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
        </div>
      )}

      {/* Server Stats Tab */}
      {activeTab === "system" && (
        <div>
          {!systemInfo ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <RefreshCw className="animate-spin" style={{ width: 24, height: 24, color: "var(--primary)" }} />
              <p style={{ color: "var(--text-light)", marginTop: "1rem" }}>Loading server stats...</p>
            </div>
          ) : (
            <div>
              {/* Server Info Header */}
              <div style={{ 
                background: "var(--dark-secondary)", 
                padding: "1.5rem", 
                borderRadius: "0.75rem", 
                border: "1px solid var(--border)",
                marginBottom: "1.5rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                  <Server size={24} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-white)" }}>
                      {systemInfo.hostname}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                      {systemInfo.os} • Uptime: {Math.floor(systemInfo.uptime / 3600)}h {(Math.floor(systemInfo.uptime / 60) % 60)}m
                    </div>
                  </div>
                </div>
              </div>

              {/* CPU Load */}
              <div style={{ 
                background: "var(--dark-secondary)", 
                padding: "1.5rem", 
                borderRadius: "0.75rem", 
                border: "1px solid var(--border)",
                marginBottom: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Activity size={20} style={{ color: "var(--primary)" }} />
                    <span style={{ fontWeight: "600", color: "var(--text-white)" }}>CPU Load</span>
                  </div>
                  <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>
                    {systemInfo.load[0].toFixed(2)} • {systemInfo.load[1].toFixed(2)} • {systemInfo.load[2].toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[systemInfo.load[0], systemInfo.load[1], systemInfo.load[2]].map((load, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      <div style={{ 
                        height: "8px", 
                        background: "var(--border)", 
                        borderRadius: "4px",
                        overflow: "hidden"
                      }}>
                        <div style={{ 
                          height: "100%", 
                          width: `${Math.min(load * 33, 100)}%`,
                          background: load > 0.8 ? "#ef4444" : load > 0.5 ? "#f59e0b" : "var(--primary)",
                          borderRadius: "4px",
                          transition: "width 0.3s ease"
                        }} />
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.25rem", textAlign: "center" }}>
                        {i === 0 ? "1m" : i === 1 ? "5m" : "15m"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory */}
              <div style={{ 
                background: "var(--dark-secondary)", 
                padding: "1.5rem", 
                borderRadius: "0.75rem", 
                border: "1px solid var(--border)",
                marginBottom: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Cpu size={20} style={{ color: "var(--primary)" }} />
                    <span style={{ fontWeight: "600", color: "var(--text-white)" }}>Memory</span>
                  </div>
                  <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>
                    {(systemInfo.memory.used / 1024 / 1024 / 1024).toFixed(1)} GB / {(systemInfo.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB
                  </span>
                </div>
                <div style={{ 
                  height: "12px", 
                  background: "var(--border)", 
                  borderRadius: "6px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(systemInfo.memory.used / systemInfo.memory.total) * 100}%`,
                    background: (systemInfo.memory.used / systemInfo.memory.total) > 0.9 ? "#ef4444" : (systemInfo.memory.used / systemInfo.memory.total) > 0.7 ? "#f59e0b" : "var(--primary)",
                    borderRadius: "6px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem" }}>
                  <span style={{ color: "#22c55e" }}>{(systemInfo.memory.free / 1024 / 1024 / 1024).toFixed(1)} GB free</span>
                  <span style={{ color: "var(--text-light)" }}>{((systemInfo.memory.used / systemInfo.memory.total) * 100).toFixed(1)}% used</span>
                </div>
              </div>

              {/* Disk */}
              <div style={{ 
                background: "var(--dark-secondary)", 
                padding: "1.5rem", 
                borderRadius: "0.75rem", 
                border: "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <HardDrive size={20} style={{ color: "var(--primary)" }} />
                    <span style={{ fontWeight: "600", color: "var(--text-white)" }}>Disk</span>
                  </div>
                  <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>
                    {(systemInfo.disk.used / 1024 / 1024 / 1024).toFixed(1)} GB / {(systemInfo.disk.total / 1024 / 1024 / 1024).toFixed(1)} GB
                  </span>
                </div>
                <div style={{ 
                  height: "12px", 
                  background: "var(--border)", 
                  borderRadius: "6px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(systemInfo.disk.used / systemInfo.disk.total) * 100}%`,
                    background: (systemInfo.disk.used / systemInfo.disk.total) > 0.9 ? "#ef4444" : (systemInfo.disk.used / systemInfo.disk.total) > 0.7 ? "#f59e0b" : "var(--primary)",
                    borderRadius: "6px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem" }}>
                  <span style={{ color: "#22c55e" }}>{(systemInfo.disk.free / 1024 / 1024 / 1024).toFixed(1)} GB free</span>
                  <span style={{ color: "var(--text-light)" }}>{((systemInfo.disk.used / systemInfo.disk.total) * 100).toFixed(1)}% used</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
