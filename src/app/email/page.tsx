"use client";

import { useState } from "react";

export default function EmailPage() {
  const [domain, setDomain] = useState("");
  const [showRecords, setShowRecords] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      setShowRecords(true);
    }
  };

  const toggleCard = (cardName: string) => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  const mxRecords = [
    {
      priority: 10,
      host: "@",
      value: "ASPMX.L.GOOGLE.COM",
      ttl: 3600,
    },
    {
      priority: 20,
      host: "@",
      value: "ALT1.ASPMX.L.GOOGLE.COM",
      ttl: 3600,
    },
    {
      priority: 20,
      host: "@",
      value: "ALT2.ASPMX.L.GOOGLE.COM",
      ttl: 3600,
    },
    {
      priority: 30,
      host: "@",
      value: "ALT3.ASPMX.L.GOOGLE.COM",
      ttl: 3600,
    },
    {
      priority: 30,
      host: "@",
      value: "ALT4.ASPMX.L.GOOGLE.COM",
      ttl: 3600,
    },
  ];

  const spfRecord = {
    host: "@",
    type: "TXT",
    value: "v=spf1 include:_spf.google.com ~all",
    ttl: 3600,
  };

  const dkimRecord = {
    host: "google._domainkey",
    type: "TXT",
    value: "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE",
    ttl: 3600,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Custom Email Service</h1>
          <p className="hero-subtitle">
            Configure MX Records to use your own domain for professional email
          </p>
        </div>
      </section>

      {/* Domain Check Section */}
      <section className="section">
        <div className="container">
          <div className="card">
            <h2 className="section-title">Check Your Domain</h2>
            <form onSubmit={handleCheck} className="search-form">
              <input
                type="text"
                placeholder="Enter your domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="search-input"
                required
              />
              <button type="submit" className="btn btn-primary">
                Get MX Records
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MX Records Section */}
      {showRecords && (
        <section className="section">
          <div className="container">
            <div className="card">
              <h2 className="section-title">MX Records for {domain}</h2>
              <p className="section-description">
                Add the following records to your DNS settings to configure
                custom email for your domain.
              </p>

              <div className="records-table">
                <h3>DNS Records</h3>
                <div className="records-group">
                  <h4>MX Records</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Priority</th>
                        <th>Host</th>
                        <th>Value</th>
                        <th>TTL</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mxRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{record.priority}</td>
                          <td>{record.host}</td>
                          <td className="record-value">{record.value}</td>
                          <td>{record.ttl}</td>
                          <td>
                            <button
                              onClick={() => copyToClipboard(record.value)}
                              className="btn-small"
                            >
                              Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="records-group">
                  <h4>SPF & DKIM</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Host</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>TTL</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{spfRecord.host}</td>
                        <td>{spfRecord.type}</td>
                        <td className="record-value">{spfRecord.value}</td>
                        <td>{spfRecord.ttl}</td>
                        <td>
                          <button
                            onClick={() => copyToClipboard(spfRecord.value)}
                            className="btn-small"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{dkimRecord.host}</td>
                        <td>{dkimRecord.type}</td>
                        <td className="record-value">{dkimRecord.value}</td>
                        <td>{dkimRecord.ttl}</td>
                        <td>
                          <button
                            onClick={() => copyToClipboard(dkimRecord.value)}
                            className="btn-small"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="info-box">
                  <h4>Setup Instructions</h4>
                  <ol>
                    <li>Log in to your DNS provider dashboard</li>
                    <li>Navigate to DNS settings or zone file editor</li>
                    <li>Add each MX record with the values shown above</li>
                    <li>Add the SPF record to prevent email spoofing</li>
                    <li>Wait up to 24 hours for DNS propagation</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Email Providers Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Choose Your Email Provider</h2>
          <p className="section-description">
            Connect your domain with leading email services. Each provider offers unique features.
          </p>
          <div className="pricing-grid">
            {/* Google Workspace */}
            <div 
              className={`pricing-card featured ${expandedCard === 'google' ? 'expanded' : ''}`}
              onClick={() => toggleCard('google')}
            >
              <div className="pricing-badge">Most Popular</div>
              <h3>Google Workspace</h3>
              <div className="price">
                <span className="amount">$6</span>
                <span className="period">/user/mo</span>
              </div>
              <p className="price-description">Professional email with Gmail interface</p>
              <ul className="features-list">
                <li>✓ Custom email @yourdomain.com</li>
                <li>✓ 30GB cloud storage</li>
                <li>✓ Google Meet (100 participants)</li>
                <li>✓ Google Docs, Sheets, Slides</li>
                <li>✓ Spam & phishing protection</li>
              </ul>
              {expandedCard === 'google' && (
                <div className="card-details">
                  <h4>Setup Instructions</h4>
                  <ol>
                    <li>Sign up for Google Workspace</li>
                    <li>Verify domain ownership</li>
                    <li>Add MX records (shown above)</li>
                    <li>Create user accounts</li>
                  </ol>
                  <button className="btn btn-primary btn-full" onClick={(e) => e.stopPropagation()}>Get Started</button>
                </div>
              )}
              <button className={`btn ${expandedCard === 'google' ? 'btn-secondary' : 'btn-primary'} btn-full`} onClick={(e) => e.stopPropagation()}>
                {expandedCard === 'google' ? 'Close' : 'Configure'}
              </button>
            </div>

            {/* Microsoft 365 */}
            <div 
              className={`pricing-card ${expandedCard === 'microsoft' ? 'expanded' : ''}`}
              onClick={() => toggleCard('microsoft')}
            >
              <h3>Microsoft 365</h3>
              <div className="price">
                <span className="amount">$5</span>
                <span className="period">/user/mo</span>
              </div>
              <p className="price-description">Business email with Outlook</p>
              <ul className="features-list">
                <li>✓ Custom email @yourdomain.com</li>
                <li>✓ 1TB OneDrive storage</li>
                <li>✓ Full Office suite apps</li>
                <li>✓ Teams video meetings</li>
                <li>✓ Advanced threat protection</li>
              </ul>
              {expandedCard === 'microsoft' && (
                <div className="card-details">
                  <h4>Setup Instructions</h4>
                  <ol>
                    <li>Sign up for Microsoft 365</li>
                    <li>Add domain to Microsoft admin</li>
                    <li>Configure MX records</li>
                    <li>Set up user licenses</li>
                  </ol>
                  <button className="btn btn-primary btn-full" onClick={(e) => e.stopPropagation()}>Get Started</button>
                </div>
              )}
              <button className={`btn ${expandedCard === 'microsoft' ? 'btn-primary' : 'btn-secondary'} btn-full`} onClick={(e) => e.stopPropagation()}>
                {expandedCard === 'microsoft' ? 'Close' : 'Configure'}
              </button>
            </div>

            {/* Proton Mail */}
            <div 
              className={`pricing-card ${expandedCard === 'proton' ? 'expanded' : ''}`}
              onClick={() => toggleCard('proton')}
            >
              <h3>Proton Mail</h3>
              <div className="price">
                <span className="amount">$5</span>
                <span className="period">/user/mo</span>
              </div>
              <p className="price-description">Privacy-first encrypted email</p>
              <ul className="features-list">
                <li>✓ Custom email @yourdomain.com</li>
                <li>✓ End-to-end encryption</li>
                <li>✓ No tracking or ads</li>
                <li>✓ Secure calendar</li>
                <li>✓ Based in Switzerland</li>
              </ul>
              {expandedCard === 'proton' && (
                <div className="card-details">
                  <h4>Setup Instructions</h4>
                  <ol>
                    <li>Create Proton Business plan</li>
                    <li>Add custom domain</li>
                    <li>Configure DNS records</li>
                    <li>Set up encryption keys</li>
                  </ol>
                  <button className="btn btn-primary btn-full" onClick={(e) => e.stopPropagation()}>Get Started</button>
                </div>
              )}
              <button className={`btn ${expandedCard === 'proton' ? 'btn-primary' : 'btn-secondary'} btn-full`} onClick={(e) => e.stopPropagation()}>
                {expandedCard === 'proton' ? 'Close' : 'Configure'}
              </button>
            </div>

            {/* Zoho Mail */}
            <div 
              className={`pricing-card ${expandedCard === 'zoho' ? 'expanded' : ''}`}
              onClick={() => toggleCard('zoho')}
            >
              <h3>Zoho Mail</h3>
              <div className="price">
                <span className="amount">$2</span>
                <span className="period">/user/mo</span>
              </div>
              <p className="price-description">Business email with collaboration</p>
              <ul className="features-list">
                <li>✓ Custom email @yourdomain.com</li>
                <li>✓ 5GB storage per user</li>
                <li>✓ Built-in workspace suite</li>
                <li>✓ Zoho CRM integration</li>
                <li>✓ Ad-free experience</li>
              </ul>
              {expandedCard === 'zoho' && (
                <div className="card-details">
                  <h4>Setup Instructions</h4>
                  <ol>
                    <li>Sign up for Zoho Mail</li>
                    <li>Add and verify domain</li>
                    <li>Update DNS settings</li>
                    <li>Create mailboxes</li>
                  </ol>
                  <button className="btn btn-primary btn-full" onClick={(e) => e.stopPropagation()}>Get Started</button>
                </div>
              )}
              <button className={`btn ${expandedCard === 'zoho' ? 'btn-primary' : 'btn-secondary'} btn-full`} onClick={(e) => e.stopPropagation()}>
                {expandedCard === 'zoho' ? 'Close' : 'Configure'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Use Custom Email?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Professional Appearance</h3>
              <p>
                Use your domain name in your email address for a professional
                look
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Brand Recognition</h3>
              <p>
                Every email you send promotes your brand
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Full Control</h3>
              <p>
                You own your email accounts and can manage them as you wish
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Reliability</h3>
              <p>
                Professional email services offer 99.9% uptime and spam
                protection
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
