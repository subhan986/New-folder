"use client";

import type { CartItem, Product } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const previousCart = useRef<CartItem[]>([]);
  
  useEffect(() => {
    const storedCart = localStorage.getItem('demporium_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('demporium_cart', JSON.stringify(cart));

    const totalQuantity = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
    const prevTotalQuantity = previousCart.current.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

    if (totalQuantity > prevTotalQuantity) {
        const newOrUpdatedItem = cart.find((item: CartItem) => {
            const prevItem = previousCart.current.find((p: CartItem) => p.id === item.id);
            return !prevItem || item.quantity > prevItem.quantity;
        });
        if (newOrUpdatedItem) {
            toast({ title: "Added to cart", description: `${newOrUpdatedItem.name} has been added to your cart.` });
        }
    } else if (totalQuantity < prevTotalQuantity) {
        const removedOrUpdatedItem = previousCart.current.find((item: CartItem) => {
            const currentItem = cart.find((c: CartItem) => c.id === item.id);
            return !currentItem || (currentItem && item.quantity > currentItem.quantity);
        });
        if (removedOrUpdatedItem) {
            toast({ title: "Removed from cart", description: `${removedOrUpdatedItem.name} has been removed from your cart.` });
        }
    }


    previousCart.current = cart;
  }, [cart, toast]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find((item: CartItem) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item: CartItem) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart: CartItem[]) => prevCart.filter((item: CartItem) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) => (item.id === productId ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const cartTotal = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count: number, item: CartItem) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
