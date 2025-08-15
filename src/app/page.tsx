import { getReviews } from './actions';
import { getContent } from './admin/content/actions';
import HomePageClient from './_components/home-page-client';

export default async function HomePage() {
  const [reviews, content] = await Promise.all([getReviews(), getContent()]);
  const categories = content?.homeCategories;
  return (
    <HomePageClient reviews={reviews} categories={categories} />
  );
}
