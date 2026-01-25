import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, User, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import cyberHawkLogo from "@/assets/cyberhawk-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ email: session.user.email || "" });
          loadProfile(session.user.id);
        } else {
          setUser(null);
          setAvatarUrl(null);
          setDisplayName(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email || "" });
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, display_name")
      .eq("user_id", userId)
      .single();

    if (data) {
      setAvatarUrl(data.avatar_url);
      setDisplayName(data.display_name);
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!roleData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAvatarUrl(null);
    setDisplayName(null);
    setIsAdmin(false);
    navigate("/");
  };

  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/shop", label: "Shop" },
    { href: "/ebooks", label: "Ebooks" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={cyberHawkLogo}
              alt="CyberHawk UG"
              className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-foreground">CyberHawk</span>
              <span className="text-muted-foreground ml-1">UG</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
              <Moon className="absolute top-2.5 left-2.5 w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            </button>

            {/* Profile Dropdown for logged-in users */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-display">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/shop/admin" className="flex items-center gap-2 cursor-pointer">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/shop/auth"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground font-medium"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* CTA Button */}
            <Link
              to="/contact"
              className="hidden md:inline-flex bg-gradient-brand text-primary-foreground px-6 py-2.5 rounded-lg font-semibold shadow-brand hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Protected
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 transition-colors ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-display">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">My Profile</span>
                </Link>
              ) : (
                <Link
                  to="/shop/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
              )}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gradient-brand text-primary-foreground px-6 py-3 rounded-lg font-semibold text-center shadow-brand mt-2"
              >
                Get Protected
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
