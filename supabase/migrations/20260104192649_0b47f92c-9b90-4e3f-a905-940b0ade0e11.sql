-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable
CREATE POLICY "Categories are publicly readable" 
ON public.categories 
FOR SELECT 
USING (true);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

-- Insert default categories
INSERT INTO public.categories (name, slug) VALUES
  ('Networking', 'networking'),
  ('Security', 'security'),
  ('Surveillance', 'surveillance'),
  ('Access Control', 'access-control'),
  ('Servers', 'servers');

-- Insert sample products
INSERT INTO public.products (name, description, price, category_id, stock, featured) VALUES
  ('Security Router', 'Enterprise-grade security router with advanced firewall', 450000, (SELECT id FROM public.categories WHERE slug = 'networking'), 10, true),
  ('Firewall Appliance', 'Next-gen firewall with intrusion detection', 1200000, (SELECT id FROM public.categories WHERE slug = 'security'), 5, true),
  ('Network Switch 24-Port', 'Managed gigabit switch for enterprise networks', 350000, (SELECT id FROM public.categories WHERE slug = 'networking'), 15, false),
  ('VPN Gateway', 'Secure VPN gateway for remote access', 800000, (SELECT id FROM public.categories WHERE slug = 'security'), 8, true),
  ('Security Camera System', '4-channel HD security camera system', 650000, (SELECT id FROM public.categories WHERE slug = 'surveillance'), 12, true),
  ('Access Control Panel', 'Biometric access control system', 550000, (SELECT id FROM public.categories WHERE slug = 'access-control'), 7, false),
  ('IP Camera 4K', 'Ultra HD IP camera with night vision', 280000, (SELECT id FROM public.categories WHERE slug = 'surveillance'), 20, false),
  ('Rack Server', 'Enterprise rack server for data centers', 3500000, (SELECT id FROM public.categories WHERE slug = 'servers'), 3, true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();