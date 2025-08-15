import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getReviews } from '../actions';

export default async function ReviewsPage() {
  const reviews = await getReviews();
  
  return (
    <div className="bg-white min-h-screen py-10 md:py-12">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Customer Reviews</h1>
        <p className="text-sm md:text-base text-gray-500">See what our customers are saying about their purchases</p>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/review/${review.id}`}
              className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-muted"
            >
              {review.videoUrl ? (
                <video
                  src={review.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  poster={review.thumbnail}
                />
              ) : review.thumbnail ? (
                <Image
                  src={review.thumbnail}
                  alt={review.overlayText || 'Review thumbnail'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No media</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="text-white text-left">
                  <h3 className="font-medium line-clamp-2">
                    {review.overlayText || `${review.creator?.name || 'User'}'s Review`}
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-white/80">5.0</span>
                  </div>
                  <p className="text-xs mt-1 text-white/80 line-clamp-2">
                    {review.reviewText || 'Watch the full review'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Load more reviews
          </button>
        </div>
      </div>
    </div>
  );
}
