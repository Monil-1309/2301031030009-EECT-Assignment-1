import React, { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image_url: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newItems));
    }
  };

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
      );
      let updated;
      if (idx > -1) {
        updated = prev.map((i, j) =>
          j === idx ? { ...i, quantity: item.quantity } : i
        );
      } else {
        updated = [...prev, item];
      }
      persist(updated);
      return updated;
    });
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    const updated = items.filter(
      (i) => !(i.id === id && i.size === size && i.color === color)
    );
    persist(updated);
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    const updated = items.map((i) =>
      i.id === id && i.size === size && i.color === color
        ? { ...i, quantity }
        : i
    );
    persist(updated);
  };

  const clearCart = () => {
    persist([]);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
