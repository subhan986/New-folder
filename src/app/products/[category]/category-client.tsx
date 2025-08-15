"use client";

import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Grid, List } from 'lucide-react';

interface CategoryClientProps {
  products: Product[];
  categoryName: string;
  colors: string[];
  materials: string[];
  maxPrice: number;
}

export default function CategoryClient({
  products,
  categoryName,
  colors,
  materials,
  maxPrice,
}: CategoryClientProps) {
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products
      .filter((p: Product) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p: Product) => selectedColors.includes(p.color));
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((p: Product) => selectedMaterials.includes(p.material));
    }

    // Sort products
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, priceRange, selectedColors, selectedMaterials, sortBy]);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">{filteredProducts.length} products found</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={maxPrice}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Rs. {priceRange[0].toLocaleString()}</span>
                  <span>Rs. {priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Colors</h3>
                  <div className="space-y-2">
                    {colors.map((color: string) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedColors([...selectedColors, color]);
                            } else {
                              setSelectedColors(selectedColors.filter((c: string) => c !== color));
                            }
                          }}
                        />
                        <label htmlFor={`color-${color}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {materials.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Materials</h3>
                  <div className="space-y-2">
                    {materials.map((material: string) => (
                      <div key={material} className="flex items-center space-x-2">
                        <Checkbox
                          id={`material-${material}`}
                          checked={selectedMaterials.includes(material)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMaterials([...selectedMaterials, material]);
                            } else {
                              setSelectedMaterials(selectedMaterials.filter((m: string) => m !== material));
                            }
                          }}
                        />
                        <label htmlFor={`material-${material}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {material}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {(selectedColors.length > 0 || selectedMaterials.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedColors([]);
                    setSelectedMaterials([]);
                    setPriceRange([0, maxPrice]);
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products match your filters</p>
              <Button
                onClick={() => {
                  setSelectedColors([]);
                  setSelectedMaterials([]);
                  setPriceRange([0, maxPrice]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {filteredProducts.map((product: Product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant={viewMode === 'list' ? 'list' : 'default'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
