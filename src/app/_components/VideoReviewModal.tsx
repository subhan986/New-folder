'use client';

import { useEffect, useState } from 'react';
import { Review, Product } from '@/types';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { getProductsByIds } from '../actions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface VideoReviewModalProps {
  review: Review;
  onClose: () => void;
}

export default function VideoReviewModal({ review, onClose }: VideoReviewModalProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure review.relatedProducts is an array of { id: string; name: string; }
    // and extract only the IDs for getProductsByIds
    const productIds = review.relatedProducts?.map(p => p.id) || [];

    if (productIds.length > 0) {
      setIsLoading(true);
      getProductsByIds(productIds)
        .then(setRelatedProducts)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [review.relatedProducts]);

  const router = useRouter();

  const handleFullPageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/review/${review.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative bg-white w-full max-w-4xl h-[80vh] max-h-[700px] rounded-lg overflow-hidden flex flex-col md:flex-row mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <button 
            onClick={handleFullPageClick}
            className="text-white bg-black bg-opacity-50 rounded-full p-1.5 hover:bg-opacity-70 transition-colors"
            aria-label="View full page"
            title="View full page"
          >
            <ExternalLink size={18} />
          </button>
          <button 
            onClick={onClose} 
            className="text-white bg-black bg-opacity-50 rounded-full p-1.5 hover:bg-opacity-70 transition-colors"
            aria-label="Close video player"
          >
            <X size={18} />
          </button>
        </div>
        <div className="w-3/5 bg-black flex items-center justify-center">
            <video src={review.videoUrl} controls autoPlay className="w-full h-full object-contain" />
        </div>
        <div className="w-2/5 flex flex-col border-l">
            <div className="p-4 border-b">
                <h3 className="font-bold text-lg">Related Products</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : relatedProducts.length > 0 ? (
                    <div className="space-y-4">
                        {relatedProducts.map(product => {
                            const productUrl = product.redirectLink || `/products/${product.id}`;
                            const isExternal = !!product.redirectLink;
                            const productContent = (
                                <>
                                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                        <Image 
                                            src={product.images[0] || '/placeholder.svg'}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                    </div>
                                </>  
                            );

                            if (isExternal) {
                                return (
                                    <a href={productUrl} key={product.id} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg">
                                        {productContent}
                                    </a>
                                )
                            }

                            return (
                                <Link href={productUrl} key={product.id} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg">
                                    {productContent}
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No related products found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
