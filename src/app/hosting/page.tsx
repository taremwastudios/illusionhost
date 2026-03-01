"use client";

import { useState, useEffect } from "react";
import { useCart, CartItemType } from "@/lib/cart";
import Link from "next/link";
import { CheckCircle, Clock, ArrowUpCircle, Info } from "lucide-react";

export default function HostingPage() {
  const [addedPlans, setAddedPlans] = useState<Set<string>>(new Set());
  const [hasHostingPlan, setHasHostingPlan] = useState(false);
  const [existingPlan, setExistingPlan] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const { addItem } = useCart();

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

  const handleAddToCart = (plan: { name: string; price: number; description: string }) => {
    const item: CartItemType = {
      id: `hosting-${plan.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: plan.name,
      type: "hosting",
      price: plan.price,
      period: "per year",
      details: plan.description
    };
    addItem(item);
    setAddedPlans(prev => new Set(prev).add(plan.name));
  };

  const hostingPlans = [
    {
      name: "Starter Hosting",
      price: 24,
      description: "Perfect for personal websites and small blogs",
      features: [
        "1 Website",
        "10 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free Domain (.com, .net only)",
        "1 Free Domain",
        "Free SSL Certificate",
        "99.9% Uptime",
        "Email Support",
      ],
      popular: false,
      domains: { count: 1, premium: 0, tlds: [".com", ".net"] },
    },
    {
      name: "Professional Hosting",
      price: 144,
      description: "Ideal for growing businesses and e-commerce",
      features: [
        "Unlimited Websites",
        "50 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free Domain (any TLD)",
        "3 Free Domains",
        "Free SSL Certificate",
        "99.9% Uptime",
        "Priority Support",
        "Daily Backups",
        "Malware Protection",
      ],
      popular: true,
      domains: { count: 3, premium: 1, tlds: ["Any TLD"] },
    },
    {
      name: "Business Hosting",
      price: 300,
      description: "For high-traffic websites and online stores",
      features: [
        "Unlimited Websites",
        "200 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free Domain (any TLD)",
        "5 Free Domains",
        "Free SSL Certificate",
        "99.99% Uptime",
        "24/7 Phone Support",
        "Hourly Backups",
        "CDN Included",
        "Advanced DDoS Protection",
      ],
      popular: false,
      domains: { count: 5, premium: 2, tlds: ["Any TLD"] },
    },
    {
      name: "WordPress Hosting",
      price: 180,
      description: "Optimized specifically for WordPress sites",
      features: [
        "Unlimited Websites",
        "50 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free Domain (any TLD)",
        "3 Free Domains",
        "Free SSL Certificate",
        "WordPress Pre-installed",
        "WP-CLI Access",
        "Staging Environment",
        "Priority Support",
      ],
      popular: false,
      domains: { count: 3, premium: 1, tlds: ["Any TLD"] },
    },
  ];

  return (
    <>
      <section className="page-header">
        <h1>Web <strong>Hosting</strong> Services</h1>
        <p>Lightning-fast hosting with 99.9% uptime guarantee. Start your website today.</p>
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
                <h2>Choose Your Hosting Plan</h2>
                <p>All plans include free domain, SSL, and 99.9% uptime guarantee.</p>
              </div>
              
              <div className="pricing-grid">
            {hostingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="pricing-header">
                  <h3 className="pricing-name">{plan.name}</h3>
                  <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>{plan.description}</p>
                  <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    <span className="pricing-amount">{plan.price}</span>
                    <span className="pricing-period">/year</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                {addedPlans.has(plan.name) ? (
                  <Link href="/cart" className={`pricing-btn ${plan.popular ? 'primary' : 'secondary'}`}>
                    ✓ View in Cart
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(plan)}
                    className={`pricing-btn ${plan.popular ? 'primary' : 'secondary'}`}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose Our Hosting?</h2>
            <p>Industry-leading features and performance.</p>
          </div>
          
          <div className="hosting-features">
          <div className="hosting-feature">
            <div className="hosting-feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>NVMe SSDs and LiteSpeed servers for blazing fast performance.</p>
          </div>
          
          <div className="hosting-feature">
            <div className="hosting-feature-icon">🛡️</div>
            <h3>Secure</h3>
            <p>Enterprise-grade security with firewall, DDoS protection, and malware scanning.</p>
          </div>
          
          <div className="hosting-feature">
            <div className="hosting-feature-icon">☁️</div>
            <h3>Cloud-Powered</h3>
            <p>Distributed architecture ensures your site stays online even during traffic spikes.</p>
          </div>
          
          <div className="hosting-feature">
            <div className="hosting-feature-icon">🔧</div>
            <h3>Managed</h3>
            <p>Our team handles server maintenance so you can focus on your website.</p>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
