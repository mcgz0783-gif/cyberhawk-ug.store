import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";

/* ================= FIREBASE ================= */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

/* 🔥 REPLACE WITH YOUR REAL FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* ================= CONSTANTS ================= */
const ADMIN_NAME = "Mucunguzi Samuel";

/* ================= TYPES ================= */
type Product = {
  id?: string;
  name: string;
  price: number;
};

/* ================= NAVBAR ================= */
function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link to="/" className="font-bold text-lg">
        Cyberhawk UG
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/shop">Shop</Link>
        <Link to="/admin">Admin</Link>

        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ================= HOME ================= */
function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome to Cyberhawk UG</h1>
      <p className="mt-2">Secure IT appliances & services</p>
    </div>
  );
}

/* ================= SHOP ================= */
function Shop({
  cart,
  setCart,
}: {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const snap = await getDocs(collection(db, "products"));
      setProducts(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Product) }))
      );
    }
    loadProducts();
  }, []);

  function addToCart(product: Product) {
    setCart([...cart, product]);
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">IT Appliances Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="font-bold mt-2">
              UGX {p.price.toLocaleString()}
            </p>

            <button
              onClick={() => addToCart(p)}
              className="mt-3 flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Cart</h2>

        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <>
            <ul className="space-y-3">
              {cart.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span>
                    {item.name} – UGX{" "}
                    {item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 font-bold">
              Total: UGX {total.toLocaleString()}
            </div>

            <button
              className="mt-4 bg-green-600 text-white px-6 py-3 rounded"
              onClick={() =>
                alert("Checkout demo: MTN MoMo / Airtel Money")
              }
            >
              Checkout (MTN / Airtel)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= ADMIN LOGIN ================= */
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/admin");
    } catch {
      alert("Login failed");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-4"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black text-white w-full py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}

/* ================= ADMIN DASHBOARD ================= */
function Admin() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) nav("/admin-login");
    });
    return unsub;
  }, []);

  async function addProduct() {
    await addDoc(collection(db, "products"), {
      name: productName,
      price: Number(price),
    });
    setProductName("");
    setPrice("");
    alert("Product added successfully");
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mb-4">
        Logged in as <strong>{ADMIN_NAME}</strong>
      </p>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Price (UGX)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={addProduct}
        className="bg-black text-white w-full py-2 rounded"
      >
        Add Product
      </button>
    </div>
  );
}

/* ================= ROOT ================= */
export default function App() {
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Navbar cartCount={cart.length} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/shop"
          element={<Shop cart={cart} setCart={setCart} />}
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
