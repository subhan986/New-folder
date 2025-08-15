
import { notFound } from "next/navigation";
import { ProductForm } from "../../_components/product-form";
import { getProductsByIds } from "@/app/actions"; // Import getProductsByIds
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default async function EditProductPage({ // Make the component async
  params,
}: {
  params: { id: string };
}) {
  const products = await getProductsByIds([params.id]); // Fetch product by ID
  const product = products[0]; // Get the first product from the array

  if (!product) {
    return notFound();
  }

  return (
    <>
      <Card>
            <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>Update the details for {product.name}.</CardDescription>
            </CardHeader>
        </Card>
      <ProductForm product={product} />
    </>
  );
}
