import { notFound } from 'next/navigation';
import type { Review, Product } from '@/types';
import { getProductsByIds, getReviews } from '../../actions';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';

// Add missing types for the review creator
interface Creator {
  name: string;
  handle?: string;
  avatar?: string;
}

// This function runs at build time to generate static paths
export async function generateStaticParams() {
  const reviews = await getReviews();
  return reviews.map((review) => ({
    id: review.id,
  }));
}

interface ReviewPageProps {
  params: {
    id: string;
  };
}

// This function is used to generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const reviews = await getReviews();
  const review = reviews.find((r: Review) => r.id === id);
  
  if (!review) {
    return {
      title: 'Review Not Found',
    };
  }
  
  return {
    title: `${review.creator?.name || 'User'}'s Review`,
    description: review.overlayText || `A review by ${review.creator?.name || 'a user'}`,
    openGraph: {
      title: `${review.creator?.name || 'User'}'s Review`,
      description: review.overlayText || `A review by ${review.creator?.name || 'a user'}`,
      type: 'website',
    },
  };
}

// Helper function to get review data
async function getReview(id: string): Promise<(Review & { creator: Creator }) | undefined> {
  const reviews = await getReviews();
  return reviews.find((review) => review.id === id) as (Review & { creator: Creator }) | undefined;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  // Destructure the ID from params
  const { id } = params;
  
  // Get the review data
  const review = await getReview(id);
  
  // If review not found, return 404
  if (!review) {
    notFound();
  }

  // Get related products
  const productIds = review.relatedProducts?.map(p => p.id) || [];
  let relatedProducts: Product[] = [];
  
  if (productIds.length > 0) {
    relatedProducts = await getProductsByIds(productIds);
  }

  // Get other reviews (excluding current one)
  const allReviews = await getReviews();
  const otherReviews = allReviews.filter((r) => r.id !== review.id);

  // Format date
  const reviewDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-2 sm:px-3 py-4">
        {/* Back Button */}
        <Link 
          href="/reviews" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all reviews
        </Link>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Video - Compact Reel Format */}
          <div className="lg:w-1/2 flex justify-center items-start">
            <div className="relative w-full max-w-[280px] mx-auto lg:mx-0 lg:w-[280px] rounded-xl overflow-hidden bg-black shadow-md">
              <div className="relative pt-[177.78%]">
                <video
                  src={review.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  poster={review.thumbnail}
                  title={review.overlayText || 'Product review video'}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Review Content */}
          <div className="lg:w-1/2">
            <div className="sticky top-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {review.overlayText || `${review.creator.name}'s Review`}
              </h1>
              
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <span>{reviewDate}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-4 h-4 text-yellow-400 fill-current"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ml-1 text-gray-900 font-medium">5.0</span>
                  <span className="sr-only">Rating: 5 out of 5 stars</span>
                </div>
              </div>

              {review.reviewText && (
                <div className="prose max-w-none text-gray-700 mb-8">
                  <p>{review.reviewText}</p>
                </div>
              )}

              {/* Product Card */}
              {relatedProducts.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Featured Product
                  </h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                      {relatedProducts[0].images && relatedProducts[0].images.length > 0 ? (
                        <Image
                          src={relatedProducts[0].images[0]}
                          alt={relatedProducts[0].name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{relatedProducts[0].name}</h4>
                      <p className="text-gray-500">${relatedProducts[0].price?.toFixed(2)}</p>
                      <a
                        href={relatedProducts[0].redirectLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Product →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More from Creator Section */}
        {otherReviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More from {review.creator.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherReviews.slice(0, 4).map((otherReview) => (
                <Link
                  key={otherReview.id}
                  href={`/review/${otherReview.id}`}
                  className="group block rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="aspect-[9/16] bg-gray-100 relative">
                    {otherReview.thumbnail && (
                      <Image
                        src={otherReview.thumbnail}
                        alt={otherReview.overlayText ? `${otherReview.overlayText} thumbnail` : 'Review thumbnail'}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={false}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {otherReview.overlayText || 'View Review'}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
