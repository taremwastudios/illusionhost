"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Submitting form with:", { name: formData.name, email: formData.email });

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("Calling signup server action...");
      const result = await signup(formData.name, formData.email, formData.password);
      console.log("Signup result:", result);

      if (result.success) {
        router.push("/login?registered=true");
      } else {
        setError(result.error || "Failed to create account");
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup exception:", err);
      setError("An unexpected error occurred. Check console for details.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <section className="page-header">
        <h1>Create Account</h1>
        <p>Join Illusionhost and start building your online presence.</p>
      </section>

      <section className="contact-section">
        <div className="contact-form">
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
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" required style={{ marginTop: "0.25rem" }} />
                <span style={{ color: "var(--text)", fontSize: "0.875rem" }}>
                  I agree to the <a href="/terms" style={{ color: "var(--primary)" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "var(--primary)" }}>Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-light)" }}>
            Already have an account? <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none" }}>Login</Link>
          </p>
        </div>
      </section>
    </>
  );
}
