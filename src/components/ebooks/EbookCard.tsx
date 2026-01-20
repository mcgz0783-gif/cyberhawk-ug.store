import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText } from "lucide-react";

interface Ebook {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  price: number;
  cover_image_url?: string | null;
  pages?: number | null;
  author?: string | null;
  featured?: boolean | null;
}

interface EbookCardProps {
  ebook: Ebook;
  featured?: boolean;
}

export const EbookCard = ({ ebook, featured }: EbookCardProps) => {
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(ebook.price));

  return (
    <Link to={`/ebooks/${ebook.slug}`}>
      <Card
        className={`group overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${
          featured ? "border-primary/20" : ""
        }`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {ebook.cover_image_url ? (
            <img
              src={ebook.cover_image_url}
              alt={ebook.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          {ebook.featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-display font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {ebook.title}
          </h3>
          {ebook.author && (
            <p className="text-sm text-muted-foreground mb-2">
              by {ebook.author}
            </p>
          )}
          {ebook.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {ebook.short_description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">{formattedPrice}</span>
            {ebook.pages && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {ebook.pages} pages
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
