/*
# Ayurved Life E-Commerce Schema

## Overview
Complete e-commerce database for Ayurved Life Ayurvedic products brand.

## New Tables

### 1. categories
- `id` (uuid, pk)
- `name` (text) - Category display name
- `slug` (text, unique) - URL-safe identifier
- `description` (text)
- `image_url` (text)
- `created_at` (timestamp)

### 2. products
- `id` (uuid, pk)
- `name` (text) - Product name in English
- `name_hindi` (text) - Product name in Hindi
- `slug` (text, unique) - URL-safe identifier
- `description` (text)
- `short_description` (text)
- `category_id` (uuid, fk → categories)
- `price` (numeric) - Original MRP
- `offer_price` (numeric) - Discounted price
- `discount_percent` (int) - Computed discount %
- `stock` (int) - Available stock
- `images` (text[]) - Array of image URLs
- `benefits` (text[]) - Array of benefit strings
- `ingredients` (text[])
- `dosage` (text)
- `is_featured` (bool)
- `is_active` (bool)
- `rating` (numeric)
- `review_count` (int)
- `created_at` (timestamp)

### 3. combos
- `id` (uuid, pk)
- `name` (text)
- `slug` (text, unique)
- `description` (text)
- `image_url` (text)
- `price` (numeric)
- `offer_price` (numeric)
- `discount_percent` (int)
- `product_ids` (uuid[]) - Products included
- `is_featured` (bool)
- `is_active` (bool)
- `created_at` (timestamp)

### 4. profiles
- `id` (uuid, pk = auth.users.id)
- `full_name` (text)
- `phone` (text)
- `email` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5. addresses
- `id` (uuid, pk)
- `user_id` (uuid, fk → auth.users)
- `full_name` (text)
- `phone` (text)
- `address_line1` (text)
- `address_line2` (text)
- `city` (text)
- `state` (text)
- `pincode` (text)
- `is_default` (bool)
- `created_at` (timestamp)

### 6. orders
- `id` (uuid, pk)
- `user_id` (uuid, fk → auth.users)
- `order_number` (text, unique)
- `status` (text) - pending/confirmed/shipped/delivered/cancelled
- `payment_method` (text) - cod/upi
- `payment_status` (text) - pending/paid/failed
- `subtotal` (numeric)
- `discount` (numeric)
- `shipping` (numeric)
- `total` (numeric)
- `shipping_address` (jsonb)
- `notes` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 7. order_items
- `id` (uuid, pk)
- `order_id` (uuid, fk → orders)
- `product_id` (uuid, fk → products, nullable)
- `combo_id` (uuid, fk → combos, nullable)
- `name` (text) - Snapshot of product name
- `image_url` (text) - Snapshot of image
- `price` (numeric)
- `quantity` (int)
- `subtotal` (numeric)

### 8. cart_items (persisted for logged-in users)
- `id` (uuid, pk)
- `user_id` (uuid, fk → auth.users)
- `product_id` (uuid, nullable)
- `combo_id` (uuid, nullable)
- `quantity` (int)
- `created_at` (timestamp)

### 9. wishlists
- `id` (uuid, pk)
- `user_id` (uuid, fk → auth.users)
- `product_id` (uuid, fk → products)
- `created_at` (timestamp)

### 10. reviews
- `id` (uuid, pk)
- `product_id` (uuid, fk → products)
- `user_id` (uuid, fk → auth.users)
- `rating` (int)
- `comment` (text)
- `created_at` (timestamp)

### 11. consultations
- `id` (uuid, pk)
- `name` (text)
- `phone` (text)
- `message` (text)
- `status` (text) - pending/contacted
- `created_at` (timestamp)

## Security
All tables have RLS enabled. Products/combos/categories are public-read. User data (orders, cart, wishlist, addresses) is owner-scoped.
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
TO anon, authenticated USING (true);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_hindi text,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  offer_price numeric(10,2),
  discount_percent int GENERATED ALWAYS AS (
    CASE WHEN offer_price IS NOT NULL AND price > 0
    THEN ROUND(((price - offer_price) / price) * 100)::int
    ELSE 0 END
  ) STORED,
  stock int NOT NULL DEFAULT 100,
  images text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  ingredients text[] DEFAULT '{}',
  dosage text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  rating numeric(3,2) DEFAULT 4.5,
  review_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
TO anon, authenticated USING (is_active = true);

-- ============================================================
-- COMBOS
-- ============================================================
CREATE TABLE IF NOT EXISTS combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  offer_price numeric(10,2),
  discount_percent int GENERATED ALWAYS AS (
    CASE WHEN offer_price IS NOT NULL AND price > 0
    THEN ROUND(((price - offer_price) / price) * 100)::int
    ELSE 0 END
  ) STORED,
  product_ids uuid[] DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE combos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_combos" ON combos;
CREATE POLICY "public_read_combos" ON combos FOR SELECT
TO anon, authenticated USING (is_active = true);

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_number text UNIQUE NOT NULL DEFAULT 'AL-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8)),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  payment_method text NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod','upi')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  shipping_address jsonb NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  combo_id uuid REFERENCES combos(id) ON DELETE SET NULL,
  name text NOT NULL,
  image_url text,
  price numeric(10,2) NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  subtotal numeric(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  combo_id uuid REFERENCES combos(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT cart_item_source CHECK (
    (product_id IS NOT NULL AND combo_id IS NULL) OR
    (product_id IS NULL AND combo_id IS NOT NULL)
  )
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cart" ON cart_items;
CREATE POLICY "select_own_cart" ON cart_items FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart" ON cart_items;
CREATE POLICY "insert_own_cart" ON cart_items FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart" ON cart_items;
CREATE POLICY "update_own_cart" ON cart_items FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart" ON cart_items;
CREATE POLICY "delete_own_cart" ON cart_items FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- WISHLISTS
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlists;
CREATE POLICY "select_own_wishlist" ON wishlists FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlists;
CREATE POLICY "insert_own_wishlist" ON wishlists FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlists;
CREATE POLICY "delete_own_wishlist" ON wishlists FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- REVIEWS (public read, auth write)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_review" ON reviews;
CREATE POLICY "insert_own_review" ON reviews FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_review" ON reviews;
CREATE POLICY "update_own_review" ON reviews FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_review" ON reviews;
CREATE POLICY "delete_own_review" ON reviews FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CONSULTATIONS (public insert)
-- ============================================================
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','contacted')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_consultations" ON consultations;
CREATE POLICY "public_insert_consultations" ON consultations FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlists(user_id);

-- ============================================================
-- SEED: Categories
-- ============================================================
INSERT INTO categories (name, slug, description) VALUES
  ('Kidney Care', 'kidney-care', 'Ayurvedic products for kidney health and stone removal'),
  ('Ear Care', 'ear-care', 'Natural herbal solutions for ear health'),
  ('Digestive Health', 'digestive-health', 'Products for gut and digestive wellness'),
  ('Blood Sugar', 'blood-sugar', 'Herbal support for healthy blood sugar levels'),
  ('Blood Pressure', 'blood-pressure', 'Natural solutions for healthy blood pressure'),
  ('Liver Care', 'liver-care', 'Herbal liver detox and care products'),
  ('Joint & Bone', 'joint-bone', 'Natural joint pain relief and bone health'),
  ('Combos', 'combos', 'Special combo packs at discounted prices')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Products
-- ============================================================
INSERT INTO products (name, name_hindi, slug, short_description, description, price, offer_price, images, benefits, dosage, is_featured, category_id)
SELECT
  p.name, p.name_hindi, p.slug, p.short_description, p.description, p.price, p.offer_price,
  p.images, p.benefits, p.dosage, p.is_featured,
  c.id
FROM (VALUES
  (
    'Pathri Mukti Capsules', 'पथरी मुक्ति कैप्सूल', 'pathri-mukti-capsules',
    '100% Ayurvedic formula to dissolve and remove kidney stones naturally',
    'Pathri Mukti Capsules by Ayurved Life is a powerful Ayurvedic formulation designed to dissolve and flush out kidney stones naturally. Made with a blend of traditional herbs known for their lithotriptic properties, these capsules help relieve the pain and discomfort associated with kidney stones while supporting overall kidney health.',
    1999, 1499,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/3v9ne24i_ayurvedlife_clear_1.png'],
    ARRAY['Dissolves kidney stones naturally', 'Relieves pain and burning sensation', 'Supports kidney health', 'Prevents stone recurrence', 'Improves urine flow'],
    '2 capsules twice daily with warm water after meals', true, 'kidney-care'
  ),
  (
    'Pathri Mukti Powder', 'पथरी मुक्ति पाउडर', 'pathri-mukti-powder',
    'Herbal powder blend for kidney stone dissolution and urinary health',
    'Pathri Mukti Powder is a traditional Ayurvedic herbal powder formulation that helps dissolve kidney stones and supports urinary tract health. This carefully crafted blend of herbs works synergistically to break down stones and ease their passage.',
    1799, 1299,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/3v9ne24i_ayurvedlife_clear_1.png'],
    ARRAY['Dissolves kidney stones', 'Soothes urinary tract', 'Natural diuretic properties', 'Reduces inflammation', 'Easy to consume'],
    '1 teaspoon with warm water twice daily before meals', true, 'kidney-care'
  ),
  (
    'Ear Veda Capsules', 'इयर वेदा कैप्सूल', 'ear-veda-capsules',
    'Ayurvedic capsules for comprehensive ear health and hearing support',
    'Ear Veda Capsules combine ancient Ayurvedic wisdom with modern herbal science to provide comprehensive ear health support. These capsules help address common ear problems including tinnitus, ear infections, and age-related hearing issues.',
    1699, 1199,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/nyueks53_ChatGPT%20Image%20Jan%207%2C%202026%2C%2001_18_45%20AM.png'],
    ARRAY['Supports ear health', 'Helps reduce tinnitus', 'Protects against infections', 'Improves hearing clarity', 'Anti-inflammatory properties'],
    '1 capsule twice daily with warm water after meals', false, 'ear-care'
  ),
  (
    'Ear Veda Powder', 'इयर वेदा पाउडर', 'ear-veda-powder',
    'Traditional herbal powder for ear care and related ailments',
    'Ear Veda Powder is a traditional Ayurvedic formulation made from carefully selected herbs known for their therapeutic benefits for ear health. This powder blend supports hearing health and helps address various ear-related conditions.',
    1599, 1099,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/nyueks53_ChatGPT%20Image%20Jan%207%2C%202026%2C%2001_18_45%20AM.png'],
    ARRAY['Promotes ear health', 'Reduces ear discomfort', 'Natural anti-bacterial', 'Improves circulation to ears', 'Traditional formula'],
    '1/2 teaspoon with warm water twice daily', false, 'ear-care'
  ),
  (
    'Pet Safa', 'पेट साफा', 'pet-safa',
    'Complete digestive care formula for clean stomach and gut health',
    'Pet Safa is Ayurved Life''s comprehensive digestive health formula. This powerful blend of Ayurvedic herbs promotes healthy digestion, relieves constipation, reduces bloating, and maintains a clean and healthy gut. Regular use helps improve metabolism and overall digestive function.',
    999, 699,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/1xrg1ps8_file_00000000946c71faa9d0a3afcece522b.png'],
    ARRAY['Relieves constipation naturally', 'Reduces bloating and gas', 'Cleanses the colon', 'Improves digestion', 'Boosts metabolism', 'Safe for daily use'],
    '2 tablets at bedtime with warm water', true, 'digestive-health'
  ),
  (
    'Sugar Control Capsules', 'शुगर कंट्रोल कैप्सूल', 'sugar-control-capsules',
    'Natural herbal support for healthy blood sugar levels',
    'Sugar Control Capsules by Ayurved Life are formulated with powerful Ayurvedic herbs known for their ability to support healthy blood sugar levels. This scientifically prepared formula helps manage diabetes naturally while improving overall metabolic health.',
    1999, 1499,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/506irgiv_ChatGPT%20Image%20Jan%207%2C%202026%2C%2001_11_12%20AM.png'],
    ARRAY['Supports healthy blood sugar', 'Improves insulin sensitivity', 'Reduces sugar cravings', 'Boosts energy levels', 'Supports pancreatic health', 'Natural formula'],
    '2 capsules twice daily with water 30 minutes before meals', true, 'blood-sugar'
  ),
  (
    'BP Control Capsules', 'बीपी कंट्रोल कैप्सूल', 'bp-control-capsules',
    'Ayurvedic formula for maintaining healthy blood pressure',
    'BP Control Capsules are crafted from time-tested Ayurvedic herbs that help maintain healthy blood pressure levels. This holistic formula supports cardiovascular health while reducing stress and anxiety that contribute to hypertension.',
    1999, 1499,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/nyueks53_ChatGPT%20Image%20Jan%207%2C%202026%2C%2001_18_45%20AM.png'],
    ARRAY['Supports healthy BP levels', 'Reduces stress & anxiety', 'Improves heart health', 'Natural diuretic effect', 'Calms nervous system'],
    '1 capsule twice daily with warm water after meals', true, 'blood-pressure'
  ),
  (
    'Liver Care Capsules', 'लिवर केयर कैप्सूल', 'liver-care-capsules',
    'Premium Ayurvedic liver detox and care formula',
    'Liver Care Capsules provide complete liver support using potent Ayurvedic herbs. This formula helps detoxify the liver, protect against liver damage, improve liver enzyme levels, and support healthy bile production for optimal digestive function.',
    1999, 1499,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/uj5axocq_IMG-20260106-WA0009.jpg'],
    ARRAY['Supports liver detoxification', 'Protects liver cells', 'Improves digestion', 'Reduces fatty liver', 'Boosts liver function'],
    '2 capsules twice daily with water after meals', false, 'liver-care'
  ),
  (
    'Joint Pain Relief Oil', 'जोड़ों का दर्द तेल', 'joint-pain-relief-oil',
    '100% herbal oil for fast joint pain relief and inflammation',
    'Joint Pain Relief Oil is a powerful Ayurvedic formulation that provides fast and effective relief from joint pain, muscle aches, and arthritis. This penetrating herbal oil blend soothes inflammation, improves circulation, and restores mobility.',
    1299, 899,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/h2rgypwd_ChatGPT%20Image%20Jan%204%2C%202026%2C%2009_40_03%20PM.png'],
    ARRAY['Fast pain relief', 'Reduces inflammation', 'Improves joint mobility', 'Soothes muscle stiffness', 'Improves blood circulation'],
    'Apply liberally to affected area and massage gently twice daily', true, 'joint-bone'
  ),
  (
    'Triphala Tablets', 'त्रिफला टेबलेट', 'triphala-tablets',
    'Classic Ayurvedic Triphala for complete digestive and immune health',
    'Triphala Tablets contain the classic three-fruit Ayurvedic formula - Amla, Bibhitaki, and Haritaki. This time-honored combination supports digestive health, boosts immunity, acts as a gentle laxative, and provides antioxidant protection.',
    799, 549,
    ARRAY['https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/6kxpk6b5_file_00000000587471fa96b16c35260a2224.png'],
    ARRAY['Improves digestion', 'Gentle natural laxative', 'Boosts immunity', 'Rich in antioxidants', 'Supports eye health', 'Balances all doshas'],
    '2 tablets at bedtime with warm water or honey', false, 'digestive-health'
  )
) AS p(name, name_hindi, slug, short_description, description, price, offer_price, images, benefits, dosage, is_featured, cat_slug)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Combos
-- ============================================================
INSERT INTO combos (name, slug, description, image_url, price, offer_price, is_featured)
SELECT * FROM (VALUES
  (
    'Sugar Control Combo', 'sugar-control-combo',
    'Complete diabetes management combo with Sugar Control Capsules + Karela Juice + Dietary Guide. Save ₹1000!',
    'https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/506irgiv_ChatGPT%20Image%20Jan%207%2C%202026%2C%2001_11_12%20AM.png',
    3998, 2499, true
  ),
  (
    'BP Control Combo', 'bp-control-combo',
    'Comprehensive blood pressure management: BP Control Capsules + Stress Relief Oil + Heart Care Tea. Save ₹1200!',
    'https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/nyueks53_ChatGPT%20Image%20Jan%207%2C%202026%2C%2001_18_45%20AM.png',
    4199, 2799, true
  ),
  (
    'Liver Care Combo', 'liver-care-combo',
    'Complete liver detox package: Liver Care Capsules + Liver Detox Tea + Healthy Liver Guide. Save ₹1000!',
    'https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/uj5axocq_IMG-20260106-WA0009.jpg',
    3998, 2699, true
  ),
  (
    'Joint Pain Combo', 'joint-pain-combo',
    'Complete joint care kit: Joint Pain Relief Oil + Joint Support Capsules + Pain Relief Gel. Save ₹1400!',
    'https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/h2rgypwd_ChatGPT%20Image%20Jan%204%2C%202026%2C%2009_40_03%20PM.png',
    3297, 1999, true
  ),
  (
    'Triphala + Isabgol Combo', 'triphala-isabgol-combo',
    'Powerful digestive duo: Triphala Tablets + Isabgol Husk for complete gut cleansing and digestive health. Save ₹600!',
    'https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/1xrg1ps8_file_00000000946c71faa9d0a3afcece522b.png',
    1598, 999, false
  ),
  (
    'Kidney Stone Complete Kit', 'kidney-stone-kit',
    'Best value kidney care: Pathri Mukti Capsules + Pathri Mukti Powder + Kidney Support Tea. Save ₹1200!',
    'https://customer-assets.emergentagent.com/job_ayurveda-care-9/artifacts/3v9ne24i_ayurvedlife_clear_1.png',
    3798, 2499, true
  )
) AS c(name, slug, description, image_url, price, offer_price, is_featured)
ON CONFLICT (slug) DO NOTHING;
