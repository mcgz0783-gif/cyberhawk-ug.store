import { Link } from "react-router-dom";
import { Shield, ShoppingBag, Lock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ShopHome() {
  const features = [
    {
      icon: Shield,
      title: "Authentic Products",
      description: "All IT appliances are genuine and certified",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "MTN MoMo & Airtel Money supported",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Nationwide delivery within Uganda",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Cyberhawk IT Appliances
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Premium security hardware and IT equipment for businesses in Uganda
          </p>
          <Link to="/shop/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
