"use client"

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Input } from "@/components/ui/input"

import type { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

const popularCategories = ["Living Room", "Bedroom", "Office", "Outdoor"];

export function SearchDialog({ children, products: allProducts }: { children: React.ReactNode, products: Product[] }) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (debouncedQuery.length > 1 && allProducts.length > 0) {
            setIsLoading(true);
            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
            ).slice(0, 7); // Limit results to 7
            setResults(filtered);
            setIsLoading(false);
        } else {
            setResults([]);
        }
    }, [debouncedQuery, allProducts]);

    useEffect(() => {
      if (!isOpen) {
        setQuery('');
        setResults([]);
      }
    }, [isOpen]);

    const handleCategoryClick = (category: string) => {
        setQuery(category);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] p-0 gap-0">
                <VisuallyHidden.Root>
                    <DialogTitle>Search</DialogTitle>
                </VisuallyHidden.Root>
                <div className="relative">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search for products, categories, or keywords..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="text-base border-0 focus-visible:ring-0 shadow-none h-16 pl-12 pr-4"
                        />
                        {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />}
                    </div>
                </div>
                <div className="p-4 pt-0 max-h-[400px] overflow-y-auto border-t">
                    {results.length > 0 ? (
                        <div className="space-y-1 py-2">
                            {results.map(product => (
                                <Link 
                                    key={product.id} 
                                    href={`/product/${product.id}`}
                                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors -mx-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Image 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        width={50} 
                                        height={50} 
                                        className="rounded-md object-cover bg-muted"
                                    />
                                    <div className='flex-grow'>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.category}</p>
                                    </div>
                                    <p className="text-sm font-semibold ml-auto">PKR {product.price.toLocaleString()}</p>
                                </Link>
                            ))}
                        </div>
                    ) : debouncedQuery.length > 1 && !isLoading ? (
                        <p className="text-center text-muted-foreground py-8">No results found for "{debouncedQuery}"</p>
                    ) : !isLoading ? (
                        <div className='py-4'>
                            <p className='text-sm font-medium text-muted-foreground px-2 mb-2'>Popular Categories</p>
                            <div className='flex flex-wrap gap-2'>
                                {popularCategories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className='px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary transition-colors'
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}
