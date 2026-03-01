"use client";

import { Server, Sparkles, Zap, Shield, Gem, Wrench, Phone, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            The Domain <span>Powerhouse</span>
          </h1>
          <p className="hero-subtitle">
            That&apos;s right — we GIVE domains away for FREE! The catch? Just get any hosting plan. All plans are suitable for any business but differ by standard and the firepower we give you. Are you a student? There&apos;s a package especially for you! That&apos;s right, you get a custom &quot;yourdomain.illusionhost.co&quot; for a whole year! What are you waiting for? Just make sure to read our Terms of Service and Privacy Policy on usage to make sure you are within our limits.
          </p>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a 
              href="/domains" 
              className="search-btn" 
              style={{ 
                borderRadius: '0.5rem',
                height: 'auto',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              Find Your Perfect Domain
            </a>
          </div>

          <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#9ca3af", maxWidth: "600px", margin: "2rem auto 0", lineHeight: "1.6" }}>
            We are a dedicated community that hopes to solve your business troubles, with a domain, hosting, multiple websites, dedicated website builder, large uptime, auto backup and a lot more, come join the illusion family trusted by thousands of users
          </p>
        </div>
      </section>

      {/* Domain Results */}

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose Illusionhost?</h2>
            <p>We provide everything you need to build and grow your online presence.</p>
          </div>
          
          <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap size={32} /></div>
            <h3>Lightning Fast</h3>
            <p>Our global CDN ensures your website loads fast anywhere in the world. 99.9% uptime guaranteed.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Shield size={32} /></div>
            <h3>Secure by Default</h3>
            <p>Free SSL certificates with every domain. Enterprise-grade DDoS protection included.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Gem size={32} /></div>
            <h3>Premium Domains</h3>
            <p>Access to exclusive premium domain names. Find the perfect brand for your business.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Wrench size={32} /></div>
            <h3>Easy Management</h3>
            <p>Intuitive control panel to manage all your domains, hosting, and email in one place.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Phone size={32} /></div>
            <h3>24/7 Expert Support</h3>
            <p>Our support team is available around the clock to help you with any questions.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><DollarSign size={32} /></div>
            <h3>Best Price Guarantee</h3>
            <p>Found a better price? We&apos;ll match it. Plus, enjoy transparent pricing with no hidden fees.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Server size={32} /></div>
            <h3>Full VPS Support</h3>
            <p>Scale your infrastructure with powerful VPS solutions. Full root access, dedicated resources, and instant provisioning.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Sparkles size={32} /></div>
            <h3>AI Automation</h3>
            <p>Leverage cutting-edge AI to automate deployments, optimize performance, and manage your infrastructure intelligently.</p>
          </div>
        </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Your domain is FREE with any hosting plan — just keep your plan active!</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">24</span>
                  <span className="pricing-period">/year</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>1 Website</li>
                <li>10 GB SSD Storage</li>
                <li>Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Unlimited Bandwidth</li>
                <li>Email Support</li>
              </ul>
              <a href="/pricing" className="pricing-btn secondary">View Details</a>
            </div>
            
            <div className="pricing-card featured">
              <div className="pricing-header">
                <h3 className="pricing-name">Professional</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">144</span>
                  <span className="pricing-period">/year</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited Websites</li>
                <li>50 GB SSD Storage</li>
                <li>Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Unlimited Bandwidth</li>
                <li>Priority Support</li>
                <li>Daily Backups</li>
              </ul>
              <a href="/pricing" className="pricing-btn primary">View Details</a>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Business</h3>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">300</span>
                  <span className="pricing-period">/year</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>Unlimited Websites</li>
                <li>200 GB SSD Storage</li>
                <li>Free Domain</li>
                <li>Free SSL Certificate</li>
                <li>Unlimited Bandwidth</li>
                <li>24/7 Phone Support</li>
                <li>Hourly Backups</li>
                <li>CDN Included</li>
              </ul>
              <a href="/pricing" className="pricing-btn secondary">View Details</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
