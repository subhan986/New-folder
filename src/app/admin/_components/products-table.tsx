
"use client";

import * as React from "react";
import type { Product } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
const MoreHorizontal = dynamic(() => import("lucide-react").then(mod => mod.MoreHorizontal));
const Trash2 = dynamic(() => import("lucide-react").then(mod => mod.Trash2));
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useState, useMemo } from "react";

export function ProductsTable({ products }: { products: Product[] }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedProducts = useMemo(() => 
        [...products].sort((a,b) => b.popularity - a.popularity), 
        [products]
    );

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, sortedProducts]);

    const openConfirmation = (productId: string) => {
        setSelectedProductId(productId);
        setIsAlertOpen(true);
    }

    const handleDelete = async () => {
        if (!selectedProductId) return;

        const result = await deleteProduct(selectedProductId);
        if (result.success) {
            toast({ title: "Product Deleted", description: "The product has been successfully deleted." });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
        setIsAlertOpen(false);
        setSelectedProductId(null);
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedProducts.map(product => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                    <Badge variant={product.stockStatus === 'In Stock' ? 'default' : 'secondary'}>
                                    {product.stockStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>PKR {product.price.toLocaleString()}</TableCell>
                            <TableCell className="capitalize">{product.category}</TableCell>
                            <TableCell>{product.popularity}</TableCell>
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
                                            <Link href={`/admin/products/${product.id}/edit`} prefetch={true}>Edit</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openConfirmation(product.id)} className="text-red-600">
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
                        product from your records.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedProductId(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
