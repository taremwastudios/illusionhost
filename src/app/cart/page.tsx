"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

type PaymentMethod = "card" | "crypto";

// Hosting plan free domain quotas
const HOSTING_QUOTAS: Record<string, number> = {
  "Starter Hosting": 1,
  "Professional Hosting": 3,
  "Business Hosting": 5,
};

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hostingPlan, setHostingPlan] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Get user's purchased items to check for hosting plan
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
    
    // Check purchased items for hosting plan - read directly and set initial state
    const purchasedItems = JSON.parse(localStorage.getItem("purchased_items") || "[]");
    const existingHosting = purchasedItems.find((item: any) => item.type === "hosting");
    if (existingHosting) {
      // Use a timeout to avoid calling setState in useEffect body
      setTimeout(() => setHostingPlan(existingHosting.name), 0);
    }
  }, []);

  // Check cart for hosting plan
  const cartHasHosting = items.some(item => item.type === "hosting");
  const cartHostingPlan = items.find(item => item.type === "hosting");
  
  // Get current effective hosting plan (from cart or purchased)
  const effectiveHostingPlan = cartHostingPlan?.name || hostingPlan;
  const freeDomainsQuota = effectiveHostingPlan ? HOSTING_QUOTAS[effectiveHostingPlan] || 0 : 0;
  
  // Count domains in cart
  const domainItems = items.filter(item => item.type === "domain");
  const domainCount = domainItems.length;
  
  // Calculate how many domains can be free
  const domainsWithHosting = cartHasHosting || hostingPlan;
  const freeDomainCount = domainsWithHosting ? Math.min(domainCount, freeDomainsQuota) : 0;
  const paidDomainCount = domainCount - freeDomainCount;
  
  // Calculate total with free domains applied
  const domainTotal = domainItems.reduce((sum, item) => sum + item.price, 0);
  const hostingTotal = items.filter(item => item.type === "hosting").reduce((sum, item) => sum + item.price, 0);
  const totalWithFreeDomains = hostingTotal + domainTotal - (freeDomainCount * 9.99); // Assume $9.99 per domain

  const handleCheckout = async () => {
    // Check if trying to checkout domains without hosting
    const hasDomains = items.some(item => item.type === "domain");
    const hasHostingInCart = items.some(item => item.type === "hosting");
    
    if (hasDomains && !hasHostingInCart && !hostingPlan) {
      setDomainError("You need a hosting plan to register a domain. Please add a hosting plan to your cart first.");
      return;
    }
    
    if (!user) {
      alert("Please login to complete your purchase");
      return;
    }
    
    setIsProcessing(true);
    setDomainError(null);
    setPaymentError(null);
    
    // If paying with crypto, use NOWPayments
    if (paymentMethod === "crypto") {
      try {
        const orderTotal = domainsWithHosting ? totalWithFreeDomains : total;
        
        if (orderTotal <= 0) {
          // Free order - process immediately
          await processFreeOrder();
          return;
        }
        
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, user }),
        });
        
        const paymentData = await response.json();
        
        if (paymentData.mockPayment) {
          // Mock payment for demo
          console.log("Mock crypto payment:", paymentData);
          await processFreeOrder();
          return;
        }
        
        if (paymentData.success && paymentData.payUrl) {
          // Redirect to crypto payment
          window.location.href = paymentData.payUrl;
          return;
        } else {
          throw new Error(paymentData.error || "Failed to create payment");
        }
      } catch (error: any) {
        console.error("Crypto payment error:", error);
        setPaymentError(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }
    }
    
    // Credit card payment (original flow)
    await processFreeOrder();
  };
  
  const processFreeOrder = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save purchased items to user account
    const purchasedItems = JSON.parse(localStorage.getItem("purchased_items") || "[]");
    const newItems = items.map(item => ({
      ...item,
      // Make domains free if user has hosting
      price: item.type === "domain" && domainsWithHosting ? 0 : item.price,
      purchaseDate: new Date().toISOString(),
      status: "active",
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    localStorage.setItem("purchased_items", JSON.stringify([...purchasedItems, ...newItems]));
    
    // If purchasing hosting, update the hosting plan
    if (cartHostingPlan) {
      setHostingPlan(cartHostingPlan.name);
    }
    
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
              {items.map((item, index) => {
                // Determine if this domain is free
                const isFreeDomain = item.type === "domain" && domainsWithHosting;
                const domainIndex = items.filter(i => i.type === "domain").indexOf(item);
                const isWithinQuota = isFreeDomain && domainIndex < freeDomainsQuota;
                
                return (
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
                      <div style={{ fontWeight: "600", color: "var(--dark)" }}>
                        {item.name}
                        {isWithinQuota && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#10b981", background: "#ecfdf5", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>FREE</span>}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {item.type === "domain" && "Domain Registration"}
                        {item.type === "hosting" && item.details}
                        {item.type === "addon" && item.details}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "600", color: isWithinQuota ? "#10b981" : "var(--dark)" }}>
                        {isWithinQuota ? "FREE" : `$${item.price}`}
                      </div>
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
              )})}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: "white", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "1.5rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--dark)", marginBottom: "1.5rem" }}>
              Order Summary
            </h2>
            
            {/* Domain error message */}
            {domainError && (
              <div style={{ 
                background: "#fef3c7", 
                padding: "0.75rem", 
                borderRadius: "0.5rem", 
                marginBottom: "1rem",
                fontSize: "0.875rem",
                color: "#92400e"
              }}>
                ⚠️ {domainError}
                <Link href="/hosting" style={{ display: "block", marginTop: "0.5rem", color: "#b45309", fontWeight: "600" }}>
                  View Hosting Plans →
                </Link>
              </div>
            )}
            
            {/* Hosting requirement info */}
            {domainItems.length > 0 && !domainsWithHosting && (
              <div style={{ 
                background: "#eff6ff", 
                padding: "0.75rem", 
                borderRadius: "0.5rem", 
                marginBottom: "1rem",
                fontSize: "0.875rem",
                color: "#1e40af"
              }}>
                🔒 Domains require a hosting plan. Add hosting to get domains for free!
              </div>
            )}
            
            {/* Free domains applied */}
            {domainsWithHosting && freeDomainCount > 0 && (
              <div style={{ 
                background: "#ecfdf5", 
                padding: "0.75rem", 
                borderRadius: "0.5rem", 
                marginBottom: "1rem",
                fontSize: "0.875rem",
                color: "#065f46"
              }}>
                🎉 {freeDomainCount} {freeDomainCount === 1 ? "domain" : "domains"} free with {effectiveHostingPlan}!
              </div>
            )}
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "var(--text-light)" }}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {freeDomainCount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "#10b981" }}>
                <span>Free Domains ({freeDomainCount} × $9.99)</span>
                <span>-${(freeDomainCount * 9.99).toFixed(2)}</span>
              </div>
            )}
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
                <span>${(domainsWithHosting ? totalWithFreeDomains : total).toFixed(2)}</span>
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

            {/* Payment Method Selection */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #eee" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.75rem" }}>
                Payment Method:
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => setPaymentMethod("card")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: paymentMethod === "card" ? "2px solid var(--primary)" : "2px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    background: paymentMethod === "card" ? "#f0f9ff" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>💳</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: paymentMethod === "card" ? "var(--primary)" : "var(--dark)" }}>Credit Card</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: paymentMethod === "crypto" ? "2px solid #f97316" : "2px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    background: paymentMethod === "crypto" ? "#fff7ed" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>₿</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: paymentMethod === "crypto" ? "#f97316" : "var(--dark)" }}>Crypto</div>
                </button>
              </div>
              
              {/* Crypto payment info */}
              {paymentMethod === "crypto" && (
                <div style={{ 
                  background: "#fff7ed", 
                  padding: "0.75rem", 
                  borderRadius: "0.5rem", 
                  marginTop: "0.75rem",
                  fontSize: "0.75rem",
                  color: "#9a3412"
                }}>
                  <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Pay with Cryptocurrency</div>
                  <div>Pay with USDT, BTC, ETH, and 50+ other cryptocurrencies via NOWPayments</div>
                </div>
              )}
              
              {/* Payment error */}
              {paymentError && (
                <div style={{ 
                  background: "#fef2f2", 
                  padding: "0.75rem", 
                  borderRadius: "0.5rem", 
                  marginTop: "0.75rem",
                  fontSize: "0.875rem",
                  color: "#dc2626"
                }}>
                  ⚠️ {paymentError}
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !user}
              style={{
                width: "100%",
                padding: "1rem",
                background: user ? (paymentMethod === "crypto" ? "#f97316" : "var(--primary)") : "#9ca3af",
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
                  {paymentMethod === "crypto" ? "Processing Crypto Payment..." : "Processing..."}
                </>
              ) : (
                paymentMethod === "crypto" ? "Pay with Crypto" : "Complete Purchase"
              )}
            </button>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                {paymentMethod === "crypto" ? "🔒 Secure crypto payment via NOWPayments" : "🔒 Secure checkout - 30-day money back guarantee"}
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                Accepted payment methods:
              </p>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "1.5rem" }}>
                {paymentMethod === "crypto" ? (
                  <>
                    <span title="Bitcoin">₿</span>
                    <span title="Ethereum">Ξ</span>
                    <span title="USDT">₮</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-light)", alignSelf: "center" }}>+ more</span>
                  </>
                ) : (
                  <>
                    💳 💵 🏦
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
