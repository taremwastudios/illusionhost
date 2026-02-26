export default function PricingPage() {
  const domainPricing = [
    { ext: ".com", price: 12.99, renewal: 14.99 },
    { ext: ".net", price: 9.99, renewal: 12.99 },
    { ext: ".org", price: 11.99, renewal: 14.99 },
    { ext: ".io", price: 49.99, renewal: 59.99 },
    { ext: ".app", price: 14.99, renewal: 17.99 },
    { ext: ".dev", price: 14.99, renewal: 17.99 },
    { ext: ".co", price: 29.99, renewal: 34.99 },
    { ext: ".ai", price: 79.99, renewal: 89.99 },
    { ext: ".xyz", price: 2.99, renewal: 4.99 },
    { ext: ".online", price: 3.99, renewal: 5.99 },
    { ext: ".site", price: 3.99, renewal: 5.99 },
    { ext: ".store", price: 4.99, renewal: 6.99 },
  ];

  const hostingPlans = [
    {
      name: "Starter",
      price: 5,
      features: ["1 Website", "10 GB SSD", "Unlimited Bandwidth", "Free Domain", "Free SSL", "Email Support"],
    },
    {
      name: "Professional",
      price: 12,
      features: ["Unlimited Websites", "50 GB SSD", "Unlimited Bandwidth", "Free Domain", "Free SSL", "Priority Support", "Daily Backups"],
    },
    {
      name: "Business",
      price: 25,
      features: ["Unlimited Websites", "200 GB SSD", "Unlimited Bandwidth", "Free Domain", "Free SSL", "24/7 Phone Support", "Hourly Backups", "CDN"],
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
            <p>All plans include free domain registration and SSL certificate.</p>
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
          <h2>Domain Pricing</h2>
          <p>Register your perfect domain today.</p>
        </div>
        
        <div style={{ 
          background: "white", 
          borderRadius: "1rem", 
          overflow: "hidden",
          boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--light)" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Extension</th>
                <th style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: "var(--dark)" }}>Registration</th>
                <th style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: "var(--dark)" }}>Renewal</th>
                <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "var(--dark)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {domainPricing.map((domain, index) => (
                <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem", fontWeight: "600", color: "var(--dark)" }}>{domain.ext}</td>
                  <td style={{ padding: "1rem", textAlign: "right", color: "var(--dark)" }}>${domain.price}/yr</td>
                  <td style={{ padding: "1rem", textAlign: "right", color: "var(--text-light)" }}>${domain.renewal}/yr</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button className="domain-action-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Register</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
