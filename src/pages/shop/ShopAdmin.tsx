import { useState, useEffect } from "react";
import { Plus, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_NAME = "Mucunguzi Samuel";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  categories?: { name: string } | null;
}

export function ShopAdmin() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    
    if (categoriesData) {
      setCategories(categoriesData);
    }

    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, price, category_id, categories(name)")
      .order("created_at", { ascending: false });
    
    if (productsData) {
      setProducts(productsData as Product[]);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddProduct() {
    if (!productName || !price) {
      alert("Please fill in product name and price");
      return;
    }

    const { error } = await supabase.from("products").insert({
      name: productName,
      price: Number(price),
      category_id: categoryId || null,
    });

    if (error) {
      alert("Failed to add product: " + error.message);
      return;
    }

    setProductName("");
    setPrice("");
    setCategoryId("");
    loadData();
  }

  async function handleDeleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Failed to delete product: " + error.message);
      return;
    }
    loadData();
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
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <ul className="space-y-3">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center border rounded-lg p-3"
                >
                  <div>
                    <span className="font-medium">{product.name}</span>
                    {product.categories?.name && (
                      <span className="text-xs ml-2 text-muted-foreground">
                        ({product.categories.name})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      UGX {product.price.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
