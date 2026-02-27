export default function PricingPage() {
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
