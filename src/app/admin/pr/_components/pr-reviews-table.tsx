
"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Review } from "@/types";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteReview } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
  
export function PrReviewsTable({ reviews }: { reviews: Review[] }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [selectedReviewId, setSelectedReviewId] = React.useState<string | null>(null);

    const openConfirmation = (reviewId: string) => {
        setSelectedReviewId(reviewId);
        setIsAlertOpen(true);
    }

    const handleDelete = async () => {
        if (!selectedReviewId) return;

        const result = await deleteReview(selectedReviewId);
        if (result.success) {
            toast({ title: "Review Deleted", description: "The review has been successfully deleted." });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
        setIsAlertOpen(false);
        setSelectedReviewId(null);
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                    {/* <TableHead className="w-16">Thumbnail</TableHead> */}
                    <TableHead>Creator</TableHead>
                    <TableHead>Overlay Text</TableHead>
                    <TableHead>Related Products</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map(review => (
                        <TableRow key={review.id}>
                            {/* <TableCell>
                                <Image 
                                    src={review.thumbnail}
                                    alt={`Review by ${review.creator.name}`}
                                    width={64}
                                    height={113} // 9:16 aspect ratio
                                    className="object-cover rounded-md"
                                />
                            </TableCell> */}
                            <TableCell className="font-medium">{review.creator.name}</TableCell>
                            <TableCell>{review.overlayText}</TableCell>
                            <TableCell>{review.relatedProducts?.map(p => p.name).join(', ')}</TableCell>
                            
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/pr/${review.id}`}>Edit</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openConfirmation(review.id)} className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        review from your records.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedReviewId(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
