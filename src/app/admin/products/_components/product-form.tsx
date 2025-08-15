
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import Image from 'next/image';
import { addProduct, updateProduct, deleteProduct } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Helper to convert specifications object to a string for the textarea
const specsToString = (specs: { [key: string]: string | undefined }): string => {
    return Object.entries(specs)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
};

// Helper to parse the string from the textarea back into a specifications object
const stringToSpecs = (str: string): { [key:string]: string } => {
    const specs: { [key: string]: string } = {};
    str.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();
            if (key && value) {
                specs[key] = value;
            }
        }
    });
    return specs;
};

// Helper to convert a file to a data URI
async function fileToDataUri(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


type CategoryOption = { id: string; name: string };

export function ProductForm({ product, categories = [] as CategoryOption[] }: { product?: Product; categories?: CategoryOption[] }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
    const [isNew, setIsNew] = useState(product?.isNew ?? false);
    const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images || []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviews = await Promise.all(files.map(fileToDataUri));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('isFeatured', String(isFeatured));
    formData.set('isNew', String(isNew));
    if (product) {
      formData.append('id', product.id);
    }

    const action = product ? updateProduct : addProduct;

    try {
      const result = await action(formData);
      if (!result || result?.success === false) {
        toast({ variant: "destructive", title: "An error occurred", description: result?.message || "Failed to save product." });
        setIsLoading(false);
        return;
      }
      toast({ title: product ? 'Product updated' : 'Product created', description: 'Your changes have been saved.' });
      setIsLoading(false);
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "An error occurred", description: "Something went wrong." });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={product?.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (PKR)</Label>
              <Input id="price" name="price" type="number" defaultValue={product?.price} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product?.description} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="care">Care Instructions</Label>
            <Textarea id="care" name="care" defaultValue={product?.care} placeholder="e.g. Professional cleaning recommended. Avoid direct sunlight."/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" defaultValue={undefined}>
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
                 <Label htmlFor="stockStatus">Stock Status</Label>
                <Select name="stockStatus" defaultValue={product?.stockStatus}>
                    <SelectTrigger id="stockStatus">
                    <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Made to Order">Made to Order</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="popularity">Popularity</Label>
              <Input id="popularity" name="popularity" type="number" defaultValue={product?.popularity} />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="color">Primary Color (for filtering)</Label>
              <Input id="color" name="color" defaultValue={product?.color} placeholder="e.g. Grey" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">Primary Material (for filtering)</Label>
              <Input id="material" name="material" defaultValue={product?.material} placeholder="e.g. Fabric" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="colors">Color Options (comma-separated)</Label>
              <Input id="colors" name="colors" defaultValue={product?.options?.colors?.join(', ')} placeholder="e.g. Charcoal Grey, Sand Beige" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="materials">Material Options (comma-separated)</Label>
              <Input id="materials" name="materials" defaultValue={product?.options?.materials?.join(', ')} placeholder="e.g. Linen Blend, Velvet" />
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="specifications">Specifications (one per line, format: Key: Value)</Label>
            <Textarea
              id="specifications"
              name="specifications"
              rows={5}
              placeholder="e.g.&#x0a;Dimensions: 220cm (W) x 90cm (D) x 80cm (H)&#x0a;Weight: 60kg"
              defaultValue={product?.specifications ? specsToString(product.specifications) : ''}
            />
          </div>
          <div className="grid gap-2">
                  <Label htmlFor="mainImage">Main Image</Label>
                  {product?.images?.[0] && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                      <Image 
                        src={product.images[0]} 
                        alt={`${product.name} main image`} 
                        width={100} 
                        height={100} 
                        className="rounded-md object-cover bg-muted p-1"
                      />
                    </div>
                  )}
                  <Input id="mainImage" name="mainImage" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">
                    Upload a new main image. Leave blank to keep the current one.
                  </p>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={product?.status || 'Active'}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gallery">Image Gallery</Label>
                  {product?.images && product.images.length > 1 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Current Gallery:</p>
                      <div className="flex gap-2 flex-wrap">
                        {product.images.slice(1).map((img, index) => (
                          <Image 
                            key={index}
                            src={img} 
                            alt={`${product.name} gallery image ${index + 1}`} 
                            width={80} 
                            height={80} 
                            className="rounded-md object-cover bg-muted p-1"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <Input id="galleryImages" name="galleryImages" type="file" accept="image/*" multiple onChange={handleImageChange} />
                  <input type="hidden" name="existingImages" defaultValue={product?.images?.join(',') || ''} />
                  <p className="text-sm text-muted-foreground">
                    Upload one or more new gallery images. New images will be added to the existing gallery.
                  </p>
                </div>
          <div className="grid gap-2">
              <Label htmlFor="redirectLink">Redirect Link</Label>
              <Input id="redirectLink" name="redirectLink" defaultValue={product?.redirectLink} placeholder="e.g. https://example.com/product-page" />
          </div>
           <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                    <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="isNew" checked={isNew} onCheckedChange={setIsNew}/>
                    <Label htmlFor="isNew">New Arrival</Label>
                </div>
            </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (product ? "Save Changes" : "Create Product")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

    