import { getProducts } from '@/app/actions';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './product-details-client';
import type { Product } from '@/types';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const products = await getProducts();
  const product = products.find((p: Product) => p.id === params.id);
  if (!product) {
    notFound();
  }
  let relatedProducts: Product[] = [];
  if (product.category) {
    relatedProducts = products
      .filter((p: Product) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }

  // Fallback: if no related products found by category, show other products (excluding current)
  if (relatedProducts.length === 0) {
    relatedProducts = products
      .filter((p: Product) => p.id !== product.id)
      .slice(0, 4);
  }
  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
