'use client';

import { useState } from 'react';
import type { Review } from '@/types';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoReviewModal from './VideoReviewModal';
import { CategoryCard } from './CategoryCard';

const placeholder = (q: string) => `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=60`;
type HomeCategory = { name: string; img: string; href: string };

const brands = [
    { name: 'TARGET', style: { fontFamily: 'sans-serif', fontWeight: 'bold' } as CSSProperties },
    { name: 'Parachute', style: { fontFamily: 'serif', fontStyle: 'italic' } as CSSProperties },
    { name: 'CB2', style: { fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: '0.1em' } as CSSProperties },
    { name: 'Lulu & Georgia', style: { fontFamily: 'serif', fontStyle: 'italic', textTransform: 'lowercase' } as CSSProperties },
    { name: 'Wayfair', style: { fontFamily: 'cursive' } as CSSProperties },
    { name: 'ANTHROPOLOGIE', style: { fontFamily: 'serif', letterSpacing: '0.1em' } as CSSProperties },
];

interface HomePageClientProps {
    reviews: Review[];
    categories?: HomeCategory[];
}

export default function HomePageClient({ reviews, categories }: HomePageClientProps) {
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const router = useRouter();
    const handleCloseModal = () => setSelectedReview(null);
    const handleReviewClick = (review: Review) => {
        router.push(`/review/${review.id}`);
    };

    return (
        <div className="bg-white min-h-screen">
            {selectedReview && <VideoReviewModal review={selectedReview} onClose={handleCloseModal} />}

            {/* Announcement Bar */}
            <div className="text-center p-2 bg-gray-900 text-white text-sm">
                <p>Free shipping on all orders over $50</p>
            </div>

            <main className="py-10 md:py-12">
                {/* Hero heading */}
                <section className="container mx-auto px-4 text-center mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Find exactly what you're looking for</h1>
                    <p className="text-sm md:text-base text-gray-500">Shop from our most popular categories</p>
                </section>

                {/* Categories grid */}
                <section className="container mx-auto px-4 mb-12 md:mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        {(categories || [
                          { name: 'Living', img: placeholder('living'), href: '/products/living' },
                          { name: 'Kitchen', img: placeholder('kitchen'), href: '/products/kitchen' },
                          { name: 'Bedroom', img: placeholder('bedroom'), href: '/products/bedroom' },
                          { name: 'Outdoor', img: placeholder('outdoor'), href: '/products/outdoor' },
                          { name: 'Decor', img: placeholder('decor'), href: '/products/decor' },
                          { name: 'Rugs', img: placeholder('rugs'), href: '/products/rugs' },
                          { name: 'Coffee Table', img: placeholder('coffee-table'), href: '/products/coffee-table' },
                          { name: 'Sofa', img: placeholder('sofa'), href: '/products/sofa' },
                          { name: 'Dining Chair', img: placeholder('dining-chair'), href: '/products/dining-chair' },
                          { name: 'Accent Chair', img: placeholder('accent-chair'), href: '/products/accent-chair' },
                          { name: 'Sideboard', img: placeholder('sideboard'), href: '/products/sideboard' },
                          { name: 'Barstool', img: placeholder('barstool'), href: '/products/barstool' },
                        ]).map((cat, i) => (
                            <CategoryCard key={cat.href || cat.name || `cat-${i}`} name={cat.name} image={cat.img} href={cat.href} />
                        ))}
                    </div>
                </section>

                {/* Reels 5x2 */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">Shop the latest posts</h2>
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-5 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => {
                                const review = reviews[i];
                                const productName = review?.relatedProducts?.[0]?.name || 'Product';
                                const key = review?.id ?? `placeholder-${i}`;
                                return (
                                    <div
                                        key={key}
                                        className={`group relative ${review ? 'cursor-pointer' : 'cursor-default'}`}
                                        onClick={review ? (e) => {
                                            e.preventDefault();
                                            handleReviewClick(review);
                                        } : undefined}
                                        role={review ? 'link' : undefined}
                                        aria-disabled={!review}
                                    >
                                        <div className="relative w-full aspect-[9/16] overflow-hidden bg-muted rounded-lg">
                                            {review && review.videoUrl ? (
                                                <video
                                                    src={review.videoUrl}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-200" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-sm">
                                            {review ? (
                                                <>
                                                    <p className="font-medium truncate">{productName}</p>
                                                    <p className="text-xs text-gray-500">by @{review.creator?.name}</p>
                                                </>
                                            ) : (
                                                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Brands strip */}
                <section className="container mx-auto px-4 mb-12 md:mb-16 bg-gray-50 p-6 md:p-8 rounded-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">search product from iconic and emerging brands</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                        {brands.map((brand) => (
                            <span key={brand.name} style={brand.style} className="text-2xl text-gray-700">
                                {brand.name}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Promo banner */}
                <section className="container mx-auto px-4">
                    <div className="relative h-[320px] md:h-[420px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                        <Image src={placeholder('sahara')} alt="Sahara Collection" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">The Sahara Collection</h2>
                            <p className="mb-5 md:mb-6 text-sm md:text-base">Discover earthy tones and natural textures.</p>
                            <Link href={'#'} className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-white/85 text-gray-900 hover:bg-white transition shadow-sm">
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
