import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://cyberhawk.lovable.app";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/services", changefreq: "monthly", priority: "0.9" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/contact", changefreq: "monthly", priority: "0.8" },
  { loc: "/blog", changefreq: "weekly", priority: "0.8" },
  { loc: "/shop", changefreq: "weekly", priority: "0.7" },
  { loc: "/shop/products", changefreq: "weekly", priority: "0.7" },
  { loc: "/ebooks", changefreq: "weekly", priority: "0.7" },
];

// Static blog post slugs — keep in sync with src/data/blogPosts.ts
const blogSlugs = [
  "cyberhawk-ug-uganda-trusted-cybersecurity-partner-2025",
  "top-10-cybersecurity-threats-2025",
  "why-your-business-needs-security-operations-center",
  "essential-guide-employee-security-training",
  "understanding-zero-trust-architecture",
  "incident-response-what-to-do-when-breached",
  "cloud-security-best-practices-2025",
];

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Fetch published ebooks and products in parallel
  const [{ data: ebooks }, { data: products }] = await Promise.all([
    supabase
      .from("ebooks")
      .select("slug, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, updated_at")
      .order("created_at", { ascending: false }),
  ]);

  const urlEntries = staticPages.map(
    (p) =>
      `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  );

  // Add blog post URLs
  for (const slug of blogSlugs) {
    urlEntries.push(
      `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    );
  }

  if (ebooks) {
    for (const ebook of ebooks) {
      const lastmod = ebook.updated_at
        ? new Date(ebook.updated_at).toISOString().split("T")[0]
        : "";
      urlEntries.push(
        `  <url>
    <loc>${BASE_URL}/ebooks/${escapeXml(ebook.slug)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`,
      );
    }
  }

  if (products) {
    for (const product of products) {
      const lastmod = product.updated_at
        ? new Date(product.updated_at).toISOString().split("T")[0]
        : "";
      urlEntries.push(
        `  <url>
    <loc>${BASE_URL}/shop/products?product=${escapeXml(product.id)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
});
