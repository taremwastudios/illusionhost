"use client";

import { useState } from "react";

interface DomainResult {
  name: string;
  available: boolean;
  price: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [loading, setLoading] = useState(false);

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
          tld: ".com",
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

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Free Domains for Students
          </h1>
          <p className="hero-subtitle">
            That&apos;s right — we GIVE domains away for FREE! The catch? Just get any hosting plan. All plans are suitable for any business but differ by standard and the firepower we give you. Are you a student? There&apos;s a package especially for you! That&apos;s right, you get a custom &quot;yourdomain.illusionhost.co&quot; for a whole year! What are you waiting for? Just make sure to read our Terms of Service and Privacy Policy on usage to make sure you are within our limits.
          </p>
          
          <div className="domain-search" style={{ maxWidth: "100%", width: "100%" }}>
            <div style={{ display: "flex", gap: "0", flexWrap: "wrap", width: "100%" }}>
              <div style={{ flex: "1", minWidth: "300px", position: "relative" }}>
                <input
                  type="text"
                  placeholder="Enter your domain name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{ 
                    flex: "1", 
                    minWidth: "300px",
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

          <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#9ca3af", maxWidth: "600px", margin: "1rem auto 0", lineHeight: "1.6" }}>
            We are a dedicated community that hopes to solve your business troubles, with a domain, hosting, multiple websites, dedicated website builder, large uptime, auto backup and a lot more, come join the illusion family trusted by thousands of users
          </p>
        </div>
      </section>

      {/* Domain Results */}
      {results && (
        <section className="container">
          <div className="domain-results">
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--dark)" }}>
              Domain Search Results for &quot;{searchQuery}&quot;
            </h2>
            
            <div style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              marginBottom: "2rem",
              textAlign: "center"
            }}>
              <h3 style={{ marginBottom: "0.5rem" }}>🚀 Your Domain is FREE!</h3>
              <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
                Simply activate any hosting plan starting at $24/year and this domain is yours for FREE!
              </p>
              <a href="/hosting" style={{
                background: "white",
                color: "#10b981",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600",
                display: "inline-block"
              }}>
                Get Started from $24/year
              </a>
            </div>

            {results.map((result, index) => (
              <div key={index} className="domain-result-item">
                <span className="domain-name">{result.name}</span>
                <div className="domain-status">
                  {result.available ? (
                    <>
                      <span className="domain-status available">✓ Available</span>
                      <span className="domain-price" style={{ color: "#10b981", fontWeight: "700" }}>FREE</span>
                      <a href="/hosting" className="domain-action-btn">Claim Domain</a>
                    </>
                  ) : (
                    <span className="domain-status taken">✗ Taken</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose Illusionhost?</h2>
            <p>We provide everything you need to build and grow your online presence.</p>
          </div>
          
          <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Our global CDN ensures your website loads fast anywhere in the world. 99.9% uptime guaranteed.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure by Default</h3>
            <p>Free SSL certificates with every domain. Enterprise-grade DDoS protection included.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Premium Domains</h3>
            <p>Access to exclusive premium domain names. Find the perfect brand for your business.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Easy Management</h3>
            <p>Intuitive control panel to manage all your domains, hosting, and email in one place.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📞</div>
            <h3>24/7 Expert Support</h3>
            <p>Our support team is available around the clock to help you with any questions.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Price Guarantee</h3>
            <p>Found a better price? We&apos;ll match it. Plus, enjoy transparent pricing with no hidden fees.</p>
          </div>
        </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Your domain is FREE with any hosting plan — just keep your plan active!</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">24</span>
                  <span className="pricing-period">/year</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>1 Website</li>
                <li>10 GB SSD Storage</li>
                <li>Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Unlimited Bandwidth</li>
                <li>Email Support</li>
              </ul>
              <a href="/pricing" className="pricing-btn secondary">View Details</a>
            </div>
            
            <div className="pricing-card featured">
              <div className="pricing-header">
                <h3 className="pricing-name">Professional</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">144</span>
                  <span className="pricing-period">/year</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited Websites</li>
                <li>50 GB SSD Storage</li>
                <li>Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Unlimited Bandwidth</li>
                <li>Priority Support</li>
                <li>Daily Backups</li>
              </ul>
              <a href="/pricing" className="pricing-btn primary">View Details</a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Business</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">300</span>
                  <span className="pricing-period">/year</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited Websites</li>
                <li>200 GB SSD Storage</li>
                <li>Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Unlimited Bandwidth</li>
                <li>24/7 Phone Support</li>
                <li>Hourly Backups</li>
                <li>CDN Included</li>
              </ul>
              <a href="/pricing" className="pricing-btn secondary">View Details</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
