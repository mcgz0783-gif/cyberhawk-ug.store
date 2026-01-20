import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  FileText,
  User,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

const EbookDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: ebook, isLoading } = useQuery({
    queryKey: ["ebook", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] w-full max-w-md rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Ebook Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The ebook you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/ebooks">Back to Ebooks</Link>
        </Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(ebook.price));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        to="/ebooks"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Ebooks
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Cover Image */}
        <div className="relative">
          <div className="aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-elevated bg-muted">
            {ebook.cover_image_url ? (
              <img
                src={ebook.cover_image_url}
                alt={ebook.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-muted-foreground" />
              </div>
            )}
          </div>
          {ebook.featured && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {ebook.title}
            </h1>
            {ebook.author && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>by {ebook.author}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">
              {formattedPrice}
            </span>
            {ebook.pages && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="w-3 h-3" />
                {ebook.pages} pages
              </Badge>
            )}
          </div>

          {ebook.short_description && (
            <p className="text-lg text-muted-foreground">
              {ebook.short_description}
            </p>
          )}

          {ebook.description && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">About this Ebook</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {ebook.description}
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button size="lg" className="gap-2" asChild>
              <Link to={`/ebooks/${slug}/checkout`}>
                <ShoppingCart className="w-5 h-5" />
                Buy Now - {formattedPrice}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookDetail;
