"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          <span className="logo-icon">◇</span>
          <span className="logo-text">Illusionhost</span>
        </Link>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/domains" className="nav-link">Domains</Link>
          <Link href="/hosting" className="nav-link">Hosting</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/transfer" className="nav-link">Transfer</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            <span className="cart-badge">0</span>
          </Link>
          <Link href="/login" className="nav-btn-secondary">Login</Link>
          <Link href="/signup" className="nav-btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
