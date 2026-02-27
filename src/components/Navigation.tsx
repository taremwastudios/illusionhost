"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

// External store for auth state
function getUserFromStorage() {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  }
  return null;
}

const userStore = {
  getSnapshot: () => getUserFromStorage(),
  getServerSnapshot: () => null,
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener("login", callback);
    window.addEventListener("logout", callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("login", callback);
      window.removeEventListener("logout", callback);
    };
  },
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot, userStore.getServerSnapshot);
  const isLoggedIn = user !== null;

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
          <Link href="/email" className="nav-link">Email</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            <span className="cart-badge">0</span>
          </Link>
          {isLoggedIn && user ? (
            <Link href="/account" className="nav-btn-secondary">
              {user.name || user.email}
            </Link>
          ) : (
            <>
              <Link href="/login" className="nav-btn-secondary">Login</Link>
              <Link href="/signup" className="nav-btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
