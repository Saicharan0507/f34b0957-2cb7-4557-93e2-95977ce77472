import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Truck, Leaf, Award, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: 'bins' | 'tools' | 'organic' | 'educational';
  image: string;
  inStock: boolean;
  featured?: boolean;
}

const PurchaseSection = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bins' | 'tools' | 'organic' | 'educational'>('all');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const products: Product[] = [
    {
      id: '1',
      name: 'Smart Segregation Bin Set',
      description: '3-compartment smart bin with sensors for wet, dry, and hazardous waste',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 156,
      category: 'bins',
      image: '/api/placeholder/300/200',
      inStock: true,
      featured: true
    },
    {
      id: '2',
      name: 'Compost Maker Kit',
      description: 'Complete kit for home composting with organic activator and guide',
      price: 149,
      rating: 4.6,
      reviews: 89,
      category: 'tools',
      image: '/api/placeholder/300/200',
      inStock: true
    },
    {
      id: '3',
      name: 'Organic Waste Decomposer',
      description: 'Accelerates composting process, 100% organic and eco-friendly',
      price: 49,
      originalPrice: 69,
      rating: 4.7,
      reviews: 234,
      category: 'organic',
      image: '/api/placeholder/300/200',
      inStock: true,
      featured: true
    },
    {
      id: '4',
      name: 'Waste Management Handbook',
      description: 'Comprehensive guide to sustainable waste management practices',
      price: 79,
      rating: 4.9,
      reviews: 67,
      category: 'educational',
      image: '/api/placeholder/300/200',
      inStock: true
    },
    {
      id: '5',
      name: 'Recycling Sorting Tray',
      description: 'Multi-compartment tray for easy sorting of recyclable materials',
      price: 89,
      rating: 4.4,
      reviews: 45,
      category: 'tools',
      image: '/api/placeholder/300/200',
      inStock: false
    },
    {
      id: '6',
      name: 'Biodegradable Trash Bags',
      description: 'Pack of 100 eco-friendly, biodegradable waste bags',
      price: 29,
      rating: 4.5,
      reviews: 189,
      category: 'tools',
      image: '/api/placeholder/300/200',
      inStock: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'bins', name: 'Smart Bins', icon: ShoppingCart },
    { id: 'tools', name: 'Tools & Equipment', icon: Truck },
    { id: 'organic', name: 'Organic Products', icon: Leaf },
    { id: 'educational', name: 'Educational', icon: Award }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * qty : 0);
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            {t('purchase')} - Eco Store
          </h2>
          <p className="text-muted-foreground">
            Sustainable products for effective waste management
          </p>
        </div>
        
        {getTotalItems() > 0 && (
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Cart: {getTotalItems()} items (₹{getTotalPrice()})
            </Badge>
            <Button className="bg-gradient-primary">
              Checkout
            </Button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id as any)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Featured Products Banner */}
      {selectedCategory === 'all' && (
        <div className="bg-gradient-primary rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🌟 Featured Products</h3>
          <p className="opacity-90">Special offers on our best-selling eco-friendly products!</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-gradient-card shadow-md hover:shadow-lg transition-all group">
            {product.featured && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-warning text-warning-foreground">
                  Featured
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="aspect-video bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <Button
                className="w-full bg-gradient-secondary hover:scale-105 transition-transform"
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock}
              >
                {!product.inStock ? (
                  'Out of Stock'
                ) : cart[product.id] ? (
                  `Added to Cart (${cart[product.id]})`
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            Try selecting a different category
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchaseSection;