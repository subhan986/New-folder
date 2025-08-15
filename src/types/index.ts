export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  specifications: { [key: string]: string | undefined };
  status?: 'Active' | 'Archived' | undefined;
  care: string;
  stockStatus: 'In Stock' | 'Made to Order' | 'Out of Stock';
  redirectLink?: string;
  color: string;
  material: string;
  isFeatured?: boolean;
  isNew?: boolean;
  popularity: number;
  createdAt: string;
  options?: {
    colors?: string[];
    materials?: string[];
  };
  link?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Creator = {
  name: string;
  handle: string;
  avatar?: string; // Avatar is optional
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface Review {
    id: string;
    creator: Creator;
    thumbnail: string;
    videoUrl?: string;
    overlayText?: string;
    relatedProducts?: { id: string; name: string; redirectLink?: string }[];
    reviewText?: string;
}
