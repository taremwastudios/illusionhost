"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Clock, ArrowUpCircle, Info } from "lucide-react";

export default function PricingPage() {
  const [hasHostingPlan, setHasHostingPlan] = useState(false);
  const [existingPlan, setExistingPlan] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has an existing hosting plan
    const purchasedItems = JSON.parse(localStorage.getItem("purchased_items") || "[]");
    const hostingItem = purchasedItems.find((item: any) => item.type === "hosting");
    if (hostingItem) {
      // Use setTimeout to avoid calling setState in useEffect body
      setTimeout(() => {
        setHasHostingPlan(true);
        setExistingPlan(hostingItem.name);
        setExpirationDate(hostingItem.expirationDate);
      }, 0);
    }
  }, []);
  const hostingPlans = [
    {
      name: "Student",
      price: 0,
      period: "1 year",
      features: [".illusionhost.co Domain", "2 GB SSD", "Free SSL Certificate", "Unlimited Bandwidth", "Custom Email", "Student Support"],
      featured: false,
    },
    {
      name: "Starter",
      price: 25,
      features: ["1 Website", "10 GB SSD", "Unlimited Bandwidth", "Free SSL", "Email Support"],
    },
    {
      name: "Professional",
      price: 144,
      features: ["Unlimited Websites", "50 GB SSD", "Unlimited Bandwidth", "Free SSL", "Priority Support", "Daily Backups"],
    },
    {
      name: "Business",
      price: 300,
      features: ["Unlimited Websites", "200 GB SSD", "Unlimited Bandwidth", "Free SSL", "24/7 Phone Support", "Hourly Backups", "CDN"],
    },
  ];


  return (
    <>
      <section className="page-header">
        <h1>Pricing</h1>
        <p>Transparent pricing with no hidden fees. Choose the plan that fits your needs.</p>
      </section>

      <section className="pricing-section">
        <div className="pricing-container">
          {/* Show current plan info if user has hosting */}
          {hasHostingPlan ? (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ 
                background: "linear-gradient(135deg, #065f46 0%, #047857 100%)", 
                padding: "2rem", 
                borderRadius: "1rem", 
                border: "2px solid #10b981",
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto 2rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <CheckCircle size={32} color="white" />
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.5rem" }}>You&apos;re All Set!</h2>
                </div>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.125rem", marginBottom: "1rem" }}>
                  You already have the <strong>{existingPlan}</strong> plan active.
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>
                  Your plan expires on {expirationDate ? new Date(expirationDate).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div style={{ 
                background: "var(--dark-secondary)", 
                padding: "2rem", 
                borderRadius: "1rem", 
                border: "1px solid var(--border)",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                  <Info size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: "0.25rem" }} />
                  <div>
                    <h3 style={{ color: "var(--text-white)", marginBottom: "0.5rem" }}>Why can&apos;t I subscribe again?</h3>
                    <p style={{ color: "var(--text-light)", margin: 0, fontSize: "0.875rem" }}>
                      Each account is limited to one active hosting plan at a time. This ensures fair resource allocation and prevents service abuse. You can upgrade to a higher plan when your current plan expires or contact support for special arrangements.
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <Link href="/account" style={{ textDecoration: "none" }}>
                    <div style={{ 
                      background: "var(--dark)", 
                      padding: "1.5rem", 
                      borderRadius: "0.75rem", 
                      border: "1px solid var(--border)",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}>
                      <Clock size={24} color="var(--primary)" style={{ marginBottom: "0.5rem" }} />
                      <div style={{ color: "var(--text-white)", fontWeight: "600" }}>Manage Current Plan</div>
                      <div style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>View details in dashboard</div>
                    </div>
                  </Link>
                  <Link href="/domains" style={{ textDecoration: "none" }}>
                    <div style={{ 
                      background: "var(--dark)", 
                      padding: "1.5rem", 
                      borderRadius: "0.75rem", 
                      border: "1px solid var(--border)",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}>
                      <ArrowUpCircle size={24} color="var(--primary)" style={{ marginBottom: "0.5rem" }} />
                      <div style={{ color: "var(--text-white)", fontWeight: "600" }}>Add Domains</div>
                      <div style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>Register more domains</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2>Web Hosting Plans</h2>
                <p>High-performance hosting at affordable prices. All plans include free SSL!</p>
              </div>
              
              <div className="pricing-grid">
            {hostingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${index === 2 ? 'featured' : ''}`}>
                <div className="pricing-header">
                  <h3 className="pricing-name">{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    <span className="pricing-amount">{plan.price}</span>
                    <span className="pricing-period">/{plan.period || 'year'}</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <a href="/signup" className={`pricing-btn ${index === 2 ? 'primary' : 'secondary'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </>
          )}
        </div>
      </section>

      {/* Domain Pricing Section */}
      <section className="container">
        <div className="section-header">
          <h2>Domain Pricing</h2>
          <p>Popular domain extensions at great prices. Search for your perfect domain!</p>
        </div>
        
        <div style={{ 
          background: "white", 
          borderRadius: "1rem", 
          padding: "2rem",
          boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
          marginTop: "2rem"
        }}>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            {[
              { tld: ".com", price: 12.99, popular: true },
              { tld: ".net", price: 14.99 },
              { tld: ".org", price: 14.99 },
              { tld: ".co", price: 29.99 },
              { tld: ".io", price: 55.00, premium: true },
              { tld: ".app", price: 19.99 },
              { tld: ".dev", price: 19.99 },
              { tld: ".xyz", price: 12.99 },
            ].map((domain, idx) => (
              <div key={idx} style={{
                padding: "1.5rem",
                background: domain.popular ? "#f0fdf4" : "var(--light)",
                borderRadius: "0.75rem",
                border: domain.popular ? "2px solid #22c55e" : "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: "700", fontSize: "1.25rem" }}>{domain.tld}</span>
                  {domain.premium && (
                    <span style={{ background: "#fef3c7", color: "#92400e", padding: "0.125rem 0.5rem", borderRadius: "1rem", fontSize: "0.625rem", fontWeight: "600" }}>PREMIUM</span>
                  )}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--primary)" }}>
                  ${domain.price}<span style={{ fontSize: "0.875rem", fontWeight: "400", color: "var(--text-light)" }}>/yr</span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href="/domains" className="nav-btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Search Your Domain
            </a>
          </div>
        </div>
      </section>

      <section className="container" style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--dark)" }}>Need a Custom Solution?</h2>
        <p style={{ fontSize: "1.125rem", color: "var(--text-light)", marginBottom: "2rem" }}>
          Contact our sales team for custom hosting solutions tailored to your needs.
        </p>
        <a href="/contact" className="nav-btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
          Contact Sales
        </a>
      </section>
    </>
  );
}
