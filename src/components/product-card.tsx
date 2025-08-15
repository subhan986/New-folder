
"use client";

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  cardHeightClass?: string;
}

export function ProductCard({ product, cardHeightClass }: ProductCardProps) {

  return (
    <Card className={cn("w-full overflow-hidden group transition-all duration-300 hover:shadow-xl border-none rounded-lg bg-transparent animate-fade-in-up", cardHeightClass)}>
      <Link href={`/product/${product.id}`} className="block h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] rounded-lg flex-grow">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="product image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=60"
                alt={product.name}
                fill
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            )}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.isNew && (
                <div className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md">NEW</div>
              )}
               {product.isFeatured && !product.isNew && (
                <div className="bg-background text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md">Featured</div>
              )}
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold font-headline text-lg">{product.name}</h3>
            <p className="text-muted-foreground text-sm">{product.category} Collection</p>
            <p className="font-bold text-foreground text-lg mt-2">PKR {product.price.toLocaleString()}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
