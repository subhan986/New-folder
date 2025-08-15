"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveSiteSettings } from "../../actions";

interface SiteSettingsFormProps {
  settings: any;
}

export function SiteSettingsForm({ settings: initialSettings }: SiteSettingsFormProps) {
  const [settings, setSettings] = useState<any>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, key] = name.split('.');

    if (key) {
      setSettings((prev: any) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setSettings((prev: any) => ({ ...prev, [name]: value }));
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSiteSettings(settings);
      toast({ title: "Success", description: "Site settings have been updated." });
    } catch (error) {
      console.error("Failed to save site settings:", error);
      toast({ title: "Error", description: "Could not save site settings.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Information</h3>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" name="companyName" value={settings?.companyName || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" value={settings?.contactEmail || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" value={settings?.phoneNumber || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" value={settings?.address || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Homepage Content</h3>
        <div className="space-y-2">
          <Label htmlFor="heroTitle">Hero Title</Label>
          <Input id="heroTitle" name="homepage.heroTitle" value={settings?.homepage?.heroTitle || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
          <Textarea id="heroSubtitle" name="homepage.heroSubtitle" value={settings?.homepage?.heroSubtitle || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featuredTitle">Featured Products Title</Label>
          <Input id="featuredTitle" name="homepage.featuredTitle" value={settings?.homepage?.featuredTitle || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featuredSubtitle">Featured Products Subtitle</Label>
          <Textarea id="featuredSubtitle" name="homepage.featuredSubtitle" value={settings?.homepage?.featuredSubtitle || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Media Links</h3>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input id="facebook" name="socialMedia.facebook" value={settings?.socialMedia?.facebook || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input id="instagram" name="socialMedia.instagram" value={settings?.socialMedia?.instagram || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter URL</Label>
          <Input id="twitter" name="socialMedia.twitter" value={settings?.socialMedia?.twitter || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Homepage SEO</h3>
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input id="metaTitle" name="seo.metaTitle" value={settings?.seo?.metaTitle || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea id="metaDescription" name="seo.metaDescription" value={settings?.seo?.metaDescription || ''} onChange={handleInputChange} />
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Settings'}</Button>
    </form>
  );
}
