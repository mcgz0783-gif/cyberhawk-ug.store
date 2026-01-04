import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { ShopHome } from "./ShopHome";
import { ShopProducts } from "./ShopProducts";
import { ShopAdmin } from "./ShopAdmin";
import { Product } from "@/components/shop/ProductCard";

export function ShopLayout() {
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cyberhawk-cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cyberhawk-cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="min-h-screen bg-background">
      <ShopNavbar cartCount={cart.length} />
      <Routes>
        <Route index element={<ShopHome />} />
        <Route path="products" element={<ShopProducts cart={cart} setCart={setCart} />} />
        <Route path="admin" element={<ShopAdmin />} />
      </Routes>
    </div>
  );
}
