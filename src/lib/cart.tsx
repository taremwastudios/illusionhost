"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItemType = {
  id: string;
  name: string;
  type: "domain" | "hosting" | "addon";
  price: number;
  period: string;
  details?: string;
};

type CartContextType = {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load cart from localStorage after hydration
    const saved = localStorage.getItem("illusionhost_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setItems(parsed);
          setIsLoaded(true);
        }, 0);
      } catch (e) {
        console.error("Failed to parse cart", e);
        setTimeout(() => setIsLoaded(true), 0);
      }
    } else {
      setTimeout(() => setIsLoaded(true), 0);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("illusionhost_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItemType) => {
    setItems((prev) => {
      // Don't add duplicates of same domain/plan
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
