import { useState, useEffect } from "react";
import { Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopProductsProps {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function ShopProducts({ cart, setCart }: ShopProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load products
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          category_id,
          stock,
          featured,
          categories(name, slug)
        `)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data: productsData } = await query;
      
      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image_url,
          categoryName: (p.categories as any)?.name
        })));
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function addToCart(product: Product) {
    setCart([...cart, product]);
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function handleCheckout() {
    alert("Checkout demo: Payment via MTN MoMo or Airtel Money will be processed.");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">IT Appliances</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {/* Cart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart ({cart.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              <ul className="space-y-3 mb-6">
                {cart.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center border rounded-lg p-3"
                  >
                    <span>
                      {item.name} – UGX {item.price.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(i)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xl font-bold">
                  Total: UGX {total.toLocaleString()}
                </span>
                <Button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700">
                  Checkout (MTN / Airtel)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
