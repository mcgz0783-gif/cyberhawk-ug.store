import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  // Find related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-2xl mb-12"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("##")) {
                return (
                  <h2
                    key={i}
                    className="text-2xl md:text-3xl font-bold text-foreground mt-8 mb-4"
                  >
                    {trimmed.replace(/^##\s*/, "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("#"))
                return (
                  <h3
                    key={i}
                    className="text-xl md:text-2xl font-bold text-foreground mt-6 mb-3"
                  >
                    {trimmed.replace(/^#\s*/, "")}
                  </h3>
                );
              if (trimmed.startsWith(">"))
                return (
                  <blockquote
                    key={i}
                    className="ml-4 border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                  >
                    {trimmed.replace(/^>\s*/, "")}
                  </blockquote>
                );
              if (trimmed.match(/^- \*\*/))
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
                <p key={i} className="my-4 leading-relaxed text-muted-foreground">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-foreground mb-3">
            Need Cybersecurity Help?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Contact us today for a free security consultation. Our expert team is ready to help you protect your digital assets.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-brand text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-brand hover:shadow-elevated transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
