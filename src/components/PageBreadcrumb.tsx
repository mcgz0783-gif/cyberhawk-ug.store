import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem as BreadcrumbItemUI,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemData[];
}

const BASE_URL = "https://cyberhawk.lovable.app";

const PageBreadcrumb = ({ items }: PageBreadcrumbProps) => {
  // Inject JSON-LD BreadcrumbList schema
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL + "/",
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.label,
          ...(item.href ? { item: BASE_URL + item.href } : {}),
        })),
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-breadcrumb-jsonld", "true");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.querySelectorAll('script[data-breadcrumb-jsonld]').forEach((s) => s.remove());
    };
  }, [items]);

  return (
    <nav aria-label="Breadcrumb" className="container mx-auto px-6 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItemUI>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItemUI>
          {items.map((item, index) => (
            <span key={index} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItemUI>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItemUI>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default PageBreadcrumb;
