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
  const [error, setError] = useState<string | null>(null);

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
      
      if (data.error) {
        setError(data.error);
        setResults(null);
        return;
      }
      
      setError(null);
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <h3>Select Your Plan</h3>
            <p>Choose from our flexible hosting plans to get your site online fast!</p>
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
                placeholder="Enter domain (e.g., mrush.net)..."
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

        {error && (
          <div style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "1.5rem",
            background: "#fef2f2",
            border: "2px solid #ef4444",
            borderRadius: "0.75rem",
            textAlign: "center"
          }}>
            <p style={{ color: "#dc2626", fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {results && (
          <div className="domain-results" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--dark)" }}>
              Domain Search Results for &quot;{searchQuery}&quot;
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {results.map((result, index) => (
                <div key={index} style={{
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
                    <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--dark)" }}>
                      {result.name}
                    </span>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

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
