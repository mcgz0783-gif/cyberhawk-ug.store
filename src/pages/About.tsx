import { Shield, Users, Award, Clock, Target, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import cyberHawkLogo from "@/assets/cyberhawk-logo.png";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import InternalLinks from "@/components/InternalLinks";

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trust & Integrity",
    description: "We operate with complete transparency and maintain the highest ethical standards in all our engagements.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Excellence",
    description: "We continuously evolve our skills and methodologies to stay ahead of emerging threats.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Client-First Approach",
    description: "Your security is our priority. We tailor solutions to meet your unique business needs.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaboration",
    description: "We work as an extension of your team, fostering open communication and partnership.",
  },
];

const stats = [
  { value: "500+", label: "Clients Protected" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Support Available" },
  { value: "10+", label: "Years Experience" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us"
        description="Learn about CyberHawk UG – a team of cybersecurity experts protecting businesses in East Africa with certified, 24/7 security solutions."
        canonical="/about"
        ogImage="/og-images/og-about.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntity: {
            "@type": "Organization",
            name: "CyberHawk UG",
            description: "A team of passionate cybersecurity experts dedicated to protecting businesses in East Africa and beyond.",
            foundingLocation: { "@type": "Place", name: "Uganda" },
            knowsAbout: ["Cybersecurity", "Network Security", "Penetration Testing", "Incident Response"],
            numberOfEmployees: { "@type": "QuantitativeValue", value: "10+" },
          },
        }}
      />
      <Header />
      <PageBreadcrumb items={[{ label: "About Us" }]} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-subtle overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(175_60%_40%_/_0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                About <span className="text-gradient">CyberHawk UG</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                We're a team of passionate cybersecurity experts dedicated to protecting businesses in East Africa and beyond.
              </p>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Founded with a mission to make world-class cybersecurity accessible to all businesses, CyberHawk UG combines cutting-edge technology with a friendly, approachable service style.
              </p>
            </div>
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
                <img
                  src={cyberHawkLogo}
                  alt="CyberHawk UG"
                  className="relative w-64 h-64 md:w-80 md:h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-hawk-dark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              To provide world-class cybersecurity solutions that empower businesses to operate securely in the digital age. We believe that every organization, regardless of size, deserves access to expert security services that protect their assets, reputation, and customers.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine technical expertise with a customer-focused approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Certified Experts
              </h3>
              <p className="text-muted-foreground">
                Our team holds industry-leading certifications including CISSP, CEH, and OSCP.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Rapid Response
              </h3>
              <p className="text-muted-foreground">
                24/7 support with guaranteed response times for critical security incidents.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Local Expertise
              </h3>
              <p className="text-muted-foreground">
                Deep understanding of the East African business landscape and regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <InternalLinks excludePath="/about" />
      <Footer />
    </div>
  );
};

export default About;
