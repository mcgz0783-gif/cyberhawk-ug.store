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
    const { ebook_id, email, name, amount, redirect_url } = await req.json();

    if (!ebook_id || !email || !amount) {
      throw new Error("Missing required fields: ebook_id, email, amount");
    }

    const FLUTTERWAVE_SECRET_KEY = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!FLUTTERWAVE_SECRET_KEY) {
      throw new Error("Flutterwave secret key not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique transaction reference
    const tx_ref = `ebook-${ebook_id}-${Date.now()}`;

    // Create pending purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("ebook_purchases")
      .insert({
        ebook_id,
        email,
        transaction_id: tx_ref,
        amount,
        payment_status: "pending",
      })
      .select()
      .single();

    if (purchaseError) {
      console.error("Purchase insert error:", purchaseError);
      throw new Error("Failed to create purchase record");
    }

    // Initialize Flutterwave payment
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: "NGN",
        redirect_url: `${redirect_url}/${purchase.access_token}`,
        customer: {
          email,
          name: name || email.split("@")[0],
        },
        customizations: {
          title: "CyberHawk Ebook Purchase",
          description: "Digital ebook purchase",
          logo: "https://cyberhawk.lovable.app/favicon.ico",
        },
      }),
    });

    const result = await response.json();

    if (result.status !== "success") {
      console.error("Flutterwave error:", result);
      throw new Error(result.message || "Failed to initialize payment");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
