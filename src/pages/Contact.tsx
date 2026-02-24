import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Send, Clock } from "lucide-react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import InternalLinks from "@/components/InternalLinks";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello CyberHawk! I'm interested in your cybersecurity services.");
    window.open(`https://wa.me/250788213106?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact"
        description="Contact CyberHawk UG for cybersecurity services in Uganda. Call 0788213106, WhatsApp, or email info@cyberhawk.ug for a free consultation."
        canonical="/contact"
        ogImage="/og-images/og-contact.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          mainEntity: {
            "@type": "Organization",
            name: "CyberHawk UG",
            telephone: "+250788213106",
            email: "info@cyberhawk.ug",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+250788213106",
              contactType: "customer service",
              availableLanguage: "English",
              areaServed: "UG",
            },
          },
        }}
      />
      <Header />
      <PageBreadcrumb items={[{ label: "Contact" }]} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-subtle overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(175_60%_40%_/_0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Ready to secure your business? Contact us for a free consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="tel:0788213106"
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Call Us</p>
                <p className="font-display font-bold text-foreground">0788213106</p>
              </div>
            </a>

            <button
              onClick={handleWhatsApp}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 group text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="font-display font-bold text-foreground">0788213106</p>
              </div>
            </button>

            <a
              href="mailto:info@cyberhawk.ug"
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Us</p>
                <p className="font-display font-bold text-foreground">info@cyberhawk.ug</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-soft">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+250 788 123 456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Security Consultation"
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your security needs..."
                    rows={5}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-brand text-primary-foreground px-8 py-4 rounded-xl font-display font-semibold shadow-brand hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Let's Discuss Your Security
                </h2>
                <p className="text-muted-foreground">
                  Whether you need a comprehensive security audit, incident response support, or ongoing protection, our team is ready to help. Reach out and let's start a conversation about securing your digital future.
                </p>
              </div>

              <div className="bg-gradient-card rounded-2xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">
                      Business Hours
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM<br />
                      24/7 Emergency Support Available
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-hawk-dark rounded-2xl p-6">
                <h3 className="font-display font-bold text-white mb-3">
                  Need Immediate Assistance?
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  For urgent security incidents, contact us directly via phone or WhatsApp for immediate response.
                </p>
                <button
                  onClick={handleWhatsApp}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors w-full justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InternalLinks excludePath="/contact" />
      <Footer />
    </div>
  );
};

export default Contact;
