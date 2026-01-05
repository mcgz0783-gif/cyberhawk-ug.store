-- Allow anyone to insert products (for now, until auth is added)
CREATE POLICY "Anyone can insert products"
ON public.products FOR INSERT
WITH CHECK (true);

-- Allow anyone to update products
CREATE POLICY "Anyone can update products"
ON public.products FOR UPDATE
USING (true);

-- Allow anyone to delete products
CREATE POLICY "Anyone can delete products"
ON public.products FOR DELETE
USING (true);