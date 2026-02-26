"use client";

import { useState } from "react";

interface DomainResult {
  name: string;
  available: boolean;
  tld: string;
}

const availableTLDs = [
  { ext: ".com", available: true },
  { ext: ".net", available: true },
  { ext: ".org", available: true },
  { ext: ".io", available: true },
  { ext: ".app", available: true },
  { ext: ".dev", available: true },
  { ext: ".co", available: true },
  { ext: ".ai", available: true },
  { ext: ".xyz", available: true },
  { ext: ".online", available: true },
  { ext: ".site", available: true },
  { ext: ".store", available: true },
];

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setResults(null);

    // Simulate domain search - all domains are "available" when you have a plan
    setTimeout(() => {
      const domain = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const mockResults: DomainResult[] = availableTLDs.map((tld) => ({
        name: `${domain}${tld.ext}`,
        available: tld.available,
        tld: tld.ext,
      }));
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="page-header" style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)",
        color: "white"
      }}>
        <h1>Get Your Domain — 100% FREE</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto" }}>
          That&apos;s right! We GIVE away domains for FREE. The catch? You just need an active hosting plan starting at just $2/month.
        </p>
      </section>

      {/* How It Works */}
      <section className="container" style={{ padding: "3rem 1rem" }}>
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Getting your free domain is easier than ever</p>
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
            <h3>Choose a Hosting Plan</h3>
            <p>Pick any hosting plan starting at just $2/month. That&apos;s the secret sauce!</p>
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
            <h3>Domain is FREE Forever</h3>
            <p>Pay $0 for your domain as long as you keep your hosting plan active!</p>
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
              🎉 Available Domains for &quot;{searchQuery}&quot;
            </h2>
            
            {/* Show hosting plan prompt if no active plan */}
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
                Simply activate any hosting plan starting at $2/month and this domain is yours for FREE!
              </p>
              <a href="/hosting" className="nav-btn-primary" style={{
                display: "inline-block",
                background: "white",
                color: "#10b981",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600"
              }}>
                Get Started from $2/month
              </a>
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
                  border: "2px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <span className="domain-name" style={{ fontSize: "1.25rem", fontWeight: "700" }}>{result.name}</span>
                  <span style={{ 
                    color: "#10b981", 
                    fontSize: "1.5rem", 
                    fontWeight: "700" 
                  }}>FREE</span>
                  <span style={{ 
                    color: "var(--text-light)", 
                    fontSize: "0.875rem" 
                  }}>with active hosting plan</span>
                  <a 
                    href="/hosting" 
                    className="domain-action-btn" 
                    style={{ width: "100%", textAlign: "center", textDecoration: "none" }}
                  >
                    Claim This Domain
                  </a>
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
            <h2>Starting at Just $2/Month</h2>
            <p>That&apos;s less than a cup of coffee! All plans include your free domain.</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card featured">
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
                <li>🎁 Free Domain (Yours forever!)</li>
                <li>Free SSL Certificate</li>
                <li>99.9% Uptime</li>
              </ul>
              <a href="/hosting" className="pricing-btn primary">
                Get Started
              </a>
            </div>
            
            <div className="pricing-card">
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
                <li>🎁 Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Priority Support</li>
                <li>Daily Backups</li>
              </ul>
              <a href="/hosting" className="pricing-btn secondary">
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
                <li>🎁 Free Domain</li>
                <li>Free SSL Certificate</li>
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
          <p>Everything you need to know about our free domain offer</p>
        </div>
        
        <div className="features-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div className="feature-card">
            <h3>💰 Is the domain really free?</h3>
            <p>Yes! As long as you have an active hosting plan with us, your domain is 100% free. No hidden fees, no catches!</p>
          </div>
          
          <div className="feature-card">
            <h3>🔄 What happens if I cancel my hosting?</h3>
            <p>If you cancel your hosting plan, you&apos;ll need to transfer your domain away or renew it at standard rates ($12.99+/year).</p>
          </div>
          
          <div className="feature-card">
            <h3>🌐 What extensions can I get for free?</h3>
            <p>All popular extensions including .com, .net, .org, .io, .app, .dev, .co, .ai, .xyz, and many more!</p>
          </div>
          
          <div className="feature-card">
            <h3>⏰ How long does it take?</h3>
            <p>Instant! Once you sign up for hosting, your domain is immediately registered and ready to use.</p>
          </div>
          
          <div className="feature-card">
            <h3>🔒 Is SSL included?</h3>
            <p>Absolutely! All our hosting plans include free SSL certificates, so your site is secure from day one.</p>
          </div>
          
          <div className="feature-card">
            <h3>📝 Can I transfer my existing domain?</h3>
            <p>Yes! We can transfer your existing domain to us for free when you sign up for any hosting plan.</p>
          </div>
        </div>
      </section>
    </>
  );
}
