export default function PricingPage() {
  const hostingPlans = [
    {
      name: "Starter",
      price: 2,
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
            <p>All plans include a FREE domain — yours forever! Just keep your plan active.</p>
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
          <p>Your domain is FREE with any active hosting plan!</p>
        </div>
        
        <div style={{ 
          background: "white", 
          borderRadius: "1rem", 
          padding: "2rem",
          boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎁</div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--dark)" }}>Free Domain Included!</h3>
          <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
            All hosting plans come with a free domain registration. Search for your perfect domain and claim it for free when you sign up!
          </p>
          <a href="/domains" className="nav-btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
            Find Your Free Domain
          </a>
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
