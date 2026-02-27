export default function HostingPage() {
  const hostingPlans = [
    {
      name: "Starter Hosting",
      price: 2,
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
      price: 12,
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
      price: 25,
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
      price: 15,
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
        <h1>Web Hosting Services</h1>
        <p>Lightning-fast hosting with 99.9% uptime guarantee. Start your website today.</p>
      </section>

      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>Choose Your Hosting Plan</h2>
            <p>All plans include free domain, SSL, and 99.9% uptime guarantee.</p>
          </div>
          
          <div className="pricing-grid">
            {hostingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
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
                <a href="/signup" className={`pricing-btn ${plan.popular ? 'primary' : 'secondary'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
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
      </section>
    </>
  );
}
