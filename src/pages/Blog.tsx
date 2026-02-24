import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import InternalLinks from "@/components/InternalLinks";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Cybersecurity Threats to Watch in 2025",
    excerpt: "As technology evolves, so do cyber threats. Learn about the latest attack vectors and how to protect your organization from emerging risks.",
    author: "CyberHawk Team",
    date: "December 28, 2024",
    category: "Threat Intelligence",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Why Your Business Needs a Security Operations Center",
    excerpt: "Discover the benefits of having a dedicated SOC and how it can significantly improve your organization's security posture and incident response times.",
    author: "Security Analyst",
    date: "December 20, 2024",
    category: "Security Operations",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The Essential Guide to Employee Security Training",
    excerpt: "Human error remains the leading cause of data breaches. Learn how to implement effective security awareness training that actually works.",
    author: "Training Team",
    date: "December 15, 2024",
    category: "Training",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Understanding Zero Trust Architecture",
    excerpt: "Zero Trust is more than a buzzword. Explore the principles behind this security model and how to implement it in your organization.",
    author: "CyberHawk Team",
    date: "December 10, 2024",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "Incident Response: What to Do When You've Been Breached",
    excerpt: "A step-by-step guide to handling security incidents effectively. Minimize damage and recover faster with proper incident response procedures.",
    author: "Incident Response Team",
    date: "December 5, 2024",
    category: "Incident Response",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    readTime: "10 min read",
  },
  {
    id: 6,
    title: "Cloud Security Best Practices for 2025",
    excerpt: "As more businesses migrate to the cloud, security challenges evolve. Learn the essential practices to secure your cloud infrastructure.",
    author: "Cloud Security Expert",
    date: "November 28, 2024",
    category: "Cloud Security",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    readTime: "6 min read",
  },
];

const categories = [
  "All",
  "Threat Intelligence",
  "Security Operations",
  "Training",
  "Cloud Security",
  "Incident Response",
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog"
        description="Cybersecurity insights, tips, and best practices from CyberHawk UG experts. Stay ahead of cyber threats in Uganda and East Africa."
        canonical="/blog"
        ogImage="/og-images/og-blog.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "CyberHawk UG Cybersecurity Blog",
          url: "https://cyberhawk.lovable.app/blog",
          publisher: { "@type": "Organization", name: "CyberHawk UG" },
          blogPost: blogPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Person", name: post.author },
            datePublished: post.date,
            articleSection: post.category,
          })),
        }}
      />
      <Header />
      <PageBreadcrumb items={[{ label: "Blog" }]} />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Cybersecurity <span className="text-primary">Insights</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Stay informed with the latest cybersecurity news, tips, and best practices from our expert team.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 text-primary font-medium text-sm group/btn">
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-secondary text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay Ahead of Cyber Threats
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Subscribe to our newsletter for weekly cybersecurity insights, tips, and industry updates delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-gradient-brand text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow-brand hover:shadow-elevated transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <InternalLinks excludePath="/blog" />
      <Footer />
    </div>
  );
};

export default Blog;
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-NS8GRGM8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GT-NS8GRGM8');
</script>
