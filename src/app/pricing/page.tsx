export default function PricingPage() {
  const hostingPlans = [
    {
      name: "Starter",
      price: 2,
      features: ["1 Website", "10 GB SSD", "Unlimited Bandwidth", "1 Free Domain (.com/.net)", "Free SSL", "Email Support"],
    },
    {
      name: "Professional",
      price: 12,
      features: ["Unlimited Websites", "50 GB SSD", "Unlimited Bandwidth", "3 Free Domains (.com/.net/.io)", "Free SSL", "Priority Support", "Daily Backups"],
    },
    {
      name: "Business",
      price: 25,
      features: ["Unlimited Websites", "200 GB SSD", "Unlimited Bandwidth", "5 Free Domains (.com/.net/.io/.app)", "Free SSL", "24/7 Phone Support", "Hourly Backups", "CDN"],
    },
  ];

  const addons = [
    { name: "SSL Certificate (Positive)", price: 9.99, period: "/year" },
    { name: "SSL Certificate (Wildcard)", price: 99.99, period: "/year" },
    { name: "Domain Privacy Protection", price: 8.99, period: "/year" },
    { name: "Email Storage (10GB)", price: 2.99, period: "/month" },
    { name: "Professional Email", price: 4.99, period: "/user/month" },
    { name: "Site Backup (Daily)", price: 3.99, period: "/month" },
    { name: "Site Backup (Hourly)", price: 7.99, period: "/month" },
    { name: "DDoS Protection", price: 19.99, period: "/month" },
  ];

  return (
    <>
      <section className="page-header">
        <h1>Pricing</h1>
        <p>Transparent pricing with no hidden fees. Choose the plan that fits your needs.</p>
      </section>

      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>Web Hosting Plans</h2>
            <p>Get FREE domains with your hosting! Starter: .com/.net | Professional: 3 domains | Business: 5 domains</p>
          </div>
          
          <div className="pricing-grid">
            {hostingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${index === 1 ? 'featured' : ''}`}>
                <div className="pricing-header">
                  <h3 className="pricing-name">{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    <span className="pricing-amount">{plan.price}</span>
                    <span className="pricing-period">/month</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <a href="/signup" className={`pricing-btn ${index === 1 ? 'primary' : 'secondary'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-header">
          <h2>Domain Benefits by Plan</h2>
          <p>Your domain is FREE with any active hosting plan! Domain allowances vary by plan.</p>
        </div>
        
        <div style={{ 
          background: "white", 
          borderRadius: "1rem", 
          padding: "2rem",
          boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
        }}>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem"
          }}>
            <div style={{ 
              padding: "1.5rem", 
              background: "var(--light)",
              borderRadius: "0.75rem",
              border: "2px solid transparent"
            }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--dark)" }}>Starter Plan</h3>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary)" }}>$2<span style={{ fontSize: "1rem", fontWeight: "400" }}>/month</span></p>
              <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ 1 Free Domain</li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ .com extension</li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ .net extension</li>
                <li style={{ padding: "0.5rem 0", color: "#6b7280" }}>✗ No .ai domains</li>
              </ul>
            </div>
            
            <div style={{ 
              padding: "1.5rem", 
              background: "#f0fdf4",
              borderRadius: "0.75rem",
              border: "2px solid #22c55e"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ background: "#22c55e", color: "white", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600" }}>POPULAR</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--dark)" }}>Professional Plan</h3>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary)" }}>$12<span style={{ fontSize: "1rem", fontWeight: "400" }}>/month</span></p>
              <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ 3 Free Domains</li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ Any TLD (.com, .net, .io, etc.)</li>
                <li style={{ padding: "0.5rem 0", color: "#6b7280" }}>Add .ai separately</li>
              </ul>
            </div>
            
            <div style={{ 
              padding: "1.5rem", 
              background: "#fef3c7",
              borderRadius: "0.75rem",
              border: "2px solid #f59e0b"
            }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--dark)" }}>Business Plan</h3>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary)" }}>$25<span style={{ fontSize: "1rem", fontWeight: "400" }}>/month</span></p>
              <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ 5 Free Domains</li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>✓ Any TLD (.com, .net, .io, .app, etc.)</li>
                <li style={{ padding: "0.5rem 0", color: "#6b7280" }}>Add .ai separately</li>
              </ul>
            </div>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href="/domains" className="nav-btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Search Your Free Domain
            </a>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-header">
          <h2>.ai Domain Package</h2>
          <p>Get your .ai domain for free for 2 years with this standalone package. No hosting required!</p>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center",
          marginTop: "2rem"
        }}>
          <div style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "1.5rem", 
            padding: "3rem",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 20px 60px -12px rgba(102, 126, 234, 0.4)",
          }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ 
                background: "rgba(255,255,255,0.2)", 
                color: "white", 
                padding: "0.5rem 1rem", 
                borderRadius: "2rem", 
                fontSize: "0.875rem", 
                fontWeight: "600" 
              }}>
                .AI DOMAIN
              </span>
              <h3 style={{ fontSize: "2rem", marginTop: "1rem", marginBottom: "0.5rem", color: "white", fontWeight: "700" }}>
                .ai Domain
              </h3>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.25rem" }}>
                <span style={{ fontSize: "3.5rem", fontWeight: "800", color: "white" }}>$18</span>
                <span style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)" }}>/month</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                billed monthly
              </p>
            </div>
            
            <div style={{ marginTop: "2rem" }}>
              <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> 1 Free .ai Domain
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Free for 2 Years
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Domain Registration
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Free DNS Management
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Domain Transfer Available
                </li>
                <li style={{ padding: "0.75rem 0", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> 24/7 Support
                </li>
              </ul>
            </div>
            
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <a href="/domains" style={{ 
                display: "inline-block",
                background: "white",
                color: "#764ba2",
                padding: "1rem 2rem",
                borderRadius: "2rem",
                fontWeight: "700",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}>
                Get Your .ai Domain
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section" style={{ background: "var(--light)" }}>
        <div className="pricing-container">
          <div className="section-header">
            <h2>Add-ons & Addons</h2>
            <p>Enhance your hosting with these optional add-ons.</p>
          </div>
          
          <div className="pricing-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {addons.map((addon, index) => (
              <div key={index} className="pricing-card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>
                  {addon.name}
                </h3>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--dark)" }}>
                  ${addon.price}<span style={{ fontSize: "0.875rem", fontWeight: "400", color: "var(--text-light)" }}>{addon.period}</span>
                </div>
              </div>
            ))}
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
