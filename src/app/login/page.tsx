"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success && result.user) {
      // Store user info in localStorage for simplicity
      // In production, you'd use proper session management
      localStorage.setItem("user", JSON.stringify(result.user));
      router.push("/");
    } else {
      setError(result.error || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-header">
        <h1>Login</h1>
        <p>Access your Illusionhost account.</p>
      </section>

      <section className="contact-section">
        <div className="contact-form">
          {registered && (
            <div style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid #22c55e",
              borderRadius: "0.5rem",
              color: "#22c55e",
              fontSize: "0.875rem"
            }}>
              Account created successfully! Please login with your credentials.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: "0.75rem",
                marginBottom: "1rem",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #ef4444",
                borderRadius: "0.5rem",
                color: "#ef4444",
                fontSize: "0.875rem"
              }}>
                {error}
              </div>
            )}
            
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
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
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
