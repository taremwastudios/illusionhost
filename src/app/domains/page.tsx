"use client";

import { useState } from "react";

interface DomainResult {
  name: string;
  available: boolean;
  price: number;
}

const popularTLDs = [
  { ext: ".com", price: 12.99, popular: true },
  { ext: ".net", price: 9.99, popular: true },
  { ext: ".org", price: 11.99, popular: true },
  { ext: ".io", price: 49.99, popular: true },
  { ext: ".app", price: 14.99, popular: false },
  { ext: ".dev", price: 14.99, popular: false },
  { ext: ".co", price: 29.99, popular: false },
  { ext: ".ai", price: 79.99, popular: true },
  { ext: ".xyz", price: 2.99, popular: false },
  { ext: ".online", price: 3.99, popular: false },
  { ext: ".site", price: 3.99, popular: false },
  { ext: ".store", price: 4.99, popular: false },
];

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setResults(null);

    // Simulate domain search
    setTimeout(() => {
      const domain = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const mockResults: DomainResult[] = [
        { name: `${domain}.com`, available: Math.random() > 0.3, price: 12.99 },
        { name: `${domain}.net`, available: Math.random() > 0.4, price: 9.99 },
        { name: `${domain}.org`, available: Math.random() > 0.5, price: 11.99 },
        { name: `${domain}.io`, available: Math.random() > 0.6, price: 49.99 },
        { name: `${domain}.app`, available: Math.random() > 0.4, price: 14.99 },
        { name: `${domain}.dev`, available: Math.random() > 0.5, price: 14.99 },
        { name: `${domain}.ai`, available: Math.random() > 0.7, price: 79.99 },
        { name: `${domain}.xyz`, available: Math.random() > 0.2, price: 2.99 },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <section className="page-header">
        <h1>Domain Name Search</h1>
        <p>Find the perfect domain name for your business. All domains include free DNS management.</p>
      </section>

      <section className="container">
        <div className="domain-search" style={{ maxWidth: "800px", margin: "0 auto 3rem" }}>
          <input
            type="text"
            placeholder="Enter your domain name..."
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
              Search Results for &quot;{searchQuery}&quot;
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
        )}
      </section>

      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>Popular Domain Extensions</h2>
            <p>Register your perfect domain name today.</p>
          </div>
          
          <div className="pricing-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {popularTLDs.map((tld, index) => (
              <div key={index} className="pricing-card" style={{ textAlign: "center", padding: "1.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--dark)", marginBottom: "0.5rem" }}>
                  {tld.ext}
                </div>
                {tld.popular && (
                  <span style={{ 
                    background: "var(--primary)", 
                    color: "white", 
                    padding: "0.125rem 0.5rem", 
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "600"
                  }}>Popular</span>
                )}
                <div style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: "700", color: "var(--dark)" }}>
                  ${tld.price}<span style={{ fontSize: "0.875rem", fontWeight: "400", color: "var(--text-light)" }}>/yr</span>
                </div>
                <button className="domain-action-btn" style={{ marginTop: "1rem", width: "100%" }}>Register</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Domain Features</h2>
          <p>Everything you need to manage your domain effectively.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Free DNS Management</h3>
            <p>Easy-to-use DNS management panel to configure your domain records.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Free SSL Certificate</h3>
            <p>Secure your website with free SSL certificates on all domains.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Email Forwarding</h3>
            <p>Create unlimited email forwards for your domain at no extra cost.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Domain Forwarding</h3>
            <p>Forward your domain to any URL with permanent or temporary redirects.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Domain Privacy</h3>
            <p>Protect your personal information with WHOIS privacy protection.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Setup</h3>
            <p>Your domain is ready to use immediately after registration.</p>
          </div>
        </div>
      </section>
    </>
  );
}
