'use client';

import { useState } from 'react';
import { updateContent } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ContentFormProps {
  content: any;
}

export function ContentForm({ content: initialContent }: ContentFormProps) {
  const { toast } = useToast();
  const [content, setContent] = useState<any>(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await updateContent(content);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Update failed', description: result.error });
    } else {
      toast({ title: 'Update successful', description: result.success });
    }
    setIsLoading(false);
  };

  const handleChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  

  return (
    <form onSubmit={handleSubmit}>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Announcement Bar</CardTitle>
                    <CardDescription>The text displayed at the very top of your site.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="announcement-text">Text</Label>
                        <Input 
                            id="announcement-text" 
                            value={content?.announcementBar?.text || ''}
                            onChange={(e) => handleChange('announcementBar', 'text', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Promotional Banner</CardTitle>
                    <CardDescription>The main banner on the homepage (e.g., Sahara Collection).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="promo-title">Title</Label>
                        <Input 
                            id="promo-title" 
                            value={content?.promoBanner?.title || ''}
                            onChange={(e) => handleChange('promoBanner', 'title', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="promo-subtitle">Subtitle</Label>
                        <Input 
                            id="promo-subtitle" 
                            value={content?.promoBanner?.subtitle || ''}
                            onChange={(e) => handleChange('promoBanner', 'subtitle', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="promo-button">Button Text</Label>
                        <Input 
                            id="promo-button" 
                            value={content?.promoBanner?.buttonText || ''}
                            onChange={(e) => handleChange('promoBanner', 'buttonText', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Homepage Categories</CardTitle>
                    <CardDescription>Control the 12 category thumbnails shown on the homepage. Use URLs from Media Manager (e.g. /images/your-file.jpg) or Supabase public URLs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 12 }).map((_, i) => {
                        const item = content?.homeCategories?.[i] || { name: '', img: '', href: '' };
                        return (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor={`hc-name-${i}`}>Name #{i+1}</Label>
                                    <Input id={`hc-name-${i}`} value={item.name}
                                        onChange={(e) => {
                                            const next = [...(content.homeCategories || Array(12).fill({ name:'', img:'', href:'' }))];
                                            next[i] = { ...next[i], name: e.target.value };
                                            setContent((prev: any) => ({ ...prev, homeCategories: next }));
                                        }} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`hc-img-${i}`}>Image URL</Label>
                                    <Input id={`hc-img-${i}`} placeholder="/images/your-file.jpg or https://..."
                                        value={item.img}
                                        onChange={(e) => {
                                            const next = [...(content.homeCategories || Array(12).fill({ name:'', img:'', href:'' }))];
                                            next[i] = { ...next[i], img: e.target.value };
                                            setContent((prev: any) => ({ ...prev, homeCategories: next }));
                                        }} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`hc-href-${i}`}>Link</Label>
                                    <Input id={`hc-href-${i}`} placeholder="/products/living"
                                        value={item.href}
                                        onChange={(e) => {
                                            const next = [...(content.homeCategories || Array(12).fill({ name:'', img:'', href:'' }))];
                                            next[i] = { ...next[i], href: e.target.value };
                                            setContent((prev: any) => ({ ...prev, homeCategories: next }));
                                        }} />
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => setContent(initialContent)} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Changes
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save Changes'}
            </Button>
        </div>
    </form>
  );
}
