'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createReviewWithVideo, getSignedReviewUploadUrl, createReviewRecord } from '@/app/actions';
import type { Review, Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrReviewFormProps {
    review?: Review;
    products: Product[];
}

export function PrReviewForm({ review, products }: PrReviewFormProps) {
    if (review) {
        // The new upload form doesn't support editing yet. 
        // This can be added back if needed.
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Editing Not Supported</CardTitle>
                    <CardDescription>Direct video uploads are only available for new reviews at the moment.</CardDescription>
                </CardHeader>
            </Card>
        )
    }
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!videoFile) {
            // TODO: Show an error message to the user
            alert('Please select a video file to upload.');
            return;
        }

        const formData = new FormData(e.currentTarget);
        formData.append('video', videoFile);

        startTransition(async () => {
            // Try signed upload to bypass action body limit
            const pre = await getSignedReviewUploadUrl(videoFile.name);
            if (pre?.success && pre.signedUrl && pre.path) {
                try {
                    const uploadRes = await fetch(pre.signedUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': videoFile.type || 'video/mp4' },
                        body: videoFile,
                    });
                    if (!uploadRes.ok) throw new Error('Signed upload failed');
                    const result = await createReviewRecord({
                        creatorName: String(formData.get('creatorName') || ''),
                        creatorHandle: String(formData.get('creatorHandle') || ''),
                        overlayText: String(formData.get('overlayText') || ''),
                        reviewText: String(formData.get('reviewText') || ''),
                        relatedProductIds: formData.getAll('relatedProductIds') as string[],
                        videoPath: pre.path,
                    });
                    if (result.success) {
                        router.push('/admin/pr');
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                    return;
                } catch (err) {
                    // fall through to server action
                }
            }
            // Fallback to server action upload (may hit 50mb limit)
            const result = await createReviewWithVideo(formData);
            if (result.success) {
                router.push('/admin/pr');
            } else {
                alert(`Error: ${result.message}`);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{review ? 'Edit' : 'Create'} PR Review</CardTitle>
                    <CardDescription>Fill out the details for the video review.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="creatorName">Creator Name</Label>
                            <Input id="creatorName" name="creatorName" placeholder="e.g., Sarah Stylist" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="creatorHandle">Creator Handle</Label>
                            <Input id="creatorHandle" name="creatorHandle" placeholder="e.g., @sarahstyles" required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="video">Upload Video</Label>
                        <Input id="video" name="video" type="file" accept="video/*" onChange={handleFileChange} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="overlayText">Overlay Text</Label>
                        <Input id="overlayText" name="overlayText" placeholder="e.g., Loving this new chair!" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reviewText">Review Text (Optional)</Label>
                        <Textarea id="reviewText" name="reviewText" placeholder="Full review content..." />
                    </div>
                    <div className="grid gap-2">
                        <Label>Related Products</Label>
                        <ScrollArea className="h-48 w-full rounded-md border p-4">
                            <div className="grid gap-2">
                                {products.map(product => (
                                    <div key={product.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`product-${product.id}`}
                                            name="relatedProductIds"
                                            value={product.id}
                                        />
                                        <Label htmlFor={`product-${product.id}`} className="font-normal cursor-pointer">{product.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Review'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
