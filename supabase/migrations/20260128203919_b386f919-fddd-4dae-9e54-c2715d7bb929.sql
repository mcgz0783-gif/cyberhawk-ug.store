-- Secure the ebooks table by denying direct public SELECT access
-- Users must use the ebooks_public view instead

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Anyone can view published ebooks" ON public.ebooks;

-- Create a policy that only allows admins to directly access ebooks table
-- Public users must use the ebooks_public view
CREATE POLICY "Only admins can directly access ebooks"
ON public.ebooks
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure the view has security_invoker set (already done, but let's recreate to be safe)
DROP VIEW IF EXISTS public.ebooks_public;

CREATE VIEW public.ebooks_public
WITH (security_invoker = false)
AS
SELECT 
  id,
  title,
  slug,
  description,
  short_description,
  author,
  price,
  pages,
  cover_image_url,
  featured,
  published,
  created_at,
  updated_at
FROM public.ebooks
WHERE published = true;

-- Grant SELECT on the view to public/anon users
GRANT SELECT ON public.ebooks_public TO anon, authenticated;