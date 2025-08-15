import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategories } from "@/app/actions";
import { CategoriesTable } from "./_components/categories-table";
import { PlusCircle } from "lucide-react";

export default async function CategoriesPage() {
  const data = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Category
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Here you can manage all the product categories for your store.
      </p>
      <CategoriesTable data={data} />
    </div>
  );
}
