import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './ProductContext';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sepet değiştikçe localStorage'a yaz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(item => item.Id === product.Id);
      if (found) {
        return prev.map(item => item.Id === product.Id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.Id !== id));
  };

  const increaseQty = (id: number) => {
    setCart(prev => prev.map(item => item.Id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQty = (id: number) => {
    setCart(prev => {
      const found = prev.find(item => item.Id === id);
      if (found && found.quantity === 1) {
        return prev.filter(item => item.Id !== id);
      }
      return prev.map(item => item.Id === id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}; 