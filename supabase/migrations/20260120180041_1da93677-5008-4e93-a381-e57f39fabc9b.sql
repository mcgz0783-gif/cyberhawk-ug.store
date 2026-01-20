-- Create ebooks table
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  pdf_url TEXT NOT NULL,
  pages INTEGER,
  author TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ebook purchases table to track bought ebooks
CREATE TABLE public.ebook_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  access_token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_purchases ENABLE ROW LEVEL SECURITY;

-- Ebooks: Anyone can view published ebooks
CREATE POLICY "Anyone can view published ebooks"
ON public.ebooks
FOR SELECT
USING (published = true);

-- Ebooks: Admins can manage all ebooks
CREATE POLICY "Admins can manage ebooks"
ON public.ebooks
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Purchases: Anyone can insert a purchase (for payment callback)
CREATE POLICY "Anyone can insert purchase"
ON public.ebook_purchases
FOR INSERT
WITH CHECK (true);

-- Purchases: Users can view their own purchases by access token
CREATE POLICY "View purchase by access token"
ON public.ebook_purchases
FOR SELECT
USING (true);

-- Purchases: Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
ON public.ebook_purchases
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_ebooks_updated_at
BEFORE UPDATE ON public.ebooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for ebooks
INSERT INTO storage.buckets (id, name, public) VALUES ('ebook-covers', 'ebook-covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('ebook-files', 'ebook-files', false);

-- Storage policies for covers (public read)
CREATE POLICY "Anyone can view ebook covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebook-covers');

CREATE POLICY "Admins can upload ebook covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ebook-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ebook covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ebook-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ebook covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'ebook-covers' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for PDF files (private, admin upload only)
CREATE POLICY "Admins can upload ebook files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ebook-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage ebook files"
ON storage.objects FOR ALL
USING (bucket_id = 'ebook-files' AND public.has_role(auth.uid(), 'admin'));