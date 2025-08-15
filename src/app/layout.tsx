
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/hooks/use-cart';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import AppLayout from '@/components/layout/app-layout';
import { getProducts } from './actions';

export const metadata: Metadata = {
  title: 'Demporium',
  description: 'Luxury Minimalist Furniture',
};

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getProducts();
  return (
    <html lang="en" className={`${playfair.variable} ${ptSans.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        <CartProvider>
          <WishlistProvider>
            <AppLayout products={products}>
                {children}
            </AppLayout>
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
