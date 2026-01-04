"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ShoppingCart, Trash2 } from "lucide-react";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= CONSTANTS ================= */
const ADMIN_NAME = "mucunguzi Samuel";

/* ================= AUTH CONTEXT ================= */
const AuthContext = createContext<{ user: User | null; role: string | null }>({
  user: null,
  role: null,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setRole(snap.exists() ? snap.data().role : "user");
      } else {
        setRole(null);
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

/* ================= ROOT APP ================= */
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
}

/* ================= LOGIN ================= */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      alert("Login failed");
    }
  }

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login} className="bg-black text-white w-full py-2">
        Login
      </button>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard() {
  const { user, role } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome {user?.email}</h1>
      <p>Role: {role}</p>
      <button
        onClick={() => signOut(auth)}
        className="text-red-600 mb-6 border px-4 py-2"
      >
        Logout
      </button>

      {role === "admin" && <AdminPanel />}
      <Shop />
    </div>
  );
}

/* ================= ADMIN PANEL ================= */
function AdminPanel() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct() {
    await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      image,
      createdBy: ADMIN_NAME,
    });
    setName("");
    setPrice("");
    setImage("");
    loadProducts();
  }

  return (
    <div className="border p-4 mb-6">
      <h2 className="text-xl font-bold mb-2">Admin Panel</h2>
      <input
        placeholder="Product name"
        className="border p-2 w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        className="border p-2 w-full mb-2"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        placeholder="Image URL"
        className="border p-2 w-full mb-2"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button onClick={addProduct} className="bg-black text-white px-4 py-2 w-full">
        Add Product
      </button>

      <h3 className="mt-4 font-bold">Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id} className="border p-2 mb-2 flex gap-2 items-center">
            <img src={p.image} alt={p.name} width={50} />
            {p.name} — {p.price} — by {p.createdBy}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= SHOP ================= */
function Shop() {
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function addToCart(p: any) {
    setCart([...cart, p]);
  }

  function removeFromCart(i: number) {
    setCart(cart.filter((_, index) => index !== i));
  }

  function checkout() {
    // MTN / Airtel demo backend
    fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ cart }),
    }).then(() => alert("Payment request sent"));
  }

  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div className="border p-4">
      <h2 className="text-xl font-bold mb-2">Shop</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-2 rounded">
            <img src={p.image} alt={p.name} className="mb-2" />
            <h3 className="font-bold">{p.name}</h3>
            <p>UGX {p.price}</p>
            <button
              className="bg-black text-white px-2 py-1 mt-1"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h3 className="mt-4 font-bold">Cart</h3>
      <ul>
        {cart.map((item, i) => (
          <li key={i} className="flex justify-between border p-2 mb-1">
            {item.name} — {item.price}
            <button onClick={() => removeFromCart(i)} className="text-red-600">
              <Trash2 />
            </button>
          </li>
        ))}
      </ul>
      <div className="font-bold mt-2">Total: UGX {total}</div>
      <button
        onClick={checkout}
        className="bg-green-600 text-white px-4 py-2 mt-2"
      >
        Checkout (MTN/Airtel)
      </button>
    </div>
  );
}
