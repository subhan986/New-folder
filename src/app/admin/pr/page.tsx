
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReviews } from "@/app/actions";
import { PrReviewsTable } from "./_components/pr-reviews-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
  
export default async function PRPage() {
    const reviews = await getReviews();
    return (
       <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>PR Reviews</CardTitle>
                    <CardDescription>A list of all the video reviews from creators.</CardDescription>
                </div>
                <Link href="/admin/pr/new">
                    <Button>Add New</Button>
                </Link>
            </div>
        </CardHeader>
        <CardContent>
            <PrReviewsTable reviews={reviews} />
        </CardContent>
       </Card>
    )
}
