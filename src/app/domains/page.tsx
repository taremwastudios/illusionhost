"use client";

import { useState } from "react";

interface DomainResult {
  name: string;
  available: boolean;
  tld: string;
  requiredPlan: string;
  isPremium: boolean;
  isHybridEligible: boolean;
  domainPrice: number;
  isExactMatch: boolean;
  isRecommendation: boolean;
}

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHybridModal, setShowHybridModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/whois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: searchQuery.trim(),
          tld: ".com", // Default - we check all TLDs anyway
        }),
      });

      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetHybrid = (result: DomainResult) => {
    setSelectedDomain(result);
    setShowHybridModal(true);
  };

  // Separate results into exact match and recommendations
  const exactMatch = results?.filter(r => r.isExactMatch) || [];
  const recommendations = results?.filter(r => r.isRecommendation) || [];
  const otherResults = results?.filter(r => !r.isExactMatch && !r.isRecommendation) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="page-header" style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)",
        color: "white"
      }}>
        <h1>Get Your Domain</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto" }}>
          Search for your perfect domain name. Many popular extensions available at great prices.
        </p>
      </section>

      {/* How It Works */}
      <section className="container" style={{ padding: "3rem 1rem" }}>
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Getting your domain is easier than ever</p>
        </div>
        
        <div className="features-grid" style={{ marginTop: "2rem" }}>
          <div className="feature-card" style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              background: "var(--primary)",
              color: "white",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem"
            }}>1</div>
            <h3>Search Your Domain</h3>
            <p>Find the perfect domain name for your brand. All extensions available!</p>
          </div>
          
          <div className="feature-card" style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              background: "var(--primary)",
              color: "white",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem"
            }}>2</div>
            <h3>Get Hybrid Deal</h3>
            <p>For .com, .net, .co domains — get 50% off hosting when you buy the domain!</p>
          </div>
          
          <div className="feature-card" style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              background: "var(--primary)",
              color: "white",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem"
            }}>3</div>
            <h3>Launch Your Site</h3>
            <p>Connect your domain to hosting and launch your website!</p>
          </div>
        </div>
      </section>

      {/* Domain Search */}
      <section className="container">
        <div className="domain-search" style={{ maxWidth: "100%", margin: "0 auto 3rem", padding: "0 1rem" }}>
          <div style={{ display: "flex", gap: "0", flexWrap: "wrap", width: "100%" }}>
            <div style={{ flex: "1", minWidth: "300px", position: "relative" }}>
              <input
                type="text"
                placeholder="Enter your desired domain name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ 
                  border: "none", 
                  borderRadius: "0",
                  height: "60px",
                  fontSize: "1.1rem",
                  padding: "0 1.5rem",
                  width: "100%"
                }}
              />
            </div>
            <button 
              className="search-btn" 
              onClick={handleSearch} 
              style={{ 
                borderRadius: "0",
                height: "60px",
                padding: "0 3rem",
                fontSize: "1.1rem"
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {results && (
          <div className="domain-results" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--dark)" }}>
              Domain Search Results for &quot;{searchQuery}&quot;
            </h2>
            
            {/* Hybrid Package Info */}
            {exactMatch.some(r => r.isHybridEligible && r.available) && (
              <div style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "1rem",
                marginBottom: "2rem"
              }}>
                <h3 style={{ marginBottom: "0.75rem" }}>💎 Hybrid Package Deal</h3>
                <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
                  For popular TLDs (.com, .net, .co), buy the domain first and get <strong>50% OFF</strong> any hosting plan!
                </p>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem"
                }}>
                  <div style={{ background: "rgba(255,255,255,0.15)", padding: "1rem", borderRadius: "0.5rem" }}>
                    <div style={{ fontWeight: "700" }}>Domain + Starter</div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>$12.99/mo (save $6)</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.15)", padding: "1rem", borderRadius: "0.5rem" }}>
                    <div style={{ fontWeight: "700" }}>Domain + Professional</div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>$24.99/mo (save $12)</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.15)", padding: "1rem", borderRadius: "0.5rem" }}>
                    <div style={{ fontWeight: "700" }}>Domain + Business</div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>$32.49/mo (save $12.50)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Exact Match Section */}
            {exactMatch.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ 
                  marginBottom: "1rem", 
                  color: "var(--dark)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  🎯 Your Exact Match
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {exactMatch.map((result, index) => (
                    <div key={index} className="domain-result-item" style={{
                      background: result.isExactMatch ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" : "white",
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      border: result.isPremium ? "2px solid #f59e0b" : result.isExactMatch ? "2px solid #f59e0b" : "2px solid var(--border)",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem"
                    }}>
                      <div style={{ flex: "1", minWidth: "200px" }}>
                        <span className="domain-name" style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--dark)" }}>
                          {result.name}
                        </span>
                        {result.isExactMatch && (
                          <span style={{ 
                            background: "#f59e0b",
                            color: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "1rem",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            marginLeft: "0.75rem"
                          }}>
                            EXACT MATCH
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ 
                          color: result.available ? "#10b981" : "#ef4444", 
                          fontSize: "1.25rem", 
                          fontWeight: "700" 
                        }}>
                          {result.available ? "✅ Available" : "❌ Taken"}
                        </span>
                        
                        {result.available && (
                          <>
                            <span style={{ 
                              fontSize: "1.25rem", 
                              fontWeight: "600",
                              color: "var(--dark)"
                            }}>
                              ${result.domainPrice}/yr
                            </span>
                            
                            {result.isHybridEligible && (
                              <span style={{ 
                                background: "#d1fae5",
                                color: "#065f46",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "1rem",
                                fontSize: "0.75rem",
                                fontWeight: "600"
                              }}>
                                💎 Hybrid Eligible
                              </span>
                            )}
                            
                            {result.isHybridEligible ? (
                              <button 
                                onClick={() => handleGetHybrid(result)}
                                style={{ 
                                  padding: "0.75rem 1.5rem",
                                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.5rem",
                                  fontWeight: "600",
                                  cursor: "pointer"
                                }}
                              >
                                Get Hybrid Deal
                              </button>
                            ) : (
                              <a 
                                href="/hosting" 
                                style={{ 
                                  padding: "0.75rem 1.5rem",
                                  background: "var(--primary)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.5rem",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  textDecoration: "none",
                                  textAlign: "center"
                                }}
                              >
                                Buy Domain
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ 
                  marginBottom: "1rem", 
                  color: "var(--dark)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  💡 Recommended Alternatives
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {recommendations.map((result, index) => (
                    <div key={index} style={{
                      background: "white",
                      padding: "1rem 1.5rem",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.75rem"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1rem", fontWeight: "600", color: "var(--dark)" }}>
                          {result.name}
                        </span>
                        {result.isRecommendation && (
                          <span style={{ 
                            background: "#e0e7ff",
                            color: "#3730a3",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "1rem",
                            fontSize: "0.65rem",
                            fontWeight: "600"
                          }}>
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ 
                          color: result.available ? "#10b981" : "#ef4444", 
                          fontSize: "0.9rem", 
                          fontWeight: "600" 
                        }}>
                          {result.available ? "✅ Available" : "❌ Taken"}
                        </span>
                        
                        {result.available && (
                          <>
                            <span style={{ 
                              fontSize: "0.9rem", 
                              fontWeight: "600",
                              color: "var(--dark)"
                            }}>
                              ${result.domainPrice}/yr
                            </span>
                            
                            <a 
                              href="/hosting" 
                              style={{ 
                                padding: "0.5rem 1rem",
                                background: "var(--primary)",
                                color: "white",
                                border: "none",
                                borderRadius: "0.375rem",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                textDecoration: "none",
                                textAlign: "center"
                              }}
                            >
                              Buy
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other TLDs Section */}
            {otherResults.length > 0 && (
              <div>
                <h3 style={{ 
                  marginBottom: "1rem", 
                  color: "var(--dark)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  🌐 More Extensions
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {otherResults.map((result, index) => (
                    <div key={index} style={{
                      background: "white",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "0.375rem",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.5rem"
                    }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "500", color: "var(--dark)" }}>
                        {result.name}
                      </span>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ 
                          color: result.available ? "#10b981" : "#ef4444", 
                          fontSize: "0.8rem", 
                          fontWeight: "600" 
                        }}>
                          {result.available ? "✅ $" : "❌"} {result.available ? `${result.domainPrice}/yr` : "Taken"}
                        </span>
                        
                        {result.available && (
                          <a 
                            href="/hosting" 
                            style={{ 
                              padding: "0.375rem 0.75rem",
                              background: "var(--primary)",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              textDecoration: "none",
                              textAlign: "center"
                            }}
                          >
                            Buy
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Hybrid Modal */}
      {showHybridModal && selectedDomain && (
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
        }} onClick={() => setShowHybridModal(false)}>
          <div style={{
            background: "white",
            borderRadius: "1.5rem",
            padding: "2rem",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💎</div>
              <h2 style={{ color: "var(--dark)", marginBottom: "0.5rem" }}>Hybrid Package Deal!</h2>
              <p style={{ color: "var(--text-light)" }}>
                You selected <strong>{selectedDomain.name}</strong> — Get 50% off hosting!
              </p>
            </div>
            
            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ 
                padding: "1.5rem", 
                border: "2px solid #10b981", 
                borderRadius: "1rem",
                background: "#f0fdf4"
              }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>🥇 Best Value: Domain + Professional</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span>{selectedDomain.name} (1 year)</span>
                  <span style={{ fontWeight: "700" }}>${selectedDomain.domainPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span>Professional Plan ($12/mo)</span>
                  <span style={{ fontWeight: "700" }}>$6/mo (50% off)</span>
                </div>
                <div style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700" }}>
                  <span>Total</span>
                  <span style={{ color: "#10b981", fontSize: "1.25rem" }}>${selectedDomain.domainPrice + 6}/mo</span>
                </div>
                <button style={{
                  width: "100%",
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}>
                  Get This Deal →
                </button>
              </div>
              
              <div style={{ 
                padding: "1.5rem", 
                border: "2px solid var(--border)", 
                borderRadius: "1rem"
              }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>🥈 Domain + Starter</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span>{selectedDomain.name} (1 year)</span>
                  <span style={{ fontWeight: "700" }}>${selectedDomain.domainPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span>Starter Plan ($2/mo)</span>
                  <span style={{ fontWeight: "700" }}>$1/mo (50% off)</span>
                </div>
                <div style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--primary)", fontSize: "1.25rem" }}>${selectedDomain.domainPrice + 1}/mo</span>
                </div>
              </div>
              
              <div style={{ 
                padding: "1.5rem", 
                border: "2px solid #f59e0b", 
                borderRadius: "1rem"
              }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>🥉 Domain + Business</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span>{selectedDomain.name} (1 year)</span>
                  <span style={{ fontWeight: "700" }}>${selectedDomain.domainPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span>Business Plan ($25/mo)</span>
                  <span style={{ fontWeight: "700" }}>$12.50/mo (50% off)</span>
                </div>
                <div style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700" }}>
                  <span>Total</span>
                  <span style={{ color: "#f59e0b", fontSize: "1.25rem" }}>${selectedDomain.domainPrice + 12.5}/mo</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowHybridModal(false)}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "var(--light)",
                color: "var(--text)",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Pricing Teaser */}
      <section className="pricing-section" style={{ background: "var(--light)" }}>
        <div className="pricing-container">
          <div className="section-header">
            <h2>Choose Your Plan</h2>
            <p>Get domain + hosting at the best prices!</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">2</span>
                  <span className="pricing-period">/month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>1 Website</li>
                <li>10 GB SSD Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>Free SSL Certificate</li>
                <li>99.9% Uptime</li>
              </ul>
              <a href="/hosting" className="pricing-btn secondary">
                Get Started
              </a>
            </div>
            
            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Professional</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">12</span>
                  <span className="pricing-period">/month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited Websites</li>
                <li>50 GB SSD Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>Free SSL Certificate</li>
                <li>Free .ai Domain</li>
                <li>Priority Support</li>
                <li>99.9% Uptime</li>
              </ul>
              <a href="/hosting" className="pricing-btn primary">
                Get Started
              </a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Business</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">25</span>
                  <span className="pricing-period">/month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited Websites</li>
                <li>200 GB SSD Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>Free SSL Certificate</li>
                <li>Free .ai Domain</li>
                <li>Dedicated Support</li>
                <li>99.99% Uptime</li>
                <li>Daily Backups</li>
              </ul>
              <a href="/hosting" className="pricing-btn secondary">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
