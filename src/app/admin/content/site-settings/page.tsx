import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsForm } from "./_components/site-settings-form";
import { getSiteSettings } from "../actions";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Manage your store's general settings and information.</CardDescription>
      </CardHeader>
      <CardContent>
        <SiteSettingsForm settings={settings} />
      </CardContent>
    </Card>
  );
}
