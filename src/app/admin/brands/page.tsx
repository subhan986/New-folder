import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBrands } from "@/app/actions";
import { BrandsTable } from "./_components/brands-table";
import { PlusCircle } from "lucide-react";

export default async function BrandsPage() {
  const data = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <Button asChild>
          <Link href="/admin/brands/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Brand
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Here you can manage all the brands for your store.
      </p>
      <BrandsTable data={data} />
    </div>
  );
}
