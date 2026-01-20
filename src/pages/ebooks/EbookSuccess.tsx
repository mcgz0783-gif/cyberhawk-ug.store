import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Download,
  BookOpen,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";

const EbookSuccess = () => {
  const { accessToken } = useParams<{ accessToken: string }>();
  const [searchParams] = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  // Verify payment and get purchase
  const { data: purchase, isLoading, error } = useQuery({
    queryKey: ["purchase", accessToken, txRef],
    queryFn: async () => {
      // First verify with edge function if we have transaction details
      if (txRef && transactionId && status === "successful") {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/flutterwave-verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction_id: transactionId, tx_ref: txRef }),
          }
        );
      }

      // Get purchase by access token
      const { data, error } = await supabase
        .from("ebook_purchases")
        .select("*, ebook:ebooks(*)")
        .eq("access_token", accessToken)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!accessToken,
  });

  const loadPdfUrl = async () => {
    if (!purchase?.ebook?.pdf_url) return;

    setIsLoadingPdf(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ebook-download`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        }
      );

      const data = await response.json();
      if (data.url) {
        setPdfUrl(data.url);
      }
    } catch (error) {
      console.error("Failed to load PDF:", error);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  useEffect(() => {
    if (purchase?.payment_status === "completed") {
      loadPdfUrl();
    }
  }, [purchase]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h1 className="text-2xl font-bold mb-2">Purchase Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find your purchase. Please check your email for the download link.
        </p>
        <Button asChild>
          <Link to="/ebooks">Browse Ebooks</Link>
        </Button>
      </div>
    );
  }

  const isPending = purchase.payment_status === "pending";
  const ebook = purchase.ebook;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          {isPending ? (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
              <CardTitle className="text-2xl">Verifying Payment...</CardTitle>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your ebook is ready.
              </p>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ebook Info */}
          {ebook && (
            <div className="flex gap-4 p-4 rounded-lg bg-muted">
              <div className="w-16 h-22 rounded-md overflow-hidden bg-background flex-shrink-0">
                {ebook.cover_image_url ? (
                  <img
                    src={ebook.cover_image_url}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{ebook.title}</h3>
                {ebook.author && (
                  <p className="text-sm text-muted-foreground">
                    by {ebook.author}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Download Options */}
          {!isPending && (
            <div className="space-y-3">
              {isLoadingPdf ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : pdfUrl ? (
                <>
                  <Button asChild size="lg" className="w-full gap-2">
                    <a href={pdfUrl} download>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    asChild
                  >
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-5 h-5" />
                      View in Browser
                    </a>
                  </Button>
                </>
              ) : (
                <p className="text-center text-muted-foreground">
                  Download link is being prepared...
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            A download link has also been sent to {purchase.email}
          </p>

          <div className="text-center pt-4">
            <Button variant="ghost" asChild>
              <Link to="/ebooks">Browse More Ebooks</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookSuccess;
