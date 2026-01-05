import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package, Trash2, Upload, Image, LogOut, Edit, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  stock: number;
  image_url: string | null;
  category_id: string | null;
  categories?: { name: string } | null;
}

export function ShopAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Role assignment state
  const [roleEmail, setRoleEmail] = useState("");
  const [roleType, setRoleType] = useState<"admin" | "moderator" | "user">("admin");
  const [assigningRole, setAssigningRole] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/shop/login");
        } else {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/shop/login");
      } else {
        setUser(session.user);
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function checkAdminRole(userId: string) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (error || !data) {
      await supabase.auth.signOut();
      navigate("/shop/login");
      return;
    }
    
    setAuthLoading(false);
    loadData();
  }

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
      .select("id, name, price, description, stock, image_url, category_id, categories(name)")
      .order("created_at", { ascending: false });
    
    if (productsData) {
      setProducts(productsData as Product[]);
    }
    
    setLoading(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleAddProduct() {
    if (!productName || !price) {
      alert("Please fill in product name and price");
      return;
    }

    setUploading(true);
    let imageUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const { error } = await supabase.from("products").insert({
      name: productName,
      price: Number(price),
      description: description || null,
      stock: stock ? Number(stock) : 0,
      category_id: categoryId || null,
      image_url: imageUrl,
    });

    if (error) {
      alert("Failed to add product: " + error.message);
      setUploading(false);
      return;
    }

    setProductName("");
    setPrice("");
    setDescription("");
    setStock("");
    setCategoryId("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
    loadData();
  }

  function startEdit(product: Product) {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditDescription(product.description || "");
    setEditStock(String(product.stock));
    setEditCategoryId(product.category_id || "");
    setEditImagePreview(product.image_url);
    setEditImageFile(null);
  }

  function cancelEdit() {
    setEditingProduct(null);
    setEditName("");
    setEditPrice("");
    setEditDescription("");
    setEditStock("");
    setEditCategoryId("");
    setEditImagePreview(null);
    setEditImageFile(null);
  }

  async function handleUpdateProduct() {
    if (!editingProduct || !editName || !editPrice) {
      alert("Please fill in product name and price");
      return;
    }

    setUploading(true);
    let imageUrl = editingProduct.image_url;

    if (editImageFile) {
      imageUrl = await uploadImage(editImageFile);
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: editName,
        price: Number(editPrice),
        description: editDescription || null,
        stock: editStock ? Number(editStock) : 0,
        category_id: editCategoryId || null,
        image_url: imageUrl,
      })
      .eq("id", editingProduct.id);

    if (error) {
      alert("Failed to update product: " + error.message);
      setUploading(false);
      return;
    }

    cancelEdit();
    setUploading(false);
    loadData();
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Failed to delete product: " + error.message);
      return;
    }
    loadData();
  }

  async function handleAssignRole() {
    if (!roleEmail) {
      alert("Please enter an email address");
      return;
    }

    setAssigningRole(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("assign-admin-role", {
        body: { targetUserEmail: roleEmail, role: roleType },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to assign role");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      alert(response.data?.message || "Role assigned successfully!");
      setRoleEmail("");
      setRoleDialogOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to assign role";
      alert(message);
    } finally {
      setAssigningRole(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/shop/login");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Logged in as <strong>{user?.email}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role to User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="roleEmail">User Email</Label>
                  <Input
                    id="roleEmail"
                    type="email"
                    placeholder="user@example.com"
                    value={roleEmail}
                    onChange={(e) => setRoleEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="roleType">Role</Label>
                  <Select value={roleType} onValueChange={(v) => setRoleType(v as "admin" | "moderator" | "user")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignRole} disabled={assigningRole} className="w-full">
                  {assigningRole ? "Assigning..." : "Assign Role"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Product
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                <Label>Price (UGX)</Label>
                <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock</Label>
                <Input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div>
              <Label>Product Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  ref={editFileInputRef}
                  onChange={handleEditImageChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => editFileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
                {editImagePreview && (
                  <img src={editImagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
                )}
              </div>
            </div>
            <Button onClick={handleUpdateProduct} className="w-full" disabled={uploading}>
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Product Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-3">
              <Input
                id="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
              )}
            </div>
          </div>
          <Button onClick={handleAddProduct} className="w-full" disabled={uploading}>
            {uploading ? "Adding..." : "Add Product"}
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
                <li key={product.id} className="flex justify-between items-center border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        <Image className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{product.name}</span>
                      {product.categories?.name && (
                        <span className="text-xs ml-2 text-muted-foreground">({product.categories.name})</span>
                      )}
                      <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">UGX {product.price.toLocaleString()}</span>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
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
