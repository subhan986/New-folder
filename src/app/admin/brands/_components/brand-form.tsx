"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Brand } from '@/types';
import { updateBrand } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface BrandFormProps {
  brand?: Brand;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // Append the existing brand ID if we are editing
    if (brand?.id) {
      formData.append('id', brand.id);
    }

    const result = await updateBrand(formData);


    setIsLoading(false);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      router.push('/admin/brands');
      router.refresh();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="grid gap-4 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={brand?.name} 
              placeholder="e.g. Herman Miller"
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logo">Brand Logo</Label>
            {brand?.logo && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">Current Logo:</p>
                <Image 
                  src={brand.logo} 
                  alt={`${brand.name} logo`} 
                  width={80} 
                  height={80} 
                  className="rounded-md object-contain bg-muted p-1"
                />
              </div>
            )}
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
            />
            <input type="hidden" name="currentLogo" defaultValue={brand?.logo || ''} />
            <p className="text-sm text-muted-foreground">
              Upload a new logo. Leave blank to keep the current logo.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Brand'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
