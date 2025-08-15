import { getProducts } from '@/app/actions';
import { PrReviewForm } from '../_components/pr-review-form';

export default async function NewPRPage() {
    const products = await getProducts();

    return (
        <div className="max-w-2xl mx-auto">
            <PrReviewForm products={products} />
        </div>
    );
}
