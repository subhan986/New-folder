import { getCategories } from "@/app/actions";
import { CategoryForm } from "../_components/category-form";
import type { Category } from "@/types";

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const categories = await getCategories();
  const category = categories.find((c: Category) => c.id === params.categoryId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {category ? 'Edit Category' : 'Create New Category'}
        </h1>
        <p className="text-muted-foreground">
          {category ? 'Update the details for this category.' : 'Fill out the form to add a new category to your store.'}
        </p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
