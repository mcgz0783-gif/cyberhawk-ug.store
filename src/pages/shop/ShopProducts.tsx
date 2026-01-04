import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard, Product } from "@/components/shop/ProductCard";
import productsData from "@/data/products.json";

interface ShopProductsProps {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function ShopProducts({ cart, setCart }: ShopProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load from local JSON data
    setProducts(productsData as Product[]);
  }, []);

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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

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
