import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { access_token } = await req.json();

    if (!access_token) {
      throw new Error("Access token is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get purchase with ebook
    const { data: purchase, error: purchaseError } = await supabase
      .from("ebook_purchases")
      .select("*, ebook:ebooks(*)")
      .eq("access_token", access_token)
      .eq("payment_status", "completed")
      .single();

    if (purchaseError || !purchase) {
      throw new Error("Invalid access token or payment not completed");
    }

    const pdfPath = purchase.ebook.pdf_url;

    if (!pdfPath) {
      throw new Error("PDF file not found");
    }

    // Generate signed URL for the PDF (valid for 1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("ebook-files")
      .createSignedUrl(pdfPath, 3600);

    if (signedError || !signedData) {
      console.error("Signed URL error:", signedError);
      throw new Error("Failed to generate download link");
    }

    return new Response(
      JSON.stringify({
        status: "success",
        url: signedData.signedUrl,
        title: purchase.ebook.title,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return new Response(
      JSON.stringify({ status: "error", message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
