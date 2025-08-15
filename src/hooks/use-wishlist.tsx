
"use client";

import type { Product } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { toast } = useToast();
  const previousWishlist = useRef<Product[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('demporium_wishlist');
    if (storedWishlist) {
        const parsedWishlist = JSON.parse(storedWishlist);
        setWishlist(parsedWishlist);
        previousWishlist.current = parsedWishlist;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('demporium_wishlist', JSON.stringify(wishlist));
    
    // Compare current wishlist with the previous one to determine if an item was added or removed
    if (wishlist.length > previousWishlist.current.length) {
        const newProduct = wishlist.find(p => !previousWishlist.current.some(prev => prev.id === p.id));
        if (newProduct) {
             toast({ title: "Added to wishlist", description: `${newProduct.name} has been added to your wishlist.` });
        }
    } else if (wishlist.length < previousWishlist.current.length) {
        const removedProduct = previousWishlist.current.find(p => !wishlist.some(curr => curr.id === p.id));
         if (removedProduct) {
            toast({ title: "Removed from wishlist", description: `${removedProduct.name} has been removed from your wishlist.` });
        }
    }

    previousWishlist.current = wishlist;

  }, [wishlist, toast]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.some(item => item.id === product.id)) {
        return prevWishlist; // Already in wishlist
      }
      return [...prevWishlist, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(prevWishlist => {
        return prevWishlist.filter(item => item.id !== productId)
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
