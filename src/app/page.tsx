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

    // Simulate domain search - in production this would call a domain API
    setTimeout(() => {
      const domain = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const mockResults: DomainResult[] = [
        { name: `${domain}.com`, available: Math.random() > 0.3, price: 12.99 },
        { name: `${domain}.net`, available: Math.random() > 0.4, price: 9.99 },
        { name: `${domain}.org`, available: Math.random() > 0.5, price: 11.99 },
        { name: `${domain}.io`, available: Math.random() > 0.6, price: 49.99 },
        { name: `${domain}.app`, available: Math.random() > 0.4, price: 14.99 },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find Your Perfect <span>Domain Name</span>
          </h1>
          <p className="hero-subtitle">
            Launch your online presence with premium domain names and lightning-fast web hosting. 
            Trusted by over 50,000 businesses worldwide.
          </p>
          
          <div className="domain-search">
            <input
              type="text"
              placeholder="Enter your domain name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="tld-tags">
            <span className="tld-tag">.com $12.99</span>
            <span className="tld-tag">.net $9.99</span>
            <span className="tld-tag">.org $11.99</span>
            <span className="tld-tag">.io $49.99</span>
            <span className="tld-tag premium">.ai $79.99</span>
            <span className="tld-tag">.app $14.99</span>
          </div>
        </div>
      </section>

      {/* Domain Results */}
      {results && (
        <section className="container">
          <div className="domain-results">
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--dark)" }}>
              Domain Search Results
            </h2>
            {results.map((result, index) => (
              <div key={index} className="domain-result-item">
                <span className="domain-name">{result.name}</span>
                <div className="domain-status">
                  {result.available ? (
                    <>
                      <span className="domain-status available">✓ Available</span>
                      <span className="domain-price">${result.price}/yr</span>
                      <button className="domain-action-btn">Add to Cart</button>
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
      </section>

      {/* Pricing Preview */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the perfect plan for your needs. All plans include a free domain.</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">5</span>
                  <span className="pricing-period">/month</span>
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
                  <span className="pricing-amount">12</span>
                  <span className="pricing-period">/month</span>
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
                  <span className="pricing-amount">25</span>
                  <span className="pricing-period">/month</span>
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

      {/* CTA Section */}
      <section className="container" style={{ textAlign: "center", background: "linear-gradient(135deg, var(--primary) 0%, var(--gradient-end) 100%)", borderRadius: "1.5rem", padding: "4rem 2rem", color: "white" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Ready to Get Started?</h2>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem", opacity: 0.9 }}>Join thousands of satisfied customers who trust Illusionhost for their online presence.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/domains" style={{ background: "white", color: "var(--primary)", padding: "1rem 2rem", borderRadius: "0.75rem", fontWeight: "600", textDecoration: "none" }}>Search Domains</a>
          <a href="/pricing" style={{ background: "transparent", color: "white", padding: "1rem 2rem", borderRadius: "0.75rem", fontWeight: "600", textDecoration: "none", border: "2px solid white" }}>View Pricing</a>
        </div>
      </section>
    </>
  );
}
