import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EbookCard } from "@/components/ebooks/EbookCard";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const EbooksHome = () => {
  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const featuredEbooks = ebooks?.filter((e) => e.featured) || [];
  const regularEbooks = ebooks?.filter((e) => !e.featured) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          CyberHawk Digital Library
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Learn Cybersecurity with Our{" "}
          <span className="text-gradient">Premium Ebooks</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Comprehensive guides and tutorials from industry experts. Download
          instantly and start learning today.
        </p>
      </div>

      {/* Featured Ebooks */}
      {featuredEbooks.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6">
            Featured Ebooks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEbooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Ebooks */}
      <section>
        <h2 className="text-2xl font-display font-bold mb-6">All Ebooks</h2>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : regularEbooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularEbooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        ) : ebooks?.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No ebooks available yet. Check back soon!</p>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default EbooksHome;
