import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface InternalLink {
  href: string;
  label: string;
  description: string;
}

interface InternalLinksProps {
  title?: string;
  links?: InternalLink[];
  excludePath?: string;
}

const allLinks: InternalLink[] = [
  { href: "/services", label: "Our Services", description: "Network security, penetration testing & more" },
  { href: "/about", label: "About Us", description: "Meet the CyberHawk cybersecurity team" },
  { href: "/blog", label: "Blog", description: "Cybersecurity insights & best practices" },
  { href: "/contact", label: "Contact", description: "Get a free security consultation" },
  { href: "/shop", label: "Shop", description: "IT security hardware & equipment" },
  { href: "/ebooks", label: "Ebooks", description: "Cybersecurity guides & resources" },
];

const InternalLinks = ({ title = "Explore More", links, excludePath }: InternalLinksProps) => {
  const filtered = (links || allLinks).filter((l) => l.href !== excludePath);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group flex items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
            >
              <div>
                <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </p>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export { allLinks };
export default InternalLinks;
