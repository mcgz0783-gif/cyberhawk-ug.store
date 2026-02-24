import { Link } from "react-router-dom";
import { Shield, Eye, Zap, ArrowRight, Phone, MessageCircle, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import cyberHawkLogo from "@/assets/cyberhawk-logo.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { EbookCard } from "@/components/ebooks/EbookCard";
import SEOHead from "@/components/SEOHead";
const Index = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello CyberHawk! I'm interested in your cybersecurity services.");
    window.open(`https://wa.me/250788213106?text=${message}`, "_blank");
  };

  const { data: featuredEbooks } = useQuery({
    queryKey: ["featured-ebooks-home"],
    queryFn: async () => {
      // Use the secure public view that excludes pdf_url
      const { data, error } = await supabase
        .from("ebooks_public")
        .select("*")
        .eq("featured", true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Home"
        description="CyberHawk UG provides enterprise-grade cybersecurity solutions in Uganda. Network security, penetration testing, incident response, and IT equipment."
        canonical="/"
        ogImage="/og-images/og-home.png"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "CyberHawk UG",
            url: "https://cyberhawk.lovable.app",
            description: "Enterprise-grade cybersecurity solutions in Uganda",
            telephone: "+250788213106",
            email: "mcgz0783@gmail.com",
            address: {
              "@type": "PostalAddress",
              addressCountry: "UG",
            },
            sameAs: [],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CyberHawk UG",
            url: "https://cyberhawk.lovable.app",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://cyberhawk.lovable.app/blog?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(175_60%_40%_/_0.08),transparent_50%)]" />
        
        <div className="container relative mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-primary font-semibold mb-4 animate-fade-in">
                Sharp Vision in Cybersecurity
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Protecting Your{" "}
                <span className="text-gradient">Digital Future</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
                CyberHawk UG delivers world-class cybersecurity solutions with a friendly, approachable touch. We guard your digital assets 24/7 with precision and care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-brand text-primary-foreground px-8 py-4 rounded-xl font-display font-semibold shadow-brand hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Protected
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-8 py-4 rounded-xl font-display font-semibold hover:shadow-soft transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  WhatsApp Us
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>0788213106</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>24/7 Support</span>
              </div>
            </div>

            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
                <img
                  src={cyberHawkLogo}
                  alt="CyberHawk UG Logo"
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-lg animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose CyberHawk?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge security technology with a friendly, approachable service style
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Trusted Security"
            description="Enterprise-grade protection with a friendly approach. We make cybersecurity accessible for businesses of all sizes."
            delay="0.1s"
          />
          <FeatureCard
            icon={<Eye className="w-8 h-8" />}
            title="Sharp Vision"
            description="24/7 monitoring and threat detection. Our hawk-eyed team never sleeps, ensuring your assets are always protected."
            delay="0.2s"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Fast Response"
            description="Instant alerts and rapid incident response. When threats emerge, we act swiftly to minimize impact."
            delay="0.3s"
          />
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Explore All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hawk-dark py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Secure Your Business?
              </h2>
              <p className="text-white/70 mb-8">
                Get a free security assessment and discover how CyberHawk UG can protect your digital assets. Our experts are ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:0788213106"
                  className="inline-flex items-center justify-center gap-2 bg-white text-hawk-dark px-8 py-4 rounded-xl font-display font-semibold hover:bg-white/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call: 0788213106
                </a>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-display font-semibold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp: 0788213106
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img
                src={cyberHawkLogo}
                alt="CyberHawk UG"
                className="w-48 h-48 object-contain opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ebooks Section */}
      {featuredEbooks && featuredEbooks.length > 0 && (
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cybersecurity Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expand your security knowledge with our expert-written ebooks and guides
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEbooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} featured />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/ebooks"
              className="inline-flex items-center gap-2 bg-gradient-brand text-primary-foreground px-8 py-4 rounded-xl font-display font-semibold shadow-brand hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              Browse All Ebooks
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/ebooks"
              className="group flex items-center gap-4 bg-card p-6 rounded-xl border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Ebooks Store</h3>
                <p className="text-sm text-muted-foreground">Security guides & resources</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              to="/shop"
              className="group flex items-center gap-4 bg-card p-6 rounded-xl border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Security Shop</h3>
                <p className="text-sm text-muted-foreground">Tools & equipment</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              to="/services"
              className="group flex items-center gap-4 bg-card p-6 rounded-xl border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Our Services</h3>
                <p className="text-sm text-muted-foreground">Professional protection</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div
    className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-primary mb-5">
      {icon}
    </div>
    <h3 className="font-display text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-NS8GRGM8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GT-NS8GRGM8');
</script>
