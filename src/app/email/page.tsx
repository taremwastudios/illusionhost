"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function EmailPage() {
  const [domain, setDomain] = useState("");
  const [showRecords, setShowRecords] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      setShowRecords(true);
    }
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
      <Navigation />

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
                <h3>MX Records</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th>Host</th>
                      <th>Value</th>
                      <th>TTL</th>
                      <th>Action</th>
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

              <div className="records-table">
                <h3>SPF Record (Recommended)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Type</th>
                      <th>Value</th>
                      <th>TTL</th>
                      <th>Action</th>
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
                  </tbody>
                </table>
              </div>

              <div className="records-table">
                <h3>DKIM Record (Optional)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Type</th>
                      <th>Value</th>
                      <th>TTL</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
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
                <h4>How to add these records:</h4>
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
        </section>
      )}

      {/* Email Providers Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Supported Email Providers</h2>
          <div className="providers-grid">
            <div className="provider-card">
              <h3>Google Workspace</h3>
              <p>
                Professional email with Gmail. Includes 30GB storage and
                business tools.
              </p>
              <span className="price">From $6/month</span>
            </div>
            <div className="provider-card">
              <h3>Microsoft 365</h3>
              <p>
                Business email with Outlook. Includes Office apps and 1TB
                OneDrive.
              </p>
              <span className="price">From $5/month</span>
            </div>
            <div className="provider-card">
              <h3>Proton Mail</h3>
              <p>
                Secure, encrypted email. Privacy-focused with end-to-end
                encryption.
              </p>
              <span className="price">From $5/month</span>
            </div>
            <div className="provider-card">
              <h3>Zoho Mail</h3>
              <p>
                Business email with collaboration tools. Great for small
                businesses.
              </p>
              <span className="price">From $2/month</span>
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

      <Footer />
    </div>
  );
}
