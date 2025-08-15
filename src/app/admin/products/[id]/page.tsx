import { notFound } from "next/navigation";
import { ProductForm } from "../_components/product-form";
import { getProducts } from "@/app/actions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const products = await getProducts();
  const product = products.find(p => p.id === params.id);

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
