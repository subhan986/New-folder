


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { ProductsTable } from "./_components/products-table";
import { getProducts } from "@/app/actions";

export default async function AdminPage() {
  const products = await getProducts();
    return (
       <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>A list of all the products in your store.</CardDescription>
                </div>
                <Button size="sm" asChild>
                    <Link href="/admin/products/new" className="gap-1">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add Product</span>
                    </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
             <ProductsTable products={products} />
        </CardContent>
       </Card>
    )
}
