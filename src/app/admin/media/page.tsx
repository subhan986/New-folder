import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaManager } from './_components/media-manager';

export interface ImageDetails {
  name: string;
  size: number; // in bytes
  url: string;
}

export default async function MediaPage() {
  const imageDirectory = path.join(process.cwd(), 'public/images');
  let images: ImageDetails[] = [];

  try {
    const files = await fs.readdir(imageDirectory);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|svg)$/i.test(file)
    );

    const detailedImages = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = path.join(imageDirectory, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          size: stats.size,
          url: `/images/${file}`,
        };
      })
    );

    images = detailedImages.sort((a, b) => a.name.localeCompare(b.name));

  } catch (error) {
    console.error("Could not read the images directory:", error);
    // The directory might not exist on the first run, which is fine.
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Manager</CardTitle>
        <CardDescription>Upload and manage images for your site. Click the copy icon to get an image's URL.</CardDescription>
      </CardHeader>
      <CardContent>
        <MediaManager images={images} />
      </CardContent>
    </Card>
  );
}
