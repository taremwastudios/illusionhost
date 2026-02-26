"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  return (
    <>
      <section className="page-header">
        <h1>Login</h1>
        <p>Access your Illusionhost account.</p>
      </section>

      <section className="contact-section">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" />
                <span style={{ color: "var(--text)" }}>Remember me</span>
              </label>
              <a href="/forgot-password" style={{ color: "var(--primary)", textDecoration: "none" }}>Forgot password?</a>
            </div>
            
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
          
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-light)" }}>
            Don&apos;t have an account? <Link href="/signup" style={{ color: "var(--primary)", textDecoration: "none" }}>Sign up</Link>
          </p>
        </div>
      </section>
    </>
  );
}
