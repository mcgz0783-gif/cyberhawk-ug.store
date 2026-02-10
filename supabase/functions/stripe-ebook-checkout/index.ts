import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
    const { ebook_id, email, name } = await req.json();

    if (!ebook_id || !email) {
      throw new Error("Missing required fields: ebook_id, email");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch ebook details from the database (server-side, bypasses RLS)
    const { data: ebook, error: ebookError } = await supabase
      .from("ebooks")
      .select("id, title, price, cover_image_url, slug")
      .eq("id", ebook_id)
      .single();

    if (ebookError || !ebook) {
      throw new Error("Ebook not found");
    }

    if (Number(ebook.price) <= 0) {
      throw new Error("Invalid ebook price");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const appUrl = Deno.env.get("PUBLIC_APP_URL") || "https://cyberhawk.lovable.app";

    // Create pending purchase record
    const tx_ref = `ebook-${ebook_id}-${Date.now()}`;
    const { data: purchase, error: purchaseError } = await supabase
      .from("ebook_purchases")
      .insert({
        ebook_id,
        email,
        transaction_id: tx_ref,
        amount: Number(ebook.price),
        payment_status: "pending",
        currency: "UGX",
      })
      .select()
      .single();

    if (purchaseError) {
      console.error("Purchase insert error:", purchaseError);
      throw new Error("Failed to create purchase record");
    }

    // Create Stripe Checkout session with dynamic price
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "ugx",
            product_data: {
              name: ebook.title,
              images: ebook.cover_image_url ? [ebook.cover_image_url] : [],
            },
            unit_amount: Math.round(Number(ebook.price) * 100), // Convert to kobo
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${appUrl}/ebooks/success/${purchase.access_token}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/ebooks/${ebook.slug}`,
      metadata: {
        ebook_id,
        purchase_id: purchase.id,
        access_token: purchase.access_token,
      },
    });

    // Update purchase with Stripe session ID
    await supabase
      .from("ebook_purchases")
      .update({ transaction_id: session.id })
      .eq("id", purchase.id);

    return new Response(JSON.stringify({ url: session.url }), {
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
