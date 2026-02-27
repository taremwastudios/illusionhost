"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function getStoredUser(): User | null {
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

function useUser() {
  // Use ref to track if component has mounted
  const mountedRef = useRef(false);
  
  // Use lazy initializer to read from localStorage only after mount (prevents hydration mismatch)
  const [user, setUser] = useState<User | null>(() => {
    // During SSR, always return null
    return null;
  });

  useEffect(() => {
    // Mark as mounted
    mountedRef.current = true;
    
    // Use setTimeout to defer the localStorage read until after hydration
    // This avoids calling setState synchronously in the effect body
    const timer = setTimeout(() => {
      setUser(getStoredUser());
    }, 0);
    
    // Listen for storage changes from other tabs
    const handleStorage = () => {
      setUser(getStoredUser());
    };

    // Listen for custom login/logout events
    const handleLogin = () => setUser(getStoredUser());
    const handleLogout = () => setUser(null);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  return user;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUser();
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
