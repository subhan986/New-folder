import { notFound } from "next/navigation";
import { PrForm } from "../_components/pr-form";
import { getReviews } from "@/app/actions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function EditPrPage({
  params,
}: {
  params: { id: string };
}) {
  const reviews = await getReviews();
  const review = reviews.find(r => r.id === params.id);

  if (!review) {
    return notFound();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit Review</CardTitle>
          <CardDescription>Update the details for the review by {review.creator.name}.</CardDescription>
        </CardHeader>
      </Card>
      <PrForm review={review} />
    </>
  );
}
