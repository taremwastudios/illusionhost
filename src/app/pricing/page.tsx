export default function PricingPage() {
  const hostingPlans = [
    {
      name: "Starter",
      price: 2,
      features: ["1 Website", "10 GB SSD", "Unlimited Bandwidth", "Free SSL", "Email Support"],
    },
    {
      name: "Professional",
      price: 12,
      features: ["Unlimited Websites", "50 GB SSD", "Unlimited Bandwidth", "Free SSL", "Priority Support", "Daily Backups"],
    },
    {
      name: "Business",
      price: 25,
      features: ["Unlimited Websites", "200 GB SSD", "Unlimited Bandwidth", "Free SSL", "24/7 Phone Support", "Hourly Backups", "CDN"],
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
            <p>High-performance hosting at affordable prices. All plans include free SSL!</p>
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

      {/* Hybrid Package Section */}
      <section className="container" style={{ padding: "4rem 2rem" }}>
        <div className="section-header">
          <h2>💎 Hybrid Package — Best Value!</h2>
          <p>Buy a domain first and get 50% off any hosting plan. Available for .com, .net, and .co domains.</p>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center",
          marginTop: "2rem"
        }}>
          <div style={{ 
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "1.5rem", 
            padding: "3rem",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 20px 60px -12px rgba(16, 185, 129, 0.4)",
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
                HYBRID PACKAGE
              </span>
              <h3 style={{ fontSize: "2rem", marginTop: "1rem", marginBottom: "0.5rem", color: "white", fontWeight: "700" }}>
                Domain + Hosting
              </h3>
              <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>
                Pay for domain first, get 50% off hosting!
              </p>
            </div>
            
            <div style={{ marginTop: "2rem" }}>
              <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Domain Registration (.com/.net/.co)
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> 50% Off Any Hosting Plan
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Free DNS Management
                </li>
                <li style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4ade80", fontWeight: "700" }}>✓</span> Free SSL Certificate
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
                color: "#059669",
                padding: "1rem 2rem",
                borderRadius: "2rem",
                fontWeight: "700",
                textDecoration: "none",
              }}>
                Search Domains →
              </a>
            </div>
          </div>
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
              { tld: ".co", price: 29.99, hybrid: true },
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
                  {domain.hybrid && (
                    <span style={{ background: "#d1fae5", color: "#065f46", padding: "0.125rem 0.5rem", borderRadius: "1rem", fontSize: "0.625rem", fontWeight: "600" }}>HYBRID</span>
                  )}
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

      <section className="pricing-section" style={{ background: "var(--light)" }}>
        <div className="pricing-container">
          <div className="section-header">
            <h2>Add-ons</h2>
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
