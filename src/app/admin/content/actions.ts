'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const contentFilePath = path.join(process.cwd(), 'src/lib/content.json');

export async function getContent() {
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read content file:', error);
    // Return a default structure if the file doesn't exist or is invalid
    return {
      announcementBar: { text: '' },
      promoBanner: { title: '', subtitle: '', buttonText: '' },
    };
  }
}

export async function updateContent(newContent: any) {
  try {
    await fs.writeFile(contentFilePath, JSON.stringify(newContent, null, 2));
    // Revalidate all paths to ensure the new content is shown everywhere
    revalidatePath('/', 'layout');
    return { success: 'Content updated successfully.' };
  } catch (error) {
    console.error('Failed to write content file:', error);
    return { error: 'Failed to update content.' };
  }
}

const siteSettingsFilePath = path.join(process.cwd(), 'site-settings.json');

export async function getSiteSettings() {
  try {
    const fileContent = await fs.readFile(siteSettingsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read site settings file:', error);
    return {
      companyName: '',
      contactEmail: '',
      phoneNumber: '',
      address: '',
      homepage: {
        heroTitle: '',
        heroSubtitle: '',
        featuredTitle: '',
        featuredSubtitle: '',
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
      },
    };
  }
}

export async function saveSiteSettings(newSettings: any) {
  try {
    await fs.writeFile(siteSettingsFilePath, JSON.stringify(newSettings, null, 2));
    revalidatePath('/', 'layout');
    return { success: 'Site settings updated successfully.' };
  } catch (error) {
    console.error('Failed to write site settings file:', error);
    return { error: 'Failed to update site settings.' };
  }
}
