'use client';

import { useState } from 'react';
import { uploadImage, deleteImage } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Copy, Trash2, Loader2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

import type { ImageDetails } from '../page';

interface MediaManagerProps {
  images: ImageDetails[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function MediaManager({ images: initialImages }: MediaManagerProps) {
  const { toast } = useToast();
  const [images, setImages] = useState(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await uploadImage(formData);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Upload failed', description: result.error });
    } else {
      toast({ title: 'Upload successful', description: result.success });
      // This is a simple way to refresh the data from the server after upload.
      // A more complex implementation could update state without a full reload.
      window.location.reload();
    }
    (event.target as HTMLFormElement).reset();
    setIsLoading(false);
  };

  const handleDelete = async (filename: string) => {
    const result = await deleteImage(filename);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Delete failed', description: result.error });
    } else {
      toast({ title: 'Delete successful', description: result.success });
      setImages(prev => prev.filter(img => img.name !== filename));
    }
  };

  const copyUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast({ title: 'Copied to clipboard!', description: fullUrl });
  };

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-4 p-4 border rounded-lg bg-slate-50">
        <label htmlFor="image" className="block text-sm font-medium mb-2">Upload New Image</label>
        <div className="flex items-center gap-4">
          <Input id="image" name="image" type="file" accept="image/*" required className="flex-1" />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...</> : 'Upload'}
          </Button>
        </div>
      </form>

      {/* Search and Filter */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium mb-2">Search Images</label>
        <div className="relative">
          <Input 
            id="search" 
            placeholder="Search by filename..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
             X
            </Button>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredImages.map((image) => (
          <div key={image.name} className="group relative border rounded-lg overflow-hidden flex flex-col">
            <div className="relative w-full aspect-square bg-muted">
                <Image src={image.url} alt={image.name} fill className="object-contain" />
            </div>
            <div className="p-2 border-t bg-slate-50 text-xs flex-grow">
                <p className="font-medium truncate" title={image.name}>{image.name}</p>
                <p className="text-muted-foreground">{formatBytes(image.size)}</p>
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" onClick={() => copyUrl(image.url)}>
                <Copy className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the image file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(image.name)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
