
-- Fix 1: Block direct purchase inserts (only service role via edge functions should insert)
DROP POLICY IF EXISTS "Service can insert purchase records" ON public.ebook_purchases;

CREATE POLICY "Block direct purchase inserts"
ON public.ebook_purchases
FOR INSERT
WITH CHECK (false);

-- Fix 2: Restrict product-images storage to admins only
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Only admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Fix 3: Add database constraints for product validation
ALTER TABLE public.products
ADD CONSTRAINT products_price_positive CHECK (price > 0),
ADD CONSTRAINT products_stock_non_negative CHECK (stock >= 0),
ADD CONSTRAINT products_name_length CHECK (char_length(name) BETWEEN 1 AND 500);
