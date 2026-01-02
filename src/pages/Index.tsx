import cyberHawkLogo from "@/assets/cyberhawk-logo.png";
import { Download, Shield, Eye, Zap } from "lucide-react";

const Index = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cyberHawkLogo;
    link.download = 'cyberhawk-logo.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(175_60%_40%_/_0.08),transparent_50%)]" />
        
        <div className="container relative mx-auto px-6 py-16 lg:py-24">
          <div className="flex flex-col items-center text-center">
            {/* Logo Display */}
            <div className="mb-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
                <img
                  src={cyberHawkLogo}
                  alt="CyberHawk UG Logo"
                  className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-lg animate-float"
                />
              </div>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground font-medium tracking-wide mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Sharp Vision in Cybersecurity
            </p>

            {/* Description */}
            <p className="max-w-2xl text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Protecting your digital assets with precision and care. Our friendly hawk watches over your cybersecurity needs 24/7.
            </p>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="group inline-flex items-center gap-2 bg-gradient-brand text-primary-foreground px-8 py-4 rounded-xl font-display font-semibold shadow-brand hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <Download className="w-5 h-5 group-hover:animate-pulse" />
              Download Logo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Trusted Security"
            description="Enterprise-grade protection with a friendly approach"
            delay="0.1s"
          />
          <FeatureCard
            icon={<Eye className="w-8 h-8" />}
            title="Sharp Vision"
            description="24/7 monitoring and threat detection"
            delay="0.2s"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Fast Response"
            description="Instant alerts and rapid incident response"
            delay="0.3s"
          />
        </div>
      </section>

      {/* Logo Variations */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
          Logo Variations
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Light Background */}
          <div className="bg-card rounded-2xl p-8 shadow-soft flex flex-col items-center">
            <img
              src={cyberHawkLogo}
              alt="Logo on light background"
              className="w-32 h-32 object-contain mb-4"
            />
            <span className="text-sm text-muted-foreground">Light Background</span>
          </div>
          
          {/* Dark Background */}
          <div className="bg-hawk-dark rounded-2xl p-8 flex flex-col items-center">
            <img
              src={cyberHawkLogo}
              alt="Logo on dark background"
              className="w-32 h-32 object-contain mb-4"
            />
            <span className="text-sm text-white/70">Dark Background</span>
          </div>
          
          {/* Brand Color Background */}
          <div className="bg-gradient-brand rounded-2xl p-8 flex flex-col items-center">
            <img
              src={cyberHawkLogo}
              alt="Logo on brand background"
              className="w-32 h-32 object-contain mb-4"
            />
            <span className="text-sm text-white/90">Brand Background</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={cyberHawkLogo}
                alt="CyberHawk UG"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-display font-bold text-foreground">CyberHawk</span>
                <span className="text-muted-foreground ml-1">UG</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 CyberHawk UG. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
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
    <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
