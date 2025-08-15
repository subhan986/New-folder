import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentForm } from "./_components/content-form";
import { getContent } from "./actions";

export default async function ContentPage() {
  const content = await getContent();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Content</CardTitle>
        <CardDescription>Manage the text and content across your website.</CardDescription>
      </CardHeader>
      <CardContent>
        <ContentForm content={content} />
      </CardContent>
    </Card>
  );
}
