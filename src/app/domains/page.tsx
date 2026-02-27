"use client";

import { useState } from "react";

interface DomainResult {
  name: string;
  available: boolean;
  tld: string;
  requiredPlan: string;
  isPremium: boolean;
}

const tldInfo: Record<string, { plan: string; premium: boolean; domains: number }> = {
  ".com": { plan: "Starter ($2/mo)", premium: false, domains: 1 },
  ".net": { plan: "Starter ($2/mo)", premium: false, domains: 1 },
  ".org": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".io": { plan: "Professional ($12/mo)", premium: true, domains: 3 },
  ".app": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".dev": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".co": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".ai": { plan: "Professional ($12/mo)", premium: true, domains: 1 },
  ".xyz": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".online": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".site": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
  ".store": { plan: "Professional ($12/mo)", premium: false, domains: 3 },
};

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

    // Simulate domain search - show which plan is needed for each TLD
    setTimeout(() => {
      const domain = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const mockResults: DomainResult[] = availableTLDs.map((tld) => {
        const info = tldInfo[tld.ext];
        return {
          name: `${domain}${tld.ext}`,
          available: tld.available,
          tld: tld.ext,
          requiredPlan: info.plan,
          isPremium: info.premium,
        };
      });
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
            
            {/* Plan explanation */}
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              marginBottom: "2rem"
            }}>
              <h3 style={{ marginBottom: "0.75rem" }}>🚀 FREE Domains — Choose Your Plan</h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginTop: "1rem"
              }}>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "1rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontWeight: "700" }}>Starter — $2/mo</div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>1 domain (.com/.net)</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "1rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontWeight: "700" }}>Professional — $12/mo</div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>3 domains (.com/.net/.io)</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "1rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontWeight: "700" }}>Business — $25/mo</div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>5 domains (.com/.net/.io/.app)</div>
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
                    color: "#10b981", 
                    fontSize: "1.5rem", 
                    fontWeight: "700" 
                  }}>FREE</span>
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
                  <a 
                    href="/hosting" 
                    className="domain-action-btn" 
                    style={{ width: "100%", textAlign: "center", textDecoration: "none" }}
                  >
                    Get This Plan
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
            <h2>Choose Your Plan — Get FREE Domains</h2>
            <p>The more you pay, the more premium domains you get!</p>
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
                <li>🎁 <strong>1 Free Domain</strong></li>
                <li style={{ color: "#6b7280", fontSize: "0.875rem" }}>.com or .net only</li>
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
                <li>🎁 <strong>3 Free Domains</strong></li>
                <li style={{ color: "#059669", fontWeight: "600" }}>⭐ Any TLD (.io, .app, etc.)</li>
                <li>Any TLD (.io, .app, etc.)</li>
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
                <li>🎁 <strong>5 Free Domains</strong></li>
                <li style={{ color: "#059669", fontWeight: "600" }}>⭐ Any TLD (.io, .app, etc.)</li>
                <li>Free SSL Certificate</li>
                <li>Priority Support</li>
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
          <p>Everything you need to know about our FREE domain offer</p>
        </div>
        
        <div className="features-grid" style={{ marginTop: "2rem" }}>
          <div className="feature-card">
            <h3>How do I get my free domain?</h3>
            <p>Simply sign up for any hosting plan and search for your desired domain. When you find one you like, claim it during checkout — it&apos;s completely FREE with your plan!</p>
          </div>
          
          <div className="feature-card">
            <h3>What&apos;s the catch?</h3>
            <p>There&apos;s no catch! Your domain stays free as long as you maintain an active hosting plan. If you cancel, you can transfer the domain elsewhere at standard rates.</p>
          </div>
          
          <div className="feature-card">
            <h3>Can I get a .ai domain for free?</h3>
            <p>.ai domains are available as a separate package at $18/month with free domain for 2 years. Check our <a href="/pricing">pricing page</a> for details.</p>
          </div>
          
          <div className="feature-card">
            <h3>How many free domains can I get?</h3>
            <p><strong>Starter ($2/mo)</strong>: 1 domain (.com/.net only)<br/>
            <strong>Professional ($12/mo)</strong>: 3 domains (.com/.net/.io)<br/>
            <strong>Business ($25/mo)</strong>: 5 domains (.com/.net/.io/.app)</p>
          </div>
          
          <div className="feature-card">
            <h3>What happens when my plan expires?</h3>
            <p>Your domain is yours as long as your hosting plan is active. You can renew your hosting to keep the domain free, or transfer it to another registrar at standard domain renewal rates.</p>
          </div>
          
          <div className="feature-card">
            <h3>Can I upgrade my plan later?</h3>
            <p>Absolutely! You can upgrade anytime and instantly unlock more domain allowances and premium TLDs like .ai and .io.</p>
          </div>
        </div>
      </section>
    </>
  );
}
