'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
}

export function CategoryCard({ name, image, href }: CategoryCardProps) {
  const normalizeSrc = (src: string) => {
    try {
      if (!src) return src;
      if (src.startsWith('/')) return src; // already local relative
      // If absolute URL points to current origin (e.g., http://localhost:3000/images/x.png), strip origin
      const u = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      if (typeof window !== 'undefined' && u.origin === window.location.origin) {
        return u.pathname + u.search + u.hash;
      }
      return src;
    } catch {
      return src;
    }
  };
  const normalized = normalizeSrc(image);
  const hasSrc = Boolean(normalized && normalized.trim().length > 0);
  const fallbackPlaceholder = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=60';
  return (
    <Link href={href} className="group block text-center">
      <div className="relative w-full aspect-square overflow-hidden rounded-full border-2 border-transparent group-hover:border-primary transition-colors">
        {hasSrc ? (
          <Image
            src={normalized}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={fallbackPlaceholder}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-2 text-sm font-medium">{name}</p>
    </Link>
  );
}
