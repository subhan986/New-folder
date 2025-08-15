"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
import { AddToCartButton } from './add-to-cart-button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import type { Product } from '@/types';

function getYoutubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  let videoId: string | undefined;
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default function ProductDetailsClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.options?.colors?.[0] || product?.color);
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>(product?.options?.materials?.[0] || product?.material);

  const productWithOptions: Product = {
    ...product,
    color: selectedColor || product.color,
    material: selectedMaterial || product.material,
  } as Product;

  const videoEmbedUrl = getYoutubeEmbedUrl(product.video);

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <Image
                      src={img}
                      alt={`${product.name} - view ${index + 1}`}
                      width={800}
                      height={600}
                      className="object-cover w-full aspect-[4/3]"
                    />
                  </Card>
                </CarouselItem>
              ))}
              {videoEmbedUrl && (
                <CarouselItem>
                  <Card className="overflow-hidden">
                    <div className="aspect-[4/3] w-full bg-black flex items-center justify-center">
                      <iframe
                        width="100%"
                        height="100%"
                        src={videoEmbedUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="border-0"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col">
          <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-bold text-2xl text-primary">PKR {product.price.toLocaleString()}</p>
            <Badge variant={product.stockStatus === 'In Stock' ? 'default' : 'destructive'} className="bg-primary/20 text-primary-foreground">
              {product.stockStatus}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6 space-y-6">
            {product.options?.colors && product.options.colors.length > 0 && (
              <div>
                <Label className="text-lg font-medium">
                  Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                </Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2 mt-2">
                  {product.options.colors.map((color) => (
                    <FormItem key={color}>
                      <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                      <Label
                        htmlFor={`color-${color}`}
                        className="cursor-pointer rounded-full h-8 w-8 border-2 transition-colors flex items-center justify-center has-[:checked]:ring-2 has-[:checked]:ring-offset-2 has-[:checked]:ring-primary"
                        style={{ backgroundColor: color.toLowerCase().replace(/\s/g, '') }}
                      />
                    </FormItem>
                  ))}
                </RadioGroup>
              </div>
            )}

            {product.options?.materials && product.options.materials.length > 0 && (
              <div>
                <Label className="text-lg font-medium">
                  Material: <span className="font-normal text-muted-foreground">{selectedMaterial}</span>
                </Label>
                <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial} className="flex flex-wrap gap-2 mt-2">
                  {product.options.materials.map((material) => (
                    <FormItem key={material} className="flex items-center">
                      <RadioGroupItem value={material} id={`material-${material}`} className="sr-only" />
                      <Label
                        htmlFor={`material-${material}`}
                        className="cursor-pointer font-normal rounded-md border border-input px-3 py-1.5 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-colors"
                      >
                        {material}
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </div>
            )}

            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="font-medium text-muted-foreground">{key}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Care Instructions</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{product.care}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-auto pt-6 space-y-4">
            <AddToCartButton product={productWithOptions} />
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className="font-headline text-3xl font-bold text-center mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
