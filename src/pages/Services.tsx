import { Shield, Search, FileCheck, AlertTriangle, Lock, Server, Smartphone, Cloud, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import InternalLinks from "@/components/InternalLinks";

const services = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Network Security",
    description: "Comprehensive network protection including firewalls, intrusion detection, and secure architecture design.",
    features: ["Firewall Configuration", "Network Monitoring", "VPN Setup", "Traffic Analysis"],
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Penetration Testing",
    description: "Ethical hacking services to identify vulnerabilities before malicious actors can exploit them.",
    features: ["Web App Testing", "Network Penetration", "Social Engineering", "API Security"],
  },
  {
    icon: <FileCheck className="w-8 h-8" />,
    title: "Security Audits",
    description: "Thorough assessment of your IT infrastructure to ensure compliance and identify security gaps.",
    features: ["Compliance Audits", "Risk Assessment", "Policy Review", "Gap Analysis"],
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Incident Response",
    description: "Rapid response team available 24/7 to handle security breaches and minimize damage.",
    features: ["24/7 Support", "Forensic Analysis", "Damage Control", "Recovery Planning"],
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Data Protection",
    description: "Encryption and data security solutions to protect your sensitive information.",
    features: ["Data Encryption", "Backup Solutions", "Access Control", "DLP Implementation"],
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Security",
    description: "Secure your cloud infrastructure across AWS, Azure, Google Cloud, and other platforms.",
    features: ["Cloud Audits", "Configuration Review", "Identity Management", "Compliance"],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Services"
        description="CyberHawk UG cybersecurity services: network security, penetration testing, security audits, incident response, data protection, and cloud security."
        canonical="/services"
        ogImage="/og-images/og-services.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Cybersecurity Services",
          provider: {
            "@type": "Organization",
            name: "CyberHawk UG",
            url: "https://cyberhawk.lovable.app",
          },
          areaServed: { "@type": "Country", name: "Uganda" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Cybersecurity Services",
            itemListElement: services.map((s, i) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.title, description: s.description },
              position: i + 1,
            })),
          },
        }}
      />
      <Header />
      <PageBreadcrumb items={[{ label: "Services" }]} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-subtle overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(175_60%_40%_/_0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Comprehensive cybersecurity solutions tailored to protect your business from evolving digital threats.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-hawk-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Business?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us today for a free security consultation. Our experts will assess your needs and recommend the best solutions.
          </p>
          <Link
            to="/contact"
            className="inline-flex bg-gradient-brand text-primary-foreground px-8 py-4 rounded-xl font-display font-semibold shadow-brand hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
          >
            Get a Free Consultation
          </Link>
        </div>
      </section>

      <InternalLinks excludePath="/services" />
      <Footer />
    </div>
  );
};

export default Services;
