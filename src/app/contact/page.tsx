"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <>
        <section className="page-header">
          <h1>Contact Us</h1>
          <p>We&apos;d love to hear from you. Get in touch with our team.</p>
        </section>
        
        <section className="container" style={{ textAlign: "center" }}>
          <div style={{ 
            background: "white", 
            padding: "4rem 2rem", 
            borderRadius: "1.5rem", 
            boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "var(--success)", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "2.5rem",
              margin: "0 auto 1.5rem"
            }}>✓</div>
            <h2 style={{ fontSize: "2rem", color: "var(--dark)", marginBottom: "1rem" }}>Message Sent!</h2>
            <p style={{ fontSize: "1.125rem", color: "var(--text-light)", marginBottom: "2rem" }}>
              Thank you for contacting us. We&apos;ll get back to you within 24 hours.
            </p>
            <Link href="/" className="nav-btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Back to Home
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-header">
        <h1>Contact Us</h1>
        <p>We&apos;d love to hear from you. Get in touch with our team.</p>
      </section>

      <section className="contact-section">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="sales">Sales Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="container">
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "2rem",
          marginTop: "2rem"
        }}>
          <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "1rem", boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📧</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>
              Email
            </h3>
            <p style={{ color: "var(--text-light)" }}>support@illusionhost.com</p>
            <p style={{ color: "var(--text-light)" }}>sales@illusionhost.com</p>
          </div>
          
          <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "1rem", boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📞</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>
              Phone
            </h3>
            <p style={{ color: "var(--text-light)" }}>1-800-ILLUSION</p>
            <p style={{ color: "var(--text-light)" }}>Mon-Fri, 9am-6pm EST</p>
          </div>
          
          <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "1rem", boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>
              Live Chat
            </h3>
            <p style={{ color: "var(--text-light)" }}>Available 24/7</p>
            <button style={{ 
              marginTop: "0.5rem",
              background: "var(--primary)", 
              color: "white", 
              border: "none", 
              padding: "0.5rem 1rem", 
              borderRadius: "0.5rem",
              cursor: "pointer"
            }}>Start Chat</button>
          </div>
        </div>
      </section>

      <section className="features" style={{ background: "var(--light)" }}>
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {[
            {
              q: "What are your support hours?",
              a: "Our support team is available 24/7 via live chat and email. Phone support is available Monday-Friday, 9am-6pm EST."
            },
            {
              q: "How do I transfer my domain to Illusionhost?",
              a: "Simply enter your domain name in the transfer search box, provide your auth code, and we'll handle the rest. Transfers typically complete within 5-7 days."
            },
            {
              q: "Do you offer money-back guarantees?",
              a: "Yes! We offer a 30-day money-back guarantee on all hosting plans. Domain registrations can be cancelled within 5 days for a full refund."
            },
            {
              q: "How do I get a free domain?",
              a: "All our hosting plans come with a free domain registration for the first year. Simply choose your hosting plan and select a domain during signup."
            }
          ].map((faq, index) => (
            <div key={index} style={{ 
              background: "white", 
              padding: "1.5rem", 
              borderRadius: "1rem", 
              marginBottom: "1rem",
              boxShadow: "0 2px 10px -4px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>
                {faq.q}
              </h3>
              <p style={{ color: "var(--text-light)" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
