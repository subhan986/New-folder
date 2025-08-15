
import { ProductForm } from "../_components/product-form";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCategories } from "@/app/actions";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
        </CardHeader>
      </Card>
      <ProductForm categories={categories} />
    </>
  );
}
