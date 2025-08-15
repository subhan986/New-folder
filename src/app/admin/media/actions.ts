'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File;
  if (!file || file.size === 0) {
    return { error: 'No file selected.' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  
  try {
    await fs.writeFile(
      path.join(process.cwd(), 'public/images/' + filename),
      buffer
    );
    revalidatePath('/admin/media');
    return { success: 'Image uploaded successfully.' };
  } catch (error) {
    return { error: 'Failed to upload image.' };
  }
}

export async function deleteImage(filename: string) {
  try {
    await fs.unlink(path.join(process.cwd(), 'public/images/' + filename));
    revalidatePath('/admin/media');
    return { success: 'Image deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete image.' };
  }
}
