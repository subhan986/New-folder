
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import type { Product } from '@/types';

export default function AppLayout({ children, products }: { children: React.ReactNode, products: Product[] }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin') || pathname === '/login';

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Header products={products} />}
            <main className="flex-grow">{children}</main>
            {!isAdminRoute && <Footer />}
        </div>
    )
}
