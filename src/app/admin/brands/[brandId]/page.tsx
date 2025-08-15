import { getBrands } from "@/app/actions";
import { BrandForm } from "../_components/brand-form";
import type { Brand } from "@/types";

export default async function BrandPage({ params }: { params: { brandId: string } }) {
  const brands = await getBrands();
  const brand = brands.find((b: Brand) => b.id === params.brandId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {brand ? 'Edit Brand' : 'Create New Brand'}
        </h1>
        <p className="text-muted-foreground">
          {brand ? 'Update the details for this brand.' : 'Fill out the form to add a new brand to your store.'}
        </p>
      </div>
      <BrandForm brand={brand} />
    </div>
  );
}
