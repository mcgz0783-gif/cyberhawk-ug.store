import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = "https://cyberhawk.lovable.app";

const SEOHead = ({ title, description, canonical, type = "website", ogImage, jsonLd }: SEOHeadProps) => {
  const fullTitle = title === "Home" ? "CyberHawk UG - Sharp Vision in Cybersecurity" : `${title} | CyberHawk UG`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;
  const ogImageUrl = ogImage ? `${BASE_URL}${ogImage}` : `${BASE_URL}/og-images/og-home.png`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    if (canonicalUrl) {
      setMeta("og:url", canonicalUrl, true);
    }
    setMeta("og:image", ogImageUrl, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImageUrl);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonicalUrl);
    } else if (link) {
      link.remove();
    }

    // JSON-LD – supports single or multiple schemas
    document.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, i) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", `${i}`);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    };
  }, [fullTitle, description, canonicalUrl, type, jsonLd]);

  return null;
};

export default SEOHead;
