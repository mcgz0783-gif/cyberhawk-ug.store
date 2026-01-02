import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mukamusoni",
    role: "CEO, TechStart Rwanda",
    content: "CyberHawk UG transformed our security infrastructure. Their team is incredibly professional and their 24/7 monitoring gives us peace of mind.",
    rating: 5,
  },
  {
    name: "Jean-Pierre Habimana",
    role: "IT Director, Kigali Finance Ltd",
    content: "After a security incident, CyberHawk's rapid response team saved our business. They've been our trusted partner ever since.",
    rating: 5,
  },
  {
    name: "Grace Uwimana",
    role: "Founder, E-Commerce Plus",
    content: "The penetration testing revealed vulnerabilities we never knew existed. CyberHawk's expertise is truly world-class.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by businesses across East Africa to protect their digital assets
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-border pt-4">
                <p className="font-display font-bold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
