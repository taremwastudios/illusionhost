"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setUser(parsed), 0);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to complete your purchase");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save purchased items to user account
    const purchasedItems = JSON.parse(localStorage.getItem("purchased_items") || "[]");
    const newItems = items.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      status: "active",
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    localStorage.setItem("purchased_items", JSON.stringify([...purchasedItems, ...newItems]));
    
    clearCart();
    setIsProcessing(false);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <>
        <section className="page-header">
          <h1>Order Complete!</h1>
          <p>Thank you for your purchase.</p>
        </section>

        <section className="container">
          <div style={{ 
            background: "white", 
            padding: "3rem", 
            borderRadius: "1rem", 
            boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
              Your order has been placed successfully!
            </h2>
            <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
              You can now manage your domains and services from your dashboard.
            </p>
            <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>
              A confirmation email has been sent to {user?.email}
            </p>
            <Link href="/account" className="domain-action-btn">
              Go to Dashboard
            </Link>
          </div>
        </section>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <section className="page-header">
          <h1>Shopping Cart</h1>
          <p>Manage your domain and hosting purchases.</p>
        </section>

        <section className="container">
          <div style={{ 
            background: "white", 
            padding: "3rem", 
            borderRadius: "1rem", 
            boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
              Your cart is empty
            </h2>
            <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>
              Browse our domain names and hosting plans to get started.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/domains" className="domain-action-btn">Search Domains</Link>
              <Link href="/hosting" className="domain-action-btn" style={{ background: "var(--dark-secondary)" }}>View Hosting</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-header">
        <h1>Shopping Cart</h1>
        <p>Review your domain and hosting purchases.</p>
      </section>

      <section className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem" }}>
          {/* Cart Items */}
          <div style={{ background: "white", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #eee" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)" }}>
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </h2>
            </div>
            
            <div style={{ padding: "1rem" }}>
              {items.map((item, index) => (
                <div 
                  key={item.id}
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "1rem",
                    background: index > 0 ? "#f9fafb" : "white",
                    borderRadius: "0.5rem",
                    marginBottom: index < items.length - 1 ? "0.5rem" : 0
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "0.5rem",
                      background: item.type === "domain" ? "#ede9fe" : item.type === "hosting" ? "#dbeafe" : "#fef3c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem"
                    }}>
                      {item.type === "domain" ? "🌐" : item.type === "hosting" ? "🖥️" : "➕"}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", color: "var(--dark)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {item.type === "domain" && "Domain Registration"}
                        {item.type === "hosting" && item.details}
                        {item.type === "addon" && item.details}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "600", color: "var(--dark)" }}>${item.price}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{item.period}</div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                        color: "#ef4444",
                        fontSize: "1.25rem"
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: "white", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "1.5rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "1.5rem" }}>
              Order Summary
            </h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "var(--text-light)" }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--text-light)" }}>
              <span>ICANN Fee</span>
              <span>$0.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", color: "var(--text-light)" }}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            
            <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "1.25rem", color: "var(--dark)" }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {!user && (
              <div style={{ 
                background: "#fef3c7", 
                padding: "0.75rem", 
                borderRadius: "0.5rem", 
                marginBottom: "1rem",
                fontSize: "0.875rem",
                color: "#92400e"
              }}>
                Please <Link href="/login" style={{ color: "#b45309", fontWeight: "600" }}>login</Link> to complete your purchase
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !user}
              style={{
                width: "100%",
                padding: "1rem",
                background: user ? "var(--primary)" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: user && !isProcessing ? "pointer" : "not-allowed",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              {isProcessing ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
                  Processing...
                </>
              ) : (
                "Complete Purchase"
              )}
            </button>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                🔒 Secure checkout - 30-day money back guarantee
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                Accepted payment methods:
              </p>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "1.5rem" }}>
                💳 💵 🏦
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
