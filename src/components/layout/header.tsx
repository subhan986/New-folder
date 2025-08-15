"use client";

import Link from 'next/link';
import { Menu, ShoppingCart, Heart, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import type { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import React from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import dynamic from 'next/dynamic';
const SearchDialog = dynamic(() => import('@/components/search-dialog').then(mod => mod.SearchDialog), { ssr: false });

const navLinks = [
  { name: 'Collections', href: '/products' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const DLogo = React.memo(() => (
  <Image 
    src="/logo.jpg" 
    alt="Demporium Logo" 
    width={160} 
    height={32}
    className="h-8 w-40"
    priority
  />
));

export const Header = React.memo(function Header({ products }: { products: Product[] }) {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-20 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-10 flex items-center space-x-2">
            <DLogo />
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} prefetch={true} className="transition-colors text-foreground/80 hover:text-foreground">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                   <Link href="/" prefetch={true} className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <DLogo />
                  </Link>
                </SheetHeader>
                 <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-border">
                      <div className="space-y-2 py-6">
                        {navLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            prefetch={true}
                            onClick={() => setMobileMenuOpen(false)}
                            className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 hover:bg-muted"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
              </SheetContent>
            </Sheet>
          </div>

           <Link href="/" prefetch={true} className="md:hidden flex items-center space-x-2">
               <DLogo />
            </Link>
          
          <nav className="flex items-center gap-1">
             <SearchDialog products={products}>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5 text-foreground/60 group-hover:text-foreground" />
              </Button>
            </SearchDialog>

            <Button asChild variant="ghost" size="icon" aria-label="Wishlist">
              <Link href="/wishlist">
                <Heart className="h-5 w-5 text-foreground/60 group-hover:text-foreground" />
                 {wishlistCount > 0 && <span className="relative flex h-3 w-3 -translate-y-2 -translate-x-2">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary text-xs text-primary-foreground items-center justify-center">{wishlistCount}</span>
                  </span>}
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
});
