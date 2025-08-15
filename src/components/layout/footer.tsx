import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/20">
      <div className="container py-12 text-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-2 lg:col-span-1">
             <Link href="/" className="flex items-center space-x-2 mb-4">
               <span className="font-bold text-2xl font-headline text-foreground">Demporium</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Luxury minimalist furniture and interior design since 2017.
            </p>
            {/* Social media icons removed */}
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline tracking-wider text-foreground">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Mondo</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Capin</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Boudoir</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          {/* Services section removed */}
          <div>
            <h3 className="font-semibold mb-4 font-headline tracking-wider text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>21-C, Zulfiqar Commercial Street 2</li>
              <li>Phase 8, DHA, Karachi</li>
              <li className='pt-2'>
                <a href="https://api.whatsapp.com/send?phone=%2B923322645235" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors font-semibold">Contact us on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Demporium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
