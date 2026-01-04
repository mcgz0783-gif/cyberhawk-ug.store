import { Link } from "react-router-dom";
import { ShoppingCart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopNavbarProps {
  cartCount: number;
}

export function ShopNavbar({ cartCount }: ShopNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/shop" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="w-6 h-6 text-primary" />
          Cyberhawk Shop
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Main Site
          </Link>
          <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
            Products
          </Link>
          <Link to="/shop/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
          <Link to="/shop/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
