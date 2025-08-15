
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Review, Product } from "@/types";
import { createReviewWithVideo, updateReview } from "@/app/actions"; // Import createReviewWithVideo
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { getProducts } from "@/app/actions";

export function PrForm({ review }: { review?: Review }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    review?.relatedProducts?.map(p => p.id) || []
  );

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setProducts(allProducts);
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // Manually append all form fields
    formData.append('creatorName', (e.currentTarget.elements.namedItem('creatorName') as HTMLInputElement)?.value || '');
    formData.append('creatorHandle', (e.currentTarget.elements.namedItem('creatorHandle') as HTMLInputElement)?.value || '');
    formData.append('overlayText', (e.currentTarget.elements.namedItem('overlayText') as HTMLInputElement)?.value || '');
    formData.append('reviewText', (e.currentTarget.elements.namedItem('reviewText') as HTMLTextAreaElement)?.value || '');
    
    const videoFile = (e.currentTarget.elements.namedItem('videoFile') as HTMLInputElement)?.files?.[0];
    if (videoFile) {
      formData.append('videoFile', videoFile);
    }
    if (review?.id) {
      formData.append('id', review.id);
    }
    if (review?.videoUrl) {
      formData.append('existingVideoUrl', review.videoUrl);
    }

    // Manually append selected product IDs
    selectedProducts.forEach(id => {
      formData.append('related_product_ids', id);
    });

    startTransition(async () => {
      // Determine whether to call createReviewWithVideo or updateReview
      const action = review?.id ? updateReview : createReviewWithVideo;
      const result = await action(formData);
      if (result?.success) {
        toast({ title: "Review Updated", description: "Your changes have been saved." });
        router.push('/admin/pr');
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: result?.message || "An unknown error occurred." });
      }
    });
  };

  const handleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="grid gap-6 pt-6">
          {review?.id && <input type="hidden" name="id" value={review.id} />}
          {review?.videoUrl && <input type="hidden" name="existingVideoUrl" value={review.videoUrl} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="creatorName">Creator Name</Label>
              <Input id="creatorName" name="creatorName" defaultValue={review?.creator?.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="creatorHandle">Creator Handle</Label>
              <Input id="creatorHandle" name="creatorHandle" defaultValue={review?.creator?.handle} placeholder="e.g. @johndoe" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="overlayText">Video Overlay Text</Label>
            <Input id="overlayText" name="overlayText" defaultValue={review?.overlayText} placeholder="e.g. Neutral home decor finds" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reviewText">Review Text / Transcript</Label>
            <Textarea id="reviewText" name="reviewText" defaultValue={review?.reviewText} placeholder="Enter the review transcript or a summary." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="videoFile">Upload Video</Label>
            <Input id="videoFile" name="videoFile" type="file" accept="video/*" />
            <p className="text-sm text-muted-foreground">
              Upload a new video to replace the existing one. Current video will be used if no new file is selected.
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Related Products</Label>
            <Card className="p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {products.map(product => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`product-${product.id}`}
                      name="related_product_ids"
                      value={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                      className="hidden" 
                    />
                     <Checkbox
                        id={`checkbox-for-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductSelection(product.id)}
                      />
                    <Label htmlFor={`checkbox-for-${product.id}`} className="font-normal cursor-pointer">{product.name}</Label>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
