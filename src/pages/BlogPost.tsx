import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import InternalLinks from "@/components/InternalLinks";
import { blogPosts } from "@/data/blogPosts";
import { Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage="/og-images/og-blog.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          author: { "@type": "Person", name: post.author },
          publisher: {
            "@type": "Organization",
            name: "CyberHawk UG",
            logo: {
              "@type": "ImageObject",
              url: "https://cyberhawk.lovable.app/og-images/og-home.png",
            },
          },
          datePublished: post.date,
          articleSection: post.category,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://cyberhawk.lovable.app/blog/${post.slug}`,
          },
        }}
      />
      <Header />
      <PageBreadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Hero image */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-li:text-muted-foreground">
            {post.content.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## "))
                return (
                  <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
                    {trimmed.slice(3)}
                  </h2>
                );
              if (trimmed.startsWith("### "))
                return (
                  <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                    {trimmed.slice(4)}
                  </h3>
                );
              if (trimmed.startsWith("> "))
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground"
                  >
                    {trimmed.slice(2)}
                  </blockquote>
                );
              if (trimmed.startsWith("- **"))
                return (
                  <li key={i} className="ml-6 my-1 list-disc">
                    <strong>{trimmed.match(/\*\*(.*?)\*\*/)?.[1]}</strong>
                    {trimmed.replace(/- \*\*.*?\*\*/, "")}
                  </li>
                );
              if (trimmed.match(/^\d+\. \*\*/))
                return (
                  <li key={i} className="ml-6 my-1 list-decimal">
                    <strong>{trimmed.match(/\*\*(.*?)\*\*/)?.[1]}</strong>
                    {trimmed.replace(/^\d+\. \*\*.*?\*\*/, "")}
                  </li>
                );
              return (
                <p key={i} className="my-4 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border text-center">
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">
              Need Cybersecurity Help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              CyberHawk UG is here to protect your business. Get a free security consultation today.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-brand text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-brand hover:shadow-elevated transition-all"
            >
              Contact Us
            </Link>
          </div>

          {/* Related Posts */}
          {(() => {
            const related = blogPosts
              .filter((p) => p.slug !== post.slug)
              .sort((a, b) => (a.category === post.category ? -1 : 0) - (b.category === post.category ? -1 : 0))
              .slice(0, 3);
            return related.length > 0 ? (
              <section className="mt-16 pt-12 border-t border-border">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Related Articles
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to={`/blog/${r.slug}`}
                      className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-elevated transition-all duration-300"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={r.image}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {r.category}
                        </span>
                        <h3 className="font-display font-semibold text-foreground mt-3 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {r.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {r.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null;
          })()}
        </div>
      </article>

      <InternalLinks excludePath={`/blog/${post.slug}`} />
      <Footer />
    </div>
  );
};

export default BlogPost;
