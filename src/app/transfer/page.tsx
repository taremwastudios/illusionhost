"use client";

import { useState } from "react";

export default function TransferPage() {
  const [domain, setDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [searchResult, setSearchResult] = useState<{ available: boolean; price: number } | null>(null);

  const handleTransferCheck = () => {
    if (!domain.trim()) return;
    
    // Simulate transfer check
    setTimeout(() => {
      setSearchResult({
        available: Math.random() > 0.3,
        price: 12.99,
      });
    }, 1000);
  };

  return (
    <>
      <section className="page-header">
        <h1>Transfer Your Domain</h1>
        <p>Move your domain to Illusionhost and enjoy easier management and better pricing.</p>
      </section>

      <section className="container">
        <div className="domain-search" style={{ maxWidth: "800px", margin: "0 auto 3rem" }}>
          <input
            type="text"
            placeholder="Enter your domain name to transfer..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTransferCheck()}
            style={{ border: "none", borderRadius: "0" }}
          />
          <button className="search-btn" onClick={handleTransferCheck} style={{ borderRadius: "0" }}>
            Check Availability
          </button>
        </div>

        {searchResult && (
          <div className="domain-results" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--dark)" }}>
              Transfer Result for &quot;{domain}&quot;
            </h2>
            <div className="domain-result-item">
              <span className="domain-name">{domain}</span>
              <div className="domain-status">
                {searchResult.available ? (
                  <>
                    <span className="domain-status available">✓ Eligible for Transfer</span>
                    <span className="domain-price">${searchResult.price}</span>
                    <button className="domain-action-btn">Transfer Now</button>
                  </>
                ) : (
                  <span className="domain-status taken">✗ Not Eligible for Transfer</span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Why Transfer to Illusionhost?</h2>
          <p>Experience the difference with our domain management platform.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Competitive Pricing</h3>
            <p>Save money with our low renewal rates and special transfer pricing.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Transfers</h3>
            <p>Most domain transfers complete within 5-7 days. We process them quickly.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Easy Management</h3>
            <p>Manage all your domains in one place with our intuitive control panel.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Free Privacy</h3>
            <p>Get free WHOIS privacy protection with every domain transfer.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Free Email Forwarding</h3>
            <p>Set up unlimited email forwards for your transferred domains.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Auto-Renewal</h3>
            <p>Never lose your domain with automatic renewal options.</p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>How Domain Transfer Works</h2>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "2rem",
            marginTop: "3rem"
          }}>
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                background: "var(--primary)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: "0 auto 1rem"
              }}>1</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
                Enter Domain
              </h3>
              <p style={{ color: "var(--text-light)" }}>
                Enter your domain name and auth code in the search box above.
              </p>
            </div>
            
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                background: "var(--primary)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: "0 auto 1rem"
              }}>2</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
                Confirm Transfer
              </h3>
              <p style={{ color: "var(--text-light)" }}>
                Review and confirm your transfer. Payment will be processed securely.
              </p>
            </div>
            
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                background: "var(--primary)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: "0 auto 1rem"
              }}>3</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
                Transfer Complete
              </h3>
              <p style={{ color: "var(--text-light)" }}>
                Your domain will be transferred within 5-7 days. We&apos;ll notify you at each step.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ 
        background: "linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 100%)", 
        borderRadius: "1.5rem", 
        padding: "3rem",
        color: "white"
      }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>Need Help with Transfer?</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem", opacity: 0.9 }}>
          Our support team is here to help you with your domain transfer.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/contact" style={{ 
            background: "white", 
            color: "var(--primary)", 
            padding: "1rem 2rem", 
            borderRadius: "0.75rem", 
            fontWeight: "600", 
            textDecoration: "none" 
          }}>Contact Support</a>
          <a href="/domains" style={{ 
            background: "transparent", 
            color: "white", 
            padding: "1rem 2rem", 
            borderRadius: "0.75rem", 
            fontWeight: "600", 
            textDecoration: "none",
            border: "2px solid white"
          }}>Search Domains</a>
        </div>
      </section>
    </>
  );
}
