import { getProducts } from '@/app/actions';
import type { Product } from '@/types';
import CategoryClient from './[category]/category-client';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products: Product[] = await getProducts();

  const colors = Array.from(new Set(products.map((p) => p.color).filter(Boolean)));
  const materials = Array.from(new Set(products.map((p) => p.material).filter(Boolean)));
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price || 0)) : 0;

  return (
    <CategoryClient
      products={products}
      categoryName="All Products"
      colors={colors as string[]}
      materials={materials as string[]}
      maxPrice={maxPrice}
    />
  );
}
