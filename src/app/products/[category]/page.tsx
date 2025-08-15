import { getProducts } from '@/app/actions';
import { Product } from '@/types';
import CategoryClient from './category-client';

export const dynamic = 'force-dynamic';

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const { category } = await props.params;
  const allProducts = await getProducts();
  const catParam = category.toLowerCase();
  const products = allProducts.filter((p: Product) => {
    const cat = (p as any).category ? String((p as any).category) : '';
    const lower = cat.toLowerCase();
    const slug = lower.replace(/\s+/g, '-');
    return Boolean(cat) && (slug === catParam || slug.includes(catParam) || lower.includes(catParam));
  });
  
  if (products.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Category Not Found</h1>
        <p>No products found in this category.</p>
      </div>
    );
  }

  const categoryName = products[0]?.category || category;
  const colors = [...new Set(products.map((p: Product) => p.color))];
  const materials = [...new Set(products.map((p: Product) => p.material))];
  const maxPrice = Math.max(...products.map((p: Product) => p.price));

  return (
    <CategoryClient 
      products={products}
      categoryName={categoryName}
      colors={colors}
      materials={materials}
      maxPrice={maxPrice}
    />
  );
}
