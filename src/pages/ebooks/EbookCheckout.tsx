import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, CreditCard, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EbookCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: ebook, isLoading } = useQuery({
    queryKey: ["ebook", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks_public")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ebook) return;

    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-ebook-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ebook_id: ebook.id,
            email,
            name,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Ebook Not Found</h1>
        <Button asChild>
          <Link to="/ebooks">Back to Ebooks</Link>
        </Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
  }).format(Number(ebook.price));

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link
        to={`/ebooks/${slug}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Ebook
      </Link>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-20 h-28 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {ebook.cover_image_url ? (
                  <img
                    src={ebook.cover_image_url}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{ebook.title}</h3>
                {ebook.author && (
                  <p className="text-sm text-muted-foreground">
                    by {ebook.author}
                  </p>
                )}
                <p className="text-lg font-bold text-primary mt-2">
                  {formattedPrice}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Download link will be sent to this email
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay {formattedPrice}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secured by Stripe. Your payment information is encrypted.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookCheckout;
