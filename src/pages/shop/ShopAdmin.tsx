import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import productsData from "@/data/products.json";
import { Product } from "@/components/shop/ProductCard";

const ADMIN_NAME = "Mucunguzi Samuel";

export function ShopAdmin() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [products] = useState<Product[]>(productsData as Product[]);

  function handleAddProduct() {
    if (!productName || !price) {
      alert("Please fill in all fields");
      return;
    }
    // Demo: In production, this would save to database
    alert(`Product "${productName}" added successfully!\n\nNote: Enable Lovable Cloud for persistent storage.`);
    setProductName("");
    setPrice("");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Logged in as <strong>{ADMIN_NAME}</strong>
        </p>
      </div>

      {/* Add Product Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="price">Price (UGX)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <Button onClick={handleAddProduct} className="w-full">
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Current Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center border rounded-lg p-3"
              >
                <span className="font-medium">{product.name}</span>
                <span className="text-muted-foreground">
                  UGX {product.price.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
