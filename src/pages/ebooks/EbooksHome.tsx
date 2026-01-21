import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EbookCard } from "@/components/ebooks/EbookCard";
import { BookOpen, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const EbooksHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

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

  // Calculate max price for slider
  const maxPrice = useMemo(() => {
    if (!ebooks || ebooks.length === 0) return 10000;
    return Math.max(...ebooks.map((e) => e.price)) + 1000;
  }, [ebooks]);

  // Filter ebooks based on search and price range
  const filteredEbooks = useMemo(() => {
    if (!ebooks) return [];

    return ebooks.filter((ebook) => {
      const matchesSearch =
        searchQuery === "" ||
        ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ebook.author &&
          ebook.author.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPrice =
        ebook.price >= priceRange[0] && ebook.price <= priceRange[1];

      return matchesSearch && matchesPrice;
    });
  }, [ebooks, searchQuery, priceRange]);

  const featuredEbooks = filteredEbooks.filter((e) => e.featured);
  const regularEbooks = filteredEbooks.filter((e) => !e.featured);

  const hasActiveFilters = searchQuery !== "" || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
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

      {/* Search and Filter Section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search by title or author
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search ebooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              min={0}
              max={maxPrice}
              step={100}
              className="mt-3"
            />
          </div>
        </div>

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEbooks.length} of {ebooks?.length || 0} ebooks
            </p>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          </div>
        )}
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
        ) : filteredEbooks.length === 0 && hasActiveFilters ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No ebooks match your search criteria.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
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
