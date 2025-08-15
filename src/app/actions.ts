"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { products as localProducts } from '@/lib/products';
import brandsJson from '@/lib/brands.json';
import categoriesJson from '@/lib/categories.json';
import { mockReviews as localReviews } from '@/lib/reviews';
import type { Product, Review, Category, Brand } from '@/types';

// Helper to parse the string from the textarea back into a specifications object
const stringToSpecs = (str: string): { [key:string]: string } => {
    if (!str) return {};
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

// --- DATA FETCHING FUNCTIONS ---

export async function getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
        return localProducts as unknown as Product[];
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, description, price, images, specifications, care,
          stock_status, status, color, material, redirect_link,
          is_featured, is_new, popularity, options, created_at, category_id,
          categories(name)
        `)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching products:', error.message || error);
        return [];
    }
    const rows = (data || []) as any[];
    return rows.map((p) => ({
        id: p.id,
        name: p.name,
        category: p?.categories?.name ?? '',
        price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
        images: Array.isArray(p.images) ? p.images : (p.images ?? []),
        description: p.description ?? '',
        specifications: p.specifications ?? {},
        care: p.care ?? '',
        stockStatus: p.stock_status ?? 'In Stock',
        status: p.status ?? 'Active',
        color: p.color ?? '',
        material: p.material ?? '',
        redirectLink: p.redirect_link ?? undefined,
        isFeatured: p.is_featured ?? false,
        isNew: p.is_new ?? false,
        popularity: p.popularity ?? 0,
        createdAt: p.created_at,
        options: p.options ?? {},
    })) as unknown as Product[];
}

export async function getReviews(): Promise<Review[]> {
    if (!isSupabaseConfigured()) {
        return localReviews as unknown as Review[];
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, creator, video_url, thumbnail, overlay_text, review_text, created_at,
          related_product_ids
        `)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
    const rows = (data || []) as any[];
    const reviewsWithProducts = await Promise.all(rows.map(async (r) => {
        const relatedProducts = r.related_product_ids && r.related_product_ids.length > 0
            ? await getProductsByIds(r.related_product_ids)
            : [];
        return {
            id: r.id,
            creator: r.creator ?? { name: '', handle: '' },
            thumbnail: r.thumbnail ?? '',
            videoUrl: r.video_url ?? '',
            overlayText: r.overlay_text ?? '',
            reviewText: r.review_text ?? '',
            relatedProducts: relatedProducts.map(p => ({ id: p.id, name: p.name, redirectLink: p.redirectLink })),
        };
    }));
    return reviewsWithProducts as unknown as Review[];
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
        // Filter local products by IDs if Supabase is not configured
        return localProducts.filter(p => ids.includes(p.id)) as unknown as Product[];
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, description, price, images, specifications, care,
          stock_status, status, color, material, redirect_link,
          is_featured, is_new, popularity, options, created_at, category_id,
          categories(name)
        `)
        .in('id', ids)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching products by IDs:', error.message || error);
        return [];
    }
    const rows = (data || []) as any[];
    return rows.map((p) => ({
        id: p.id,
        name: p.name,
        category: p?.categories?.name ?? '',
        price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
        images: Array.isArray(p.images) ? p.images : (p.images ?? []),
        description: p.description ?? '',
        specifications: p.specifications ?? {},
        care: p.care ?? '',
        stockStatus: p.stock_status ?? 'In Stock',
        status: p.status ?? 'Active',
        color: p.color ?? '',
        material: p.material ?? '',
        redirectLink: p.redirect_link ?? undefined,
        isFeatured: p.is_featured ?? false,
        isNew: p.is_new ?? false,
        popularity: p.popularity ?? 0,
        createdAt: p.created_at,
        options: p.options ?? {},
    })) as unknown as Product[];
}

export async function getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured()) {
        return categoriesJson as unknown as Category[];
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
}

export async function getBrands(): Promise<Brand[]> {
    if (!isSupabaseConfigured()) {
        return brandsJson as unknown as Brand[];
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
    if (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
    return data || [];
}

// --- PRODUCT ACTIONS ---

export async function addProduct(formData: FormData) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        // Accept multiple possible field names from the form
        const collectedFiles: File[] = [];
        const mainImage = formData.get('mainImage') as File | null;
        if (mainImage && (mainImage as File).size > 0) collectedFiles.push(mainImage as File);
        const galleryImages = formData.getAll('galleryImages') as File[];
        if (galleryImages && galleryImages.length) collectedFiles.push(...galleryImages.filter(f => f && f.size > 0));
        const legacyImages = formData.getAll('images') as File[]; // older field name
        if (legacyImages && legacyImages.length) collectedFiles.push(...legacyImages.filter(f => f && f.size > 0));

        const imageUrls: string[] = [];
        for (const file of collectedFiles) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extension = file.name.split('.').pop();
            const filePath = `products/${uniqueSuffix}.${extension}`;
            const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
            if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
            const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
            if (!publicUrlData) throw new Error('Could not get public URL for uploaded image.');
            imageUrls.push(publicUrlData.publicUrl);
        }

        const specificationsString = formData.get('specifications') as string;
        const specs = stringToSpecs(specificationsString);

        // Resolve category_id from a provided category slug/name if available
        let resolvedCategoryId: string | null = null;
        const providedCategory = (formData.get('category') as string | null)?.toString();
        const providedCategoryId = (formData.get('category_id') as string | null)?.toString();
        if (providedCategoryId) {
            resolvedCategoryId = providedCategoryId;
        } else if (providedCategory) {
            const normalized = providedCategory.toLowerCase().replace(/\s+/g, '-');
            const { data: cats } = await supabase.from('categories').select('id,name');
            const match = (cats || []).find(c => (c.name || '').toLowerCase().replace(/\s+/g, '-') === normalized);
            if (match) {
                resolvedCategoryId = match.id;
            } else {
                const { data: created, error: catErr } = await supabase.from('categories').insert({ name: providedCategory }).select('id').single();
                if (!catErr && created?.id) resolvedCategoryId = created.id;
            }
        }

        const newProductData = {
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            description: formData.get('description') as string,
            category_id: resolvedCategoryId,
            images: imageUrls,
            specifications: specs,
            care: formData.get('care') as string,
            stock_status: formData.get('stockStatus') as 'In Stock' | 'Made to Order' | 'Out of Stock',
            status: formData.get('status') as 'Active' | 'Archived',
            redirect_link: formData.get('redirectLink') as string || undefined,
            color: formData.get('color') as string,
            material: formData.get('material') as string,
            is_featured: formData.get('isFeatured') === 'true',
            is_new: formData.get('isNew') === 'true',
            popularity: parseInt(formData.get('popularity') as string || '0', 10),
            options: {
                colors: (formData.get('colors') as string)?.split(',').map(c => c.trim()).filter(Boolean),
                materials: (formData.get('materials') as string)?.split(',').map(m => m.trim()).filter(Boolean),
            },
        };

        const { error: insertError } = await supabase.from('products').insert(newProductData);
        if (insertError) throw new Error(`Failed to add product: ${insertError.message}`);

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, message: (error as Error).message || 'Failed to add product.' };
    }
}

export async function updateProduct(formData: FormData) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const productId = formData.get('id') as string;
        if (!productId) throw new Error('Product ID is missing.');

        const existingImages = (formData.get('existingImages') as string)?.split(',').filter(Boolean) || [];
        const newImageFiles: File[] = [];
        const galleryImages = formData.getAll('galleryImages') as File[];
        if (galleryImages && galleryImages.length) newImageFiles.push(...galleryImages.filter(f => f && f.size > 0));
        const legacyNew = formData.getAll('newImages') as File[];
        if (legacyNew && legacyNew.length) newImageFiles.push(...legacyNew.filter(f => f && f.size > 0));
        const mainImage = formData.get('mainImage') as File | null;
        if (mainImage && (mainImage as File).size > 0) newImageFiles.unshift(mainImage as File);
        const newImageUrls: string[] = [];

        for (const file of newImageFiles) {
            if (file.size > 0) {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                const extension = file.name.split('.').pop();
                const filePath = `products/${uniqueSuffix}.${extension}`;

                const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

                const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
                if (!publicUrlData) throw new Error('Could not get public URL for uploaded image.');
                newImageUrls.push(publicUrlData.publicUrl);
            }
        }
        const finalImages = [...existingImages, ...newImageUrls];

        const specificationsString = formData.get('specifications') as string;
        const specs = stringToSpecs(specificationsString);

        // Resolve category_id again if category provided
        let resolvedCategoryId: string | null = null;
        const providedCategory = (formData.get('category') as string | null)?.toString();
        const providedCategoryId = (formData.get('category_id') as string | null)?.toString();
        if (providedCategoryId) {
            resolvedCategoryId = providedCategoryId;
        } else if (providedCategory) {
            const normalized = providedCategory.toLowerCase().replace(/\s+/g, '-');
            const { data: cats } = await supabase.from('categories').select('id,name');
            const match = (cats || []).find(c => (c.name || '').toLowerCase().replace(/\s+/g, '-') === normalized);
            if (match) {
                resolvedCategoryId = match.id;
            } else {
                const { data: created, error: catErr } = await supabase.from('categories').insert({ name: providedCategory }).select('id').single();
                if (!catErr && created?.id) resolvedCategoryId = created.id;
            }
        }

        const updatedProductData = {
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            description: formData.get('description') as string,
            category_id: resolvedCategoryId,
            images: finalImages,
            specifications: specs,
            care: formData.get('care') as string,
            stock_status: formData.get('stockStatus') as 'In Stock' | 'Made to Order' | 'Out of Stock',
            status: formData.get('status') as 'Active' | 'Archived',
            redirect_link: formData.get('redirectLink') as string || undefined,
            color: formData.get('color') as string,
            material: formData.get('material') as string,
            is_featured: formData.get('isFeatured') === 'true',
            is_new: formData.get('isNew') === 'true',
            popularity: parseInt(formData.get('popularity') as string || '0', 10),
            options: {
                colors: (formData.get('colors') as string)?.split(',').map(c => c.trim()).filter(Boolean),
                materials: (formData.get('materials') as string)?.split(',').map(m => m.trim()).filter(Boolean),
            },
        };

        const { error: updateError } = await supabase.from('products').update(updatedProductData).eq('id', productId);
        if (updateError) throw new Error(`Failed to update product: ${updateError.message}`);

        revalidatePath('/admin/products');
        revalidatePath(`/product/${productId}`);
        revalidatePath('/products');
        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, message: (error as Error).message || 'Failed to update product.' };
    }
}

export async function deleteProduct(formData: FormData): Promise<void> {
    try {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase is not configured. Delete operation skipped.');
            return;
        }
        const supabase = getSupabase();
        const productId = formData.get('productId') as string; // Extract productId from formData
        if (!productId) {
            console.error('Product ID is missing for delete operation.');
            return;
        }

        const { data: product, error: fetchError } = await supabase.from('products').select('images').eq('id', productId).single();
        if (fetchError && fetchError.code !== 'PGRST116') throw new Error(`Could not fetch product: ${fetchError.message}`);

        if (product && product.images && product.images.length > 0) {
            const imagePaths = product.images.map((url: string) => {
                try {
                    const urlObject = new URL(url);
                    return urlObject.pathname.split('/product-images/')[1];
                } catch (e) {
                    console.error('Invalid image URL:', url);
                    return null;
                }
            }).filter(Boolean) as string[];

            if (imagePaths.length > 0) {
                const { error: storageError } = await supabase.storage.from('product-images').remove(imagePaths);
                if (storageError) console.error('Could not delete images:', storageError.message);
            }
        }

        const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);
        if (deleteError) throw new Error(`Failed to delete product: ${deleteError.message}`);

        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath(`/product/${productId}`);
        revalidatePath('/', 'layout');

        console.log('Product deleted successfully.');
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// --- REVIEW ACTIONS ---

export async function createReviewWithVideo(formData: FormData) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const videoFile = formData.get('video') as File;
        if (!videoFile || videoFile.size === 0) return { success: false, message: 'Video file is required.' };

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = videoFile.name.split('.').pop();
        const filePath = `reviews/${uniqueSuffix}.${extension}`;

        const { error: uploadError } = await supabase.storage.from('review-videos').upload(filePath, videoFile);
        if (uploadError) throw new Error(`Video upload failed: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage.from('review-videos').getPublicUrl(filePath);
        if (!publicUrlData) throw new Error('Could not get public URL for video.');

        const newReviewData = {
            creator: {
                name: formData.get('creatorName') as string,
                handle: formData.get('creatorHandle') as string,
            },
            video_url: publicUrlData.publicUrl,
            thumbnail: formData.get('thumbnail') as string || '',
            overlay_text: formData.get('overlayText') as string || '',
            review_text: formData.get('reviewText') as string || '',
            related_product_ids: formData.getAll('relatedProductIds') as string[],
        };

        const { error: insertError } = await supabase.from('reviews').insert(newReviewData);
        if (insertError) throw new Error(`Failed to create review: ${insertError.message}`);

        revalidatePath('/admin/pr');
        revalidatePath('/');

        return { success: true, message: 'Review created successfully!' };
    } catch (error) {
        console.error('Error creating review:', error);
        return { success: false, message: (error as Error).message || 'Failed to create review.' };
    }
}

export async function getSignedReviewUploadUrl(fileName: string) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const extension = (fileName?.split('.').pop() || 'mp4').toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filePath = `reviews/${uniqueSuffix}.${extension}`;

        const { data, error } = await supabase.storage.from('review-videos').createSignedUploadUrl(filePath);
        if (error || !data?.signedUrl) {
            return { success: false, message: error?.message || 'Failed to create signed upload URL.' };
        }
        const { data: publicUrlData } = supabase.storage.from('review-videos').getPublicUrl(filePath);
        return { success: true, signedUrl: data.signedUrl, path: filePath, publicUrl: publicUrlData?.publicUrl };
    } catch (error) {
        console.error('Error creating signed upload URL:', error);
        return { success: false, message: (error as Error).message || 'Failed to create signed upload URL.' };
    }
}

export async function createReviewRecord(payload: {
    creatorName: string;
    creatorHandle: string;
    overlayText?: string;
    reviewText?: string;
    relatedProductIds?: string[];
    videoPath: string;
}) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const { data: publicUrlData } = supabase.storage.from('review-videos').getPublicUrl(payload.videoPath);
        const publicUrl = publicUrlData?.publicUrl;

        const { error: insertError } = await supabase.from('reviews').insert({
            creator: { name: payload.creatorName, handle: payload.creatorHandle },
            video_url: publicUrl,
            thumbnail: '',
            overlay_text: payload.overlayText || '',
            review_text: payload.reviewText || '',
            related_product_ids: payload.relatedProductIds || [],
        });
        if (insertError) return { success: false, message: insertError.message };

        revalidatePath('/admin/pr');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating review record:', error);
        return { success: false, message: (error as Error).message || 'Failed to create review.' };
    }
}

export async function updateReview(formData: FormData) {
    'use server';
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const reviewId = formData.get('id') as string;
        if (!reviewId) {
            throw new Error('Review ID is missing.');
        }

        const videoFile = formData.get('videoFile') as File;
        let videoUrl = formData.get('existingVideoUrl') as string;

        // Handle new video upload
        if (videoFile && videoFile.size > 0) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const filePath = `reviews/${uniqueSuffix}-${videoFile.name}`;

            const { error: uploadError } = await supabase.storage
                .from('review-videos')
                .upload(filePath, videoFile);

            if (uploadError) {
                throw new Error(`Video upload failed: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
                .from('review-videos')
                .getPublicUrl(filePath);
            videoUrl = publicUrlData.publicUrl;

            // Delete the old video if it exists
            const oldVideoUrl = formData.get('existingVideoUrl') as string;
            if (oldVideoUrl) {
                try {
                    const oldVideoPath = new URL(oldVideoUrl).pathname.split('/review-videos/')[1];
                    await supabase.storage.from('review-videos').remove([oldVideoPath]);
                } catch (e) {
                    console.error("Failed to parse or delete old video, continuing update...");
                }
            }
        }

        const updatedReviewData = {
            creator: {
                name: formData.get('creatorName') as string,
                handle: formData.get('creatorHandle') as string,
            },
            video_url: videoUrl,
            overlay_text: formData.get('overlayText') as string,
            review_text: formData.get('reviewText') as string,
            related_product_ids: formData.getAll('related_product_ids') as string[],
        };

        const { error } = await supabase.from('reviews').update(updatedReviewData).eq('id', reviewId);

        if (error) {
            throw new Error(`Failed to update review: ${error.message}`);
        }

        revalidatePath('/admin/pr');
        return { success: true };

    } catch (error) {
        console.error('Error updating review:', error);
        return {
            success: false,
            message: (error as Error).message || 'Failed to update review.'
        };
    }
}

export async function deleteReview(reviewId: string) {
    'use server';
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const { data: review, error: fetchError } = await supabase.from('reviews').select('video_url').eq('id', reviewId).single();
        if (fetchError && fetchError.code !== 'PGRST116') throw new Error(`Could not fetch review: ${fetchError.message}`);

        if (review && review.video_url) {
            try {
                const urlObject = new URL(review.video_url);
                const videoPath = urlObject.pathname.split('/review-videos/')[1];
                if (videoPath) {
                    await supabase.storage.from('review-videos').remove([videoPath]);
                }
            } catch (e) {
                console.error('Invalid video URL or failed to remove from storage:', review.video_url);
            }
        }

        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (error) throw error;

        revalidatePath('/admin/pr');
        revalidatePath('/');

        return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
        console.error('Error deleting review:', error);
        return { success: false, message: 'Failed to delete review' };
    }
}

// --- CATEGORY ACTIONS ---

export async function updateCategory(categoryData: Omit<Category, 'id' | 'created_at'> & { id?: string }) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const { id, ...dataToSave } = categoryData;
        if (id) {
            const { error } = await supabase.from('categories').update(dataToSave).eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('categories').insert(dataToSave);
            if (error) throw error;
        }
        revalidatePath('/admin/categories');
        if (id) revalidatePath(`/admin/categories/${id}`);
        return { success: true, message: 'Category saved successfully' };
    } catch (error) {
        console.error('Error saving category:', error);
        return { success: false, message: 'Failed to save category' };
    }
}

export async function deleteCategory(categoryId: string) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const { error } = await supabase.from('categories').delete().eq('id', categoryId);
        if (error) throw error;
        revalidatePath('/admin/categories');
        return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, message: 'Failed to delete category' };
    }
}

// --- BRAND ACTIONS ---

export async function updateBrand(formData: FormData) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const brandId = formData.get('id') as string | null;
        const name = formData.get('name') as string;
        const logoFile = formData.get('logo') as File;
        const currentLogo = formData.get('currentLogo') as string;
        let logoPath = currentLogo;

        if (logoFile && logoFile.size > 0) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extension = logoFile.name.split('.').pop();
            const filePath = `brands/${uniqueSuffix}.${extension}`;

            const { error: uploadError } = await supabase.storage.from('brand-logos').upload(filePath, logoFile);
            if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);

            const { data: publicUrlData } = supabase.storage.from('brand-logos').getPublicUrl(filePath);
            if (!publicUrlData) throw new Error('Could not get public URL for logo.');
            logoPath = publicUrlData.publicUrl;
        }

        const brandData = { name, logo: logoPath };

        if (brandId) {
            const { error } = await supabase.from('brands').update(brandData).eq('id', brandId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('brands').insert(brandData);
            if (error) throw error;
        }

        revalidatePath('/admin/brands');
        if (brandId) revalidatePath(`/admin/brands/${brandId}`);

        return { success: true, message: 'Brand saved successfully' };
    } catch (error) {
        console.error('Error saving brand:', error);
        return { success: false, message: 'Failed to save brand' };
    }
}

export async function deleteBrand(brandId: string) {
    try {
        if (!isSupabaseConfigured()) {
            return { success: false, message: 'Supabase is not configured on the server.' };
        }
        const supabase = getSupabase();
        const { data: brand, error: fetchError } = await supabase.from('brands').select('logo').eq('id', brandId).single();
        if (fetchError && fetchError.code !== 'PGRST116') throw new Error(`Could not fetch brand: ${fetchError.message}`);

        if (brand && brand.logo) {
            try {
                const urlObject = new URL(brand.logo);
                const logoPath = urlObject.pathname.split('/brand-logos/')[1];
                if (logoPath) {
                    await supabase.storage.from('brand-logos').remove([logoPath]);
                }
            } catch (e) {
                console.error('Invalid logo URL or failed to remove from storage:', brand.logo);
            }
        }

        const { error: deleteError } = await supabase.from('brands').delete().eq('id', brandId);
        if (deleteError) throw deleteError;

        revalidatePath('/admin/brands');
        return { success: true, message: 'Brand deleted successfully' };
    } catch (error) {
        console.error('Error deleting brand:', error);
        return { success: false, message: 'Failed to delete brand' };
    }
}

// --- OTHER ACTIONS ---

export async function login(formData: FormData): Promise<{ success: boolean; message?: string }> {
    // Placeholder for login logic
    console.log('Login attempt with:', formData.get('email'));
    // In a real application, you would validate credentials and set up a session
    // For now, always succeed for demonstration
    return { success: true, message: 'Login successful!' };
}

export async function placeOrder(formData: FormData): Promise<{ success: boolean; message?: string }> {
    try {
        const customerDetails = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            address: formData.get('address') as string,
            city: formData.get('city') as string,
            phone: formData.get('phone') as string,
            paymentMethod: formData.get('paymentMethod') as string,
        };
        const cartItems = JSON.parse(formData.get('cartItems') as string);
        const cartTotal = parseFloat(formData.get('cartTotal') as string);

        console.log('Placing order for:', customerDetails, 'with cart items:', cartItems, 'total:', cartTotal);
        // In a real application, you would save this order to a database
        return { success: true, message: 'Order placed successfully!' };
    } catch (error) {
        console.error('Error placing order:', error);
        return { success: false, message: (error as Error).message || 'Failed to place order.' };
    }
}

export async function logout() {
  redirect('/login');
}
