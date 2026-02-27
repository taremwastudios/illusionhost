"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";

export default function CartButton() {
  const { items } = useCart();
  const count = items.length;

  return (
    <Link 
      href="/cart" 
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem",
        color: "var(--text-light)",
        textDecoration: "none",
        transition: "color 0.2s"
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="m1 1 4 4 .5 2"></path>
        <path d="M5.5 7h13.79a1 1 0 0 1 .99 1.14l-1.43 10a1 1 0 0 1-.99.86H8.14a1 1 0 0 1-.99-.86L5.5 7Z"></path>
      </svg>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            background: "var(--primary)",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            fontSize: "11px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
