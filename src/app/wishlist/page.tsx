
"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">Your collection of saved items.</p>
      </div>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg flex flex-col items-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mt-2">
            Looks like you haven't added anything to your wishlist yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Start Browsing</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
