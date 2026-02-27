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
}

// TLDs that are eligible for hybrid package (domain first + 50% off hosting)
const hybridEligibleTLDs = [".com", ".net", ".co"];

// Domain registration prices (first year)
const domainPrices: Record<string, number> = {
  ".com": 12.99,
  ".net": 14.99,
  ".org": 14.99,
  ".io": 55.00,
  ".app": 19.99,
  ".dev": 19.99,
  ".co": 29.99,
  ".xyz": 12.99,
  ".online": 12.99,
  ".site": 12.99,
  ".store": 12.99,
};

const tldInfo: Record<string, { plan: string; premium: boolean; domains: number }> = {
  ".com": { plan: "Starter ($2/mo)", premium: false, domains: 1 },
  ".net": { plan: "Starter ($2/mo)", premium: false, domains: 1 },
  ".org": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".io": { plan: "Professional ($12/mo)", premium: true, domains: 3 },
  ".app": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".dev": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".co": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".xyz": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".online": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".site": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".store": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
};

// Simple list of known taken domains for simulation (in production, this would use real WHOIS)
const knownTakenDomains = [
  "google.com", "facebook.com", "amazon.com", "apple.com", "microsoft.com",
  "twitter.com", "instagram.com", "linkedin.com", "youtube.com", "netflix.com"
];

function isDomainTaken(domain: string): boolean {
  // Check against known taken domains
  if (knownTakenDomains.includes(domain.toLowerCase())) {
    return true;
  }
  
  // Randomly mark some domains as taken for realistic simulation
  // In production, this would call actual WHOIS API
  const hash = domain.split("").reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  return Math.abs(hash) % 5 === 0; // ~20% chance of being taken
}

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [showHybridModal, setShowHybridModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setResults(null);

    // Simulate WHOIS lookup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const domain = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
    
    const tlds = Object.keys(tldInfo);
    const mockResults: DomainResult[] = tlds.map((tld) => {
      const fullDomain = `${domain}${tld}`;
      const isTaken = isDomainTaken(fullDomain);
      const info = tldInfo[tld];
      const isHybridEligible = hybridEligibleTLDs.includes(tld);
      
      return {
        name: fullDomain,
        available: !isTaken,
        tld: tld,
        requiredPlan: info.plan,
        isPremium: info.premium,
        isHybridEligible: isHybridEligible,
        domainPrice: domainPrices[tld] || 19.99,
      };
    });
    
    setResults(mockResults);
    setLoading(false);
  };

  const handleGetHybrid = (result: DomainResult) => {
    setSelectedDomain(result);
    setShowHybridModal(true);
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
        <div className="domain-search" style={{ maxWidth: "800px", margin: "0 auto 3rem" }}>
          <input
            type="text"
            placeholder="Enter your desired domain name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ border: "none", borderRadius: "0" }}
          />
          <button className="search-btn" onClick={handleSearch} style={{ borderRadius: "0" }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {results && (
          <div className="domain-results" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--dark)" }}>
              {results.some(r => r.available) ? "🎉 " : "😞 "}Available Domains for &quot;{searchQuery}&quot;
            </h2>
            
            {/* Hybrid Package Info */}
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

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem"
            }}>
              {results.map((result, index) => (
                <div key={index} className="domain-result-item" style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  border: result.isPremium ? "2px solid #f59e0b" : "2px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <span className="domain-name" style={{ fontSize: "1.25rem", fontWeight: "700" }}>{result.name}</span>
                  <span style={{ 
                    color: result.available ? "#10b981" : "#ef4444", 
                    fontSize: "1.5rem", 
                    fontWeight: "700" 
                  }}>
                    {result.available ? "Available" : "Taken"}
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
                      
                      <span style={{ 
                        background: result.isPremium ? "#fef3c7" : "#e0e7ff",
                        color: result.isPremium ? "#92400e" : "#3730a3",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.75rem",
                        fontWeight: "600"
                      }}>
                        {result.isPremium ? "⭐ Premium" : ""} {result.requiredPlan}
                      </span>
                      
                      {result.isHybridEligible ? (
                        <button 
                          onClick={() => handleGetHybrid(result)}
                          style={{ 
                            width: "100%", 
                            padding: "0.75rem",
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
                            width: "100%", 
                            padding: "0.75rem",
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
              ))}
            </div>
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
            
            <div className="pricing-card featured">
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
                <li>Priority Support</li>
                <li>Daily Backups</li>
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
                <li>Priority Support</li>
                <li>24/7 Phone Support</li>
                <li>Hourly Backups</li>
                <li>CDN Included</li>
              </ul>
              <a href="/hosting" className="pricing-btn secondary">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="features">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about domains</p>
        </div>
        
        <div className="features-grid" style={{ marginTop: "2rem" }}>
          <div className="feature-card">
            <h3>How do I buy a domain?</h3>
            <p>Simply search for your desired domain above, select an available domain, and proceed to checkout. Domain prices start at just $12.99/year!</p>
          </div>
          
          <div className="feature-card">
            <h3>What&apos;s the Hybrid Package?</h3>
            <p>For .com, .net, and .co domains, you can get 50% off any hosting plan when you purchase the domain. This is our best value deal!</p>
          </div>
          
          <div className="feature-card">
            <h3>How many free domains can I get?</h3>
            <p><strong>Starter ($2/mo)</strong>: 1 domain<br/>
            <strong>Professional ($12/mo)</strong>: 3 domains<br/>
            <strong>Business ($25/mo)</strong>: 5 domains</p>
          </div>
          
          <div className="feature-card">
            <h3>Can I transfer my existing domain?</h3>
            <p>Yes! You can transfer existing domains to us. Contact our support team for assistance with domain transfers.</p>
          </div>
          
          <div className="feature-card">
            <h3>What happens after the first year?</h3>
            <p>Your domain will need to be renewed at the standard renewal rate. We&apos;ll send you reminders before expiration.</p>
          </div>
          
          <div className="feature-card">
            <h3>Do you offer domain privacy?</h3>
            <p>Yes, we offer domain privacy protection to keep your personal information hidden from public WHOIS lookups.</p>
          </div>
        </div>
      </section>
    </>
  );
}
