/*
# Update Ayurved Life categories and products to match full spec

1. Categories
   - Add: Brain Care, Hair Care, Weight Management, Heart Care, Blood Pressure Care, Blood Sugar Care, Joint Care, Digestive Care
   - Rename: Blood Pressure -> Blood Pressure Care, Blood Sugar -> Blood Sugar Care, Digestive Health -> Digestive Care, Joint & Bone -> Joint Care

2. Products
   - Add: Pathri Mukti Liquid, Brain Booster, Hair Growth, Weight Loss, Heart Care
   - Rename/update existing to match spec

3. Combos
   - Rename Kidney Stone Complete Kit -> Pathri Mukti Complete Combo
   - Add: Ear Veda Complete Combo

4. Notes
   - All idempotent, no data loss
*/

-- Add missing categories
INSERT INTO categories (name, slug, description) VALUES
  ('Brain Care', 'brain-care', 'Ayurvedic herbs for memory, focus and cognitive health'),
  ('Hair Care', 'hair-care', 'Natural solutions for hair growth and scalp health'),
  ('Weight Management', 'weight-management', 'Herbal supplements for healthy weight management'),
  ('Heart Care', 'heart-care', 'Ayurvedic care for heart health and circulation')
ON CONFLICT (slug) DO NOTHING;

-- Rename existing categories to match spec
UPDATE categories SET name = 'Digestive Care', slug = 'digestive-care' WHERE slug = 'digestive-health';
UPDATE categories SET name = 'Blood Pressure Care', slug = 'blood-pressure-care' WHERE slug = 'blood-pressure';
UPDATE categories SET name = 'Blood Sugar Care', slug = 'blood-sugar-care' WHERE slug = 'blood-sugar';
UPDATE categories SET name = 'Joint Care', slug = 'joint-care' WHERE slug = 'joint-bone';

-- Add Pathri Mukti Liquid
INSERT INTO products (name, slug, name_hindi, short_description, description, price, offer_price, images, benefits, ingredients, dosage, category_id, is_featured, is_active, rating, review_count, stock)
SELECT
  'Pathri Mukti Liquid',
  'pathri-mukti-liquid',
  'पथरी मुक्ति लिक्विड',
  'Powerful liquid formulation for kidney stone dissolution and urinary tract health',
  'Pathri Mukti Liquid is a potent Ayurvedic liquid formulation designed to help dissolve kidney stones, reduce urinary tract infections, and support overall kidney function. Made with carefully selected herbs including Gokhru and Pashanbhed.',
  1499,
  999,
  ARRAY['https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png'],
  ARRAY['Helps dissolve kidney stones naturally', 'Supports urinary tract health', 'Reduces pain during urination', 'Promotes kidney detoxification', 'Anti-inflammatory properties'],
  ARRAY['Gokhru', 'Pashanbhed', 'Punarnava', 'Varun', 'Shilajit'],
  'Take 20-30 ml twice daily mixed in water. Best taken 30 minutes before meals.',
  c.id,
  false,
  true,
  4.5,
  89,
  100
FROM categories c WHERE c.slug = 'kidney-care'
ON CONFLICT (slug) DO NOTHING;

-- Add Brain Booster
INSERT INTO products (name, slug, name_hindi, short_description, description, price, offer_price, images, benefits, ingredients, dosage, category_id, is_featured, is_active, rating, review_count, stock)
SELECT
  'Brain Booster',
  'brain-booster',
  'ब्रेन बूस्टर',
  'Ayurvedic formulation for enhanced memory, focus and cognitive performance',
  'Brain Booster is a premium Ayurvedic supplement crafted to enhance memory, improve concentration, and support overall cognitive health. Formulated with powerful brain-boosting herbs used in traditional Ayurveda for centuries.',
  1799,
  1299,
  ARRAY['https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png'],
  ARRAY['Enhances memory and recall', 'Improves focus and concentration', 'Reduces mental fatigue', 'Supports nerve health', 'Promotes mental clarity'],
  ARRAY['Ashwagandha', 'Brahmi', 'Shankhpushpi', 'Amla', 'Jatamansi'],
  'Take 1 capsule twice daily with milk or warm water after meals.',
  c.id,
  false,
  true,
  4.6,
  156,
  100
FROM categories c WHERE c.slug = 'brain-care'
ON CONFLICT (slug) DO NOTHING;

-- Add Hair Growth
INSERT INTO products (name, slug, name_hindi, short_description, description, price, offer_price, images, benefits, ingredients, dosage, category_id, is_featured, is_active, rating, review_count, stock)
SELECT
  'Hair Growth',
  'hair-growth',
  'हेयर ग्रोथ',
  'Natural Ayurvedic formula for hair growth, thickness and scalp nourishment',
  'Hair Growth is a scientifically-backed Ayurvedic formulation that promotes hair growth, reduces hair fall, and nourishes the scalp. Made with potent herbs known for their hair-strengthening properties.',
  1599,
  1099,
  ARRAY['https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png'],
  ARRAY['Promotes hair growth naturally', 'Reduces excessive hair fall', 'Nourishes scalp and hair roots', 'Adds shine and thickness', 'Prevents premature greying'],
  ARRAY['Amla', 'Bhringraj', 'Neem', 'Moringa', 'Aloe Vera'],
  'Take 1 capsule twice daily with lukewarm water after meals.',
  c.id,
  false,
  true,
  4.4,
  203,
  100
FROM categories c WHERE c.slug = 'hair-care'
ON CONFLICT (slug) DO NOTHING;

-- Add Weight Loss
INSERT INTO products (name, slug, name_hindi, short_description, description, price, offer_price, images, benefits, ingredients, dosage, category_id, is_featured, is_active, rating, review_count, stock)
SELECT
  'Weight Loss',
  'weight-loss',
  'वेट लॉस',
  'Herbal weight management formula for healthy and sustainable weight loss',
  'Weight Loss is a natural Ayurvedic formulation designed to support healthy weight management by boosting metabolism, reducing appetite, and promoting fat burning. Made with traditional herbs with no harmful side effects.',
  1699,
  1199,
  ARRAY['https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png'],
  ARRAY['Boosts metabolism naturally', 'Reduces unhealthy cravings', 'Promotes fat burning', 'Improves digestion', 'Provides sustained energy'],
  ARRAY['Triphala', 'Guggul', 'Vijaysar', 'Kutki', 'Shilajit'],
  'Take 1 capsule twice daily with warm water 30 minutes before meals.',
  c.id,
  false,
  true,
  4.3,
  178,
  100
FROM categories c WHERE c.slug = 'weight-management'
ON CONFLICT (slug) DO NOTHING;

-- Add Heart Care product
INSERT INTO products (name, slug, name_hindi, short_description, description, price, offer_price, images, benefits, ingredients, dosage, category_id, is_featured, is_active, rating, review_count, stock)
SELECT
  'Heart Care',
  'heart-care-product',
  'हार्ट केयर',
  'Premium Ayurvedic formulation for cardiovascular health and heart strength',
  'Heart Care is a powerful Ayurvedic supplement formulated to support cardiovascular health, maintain healthy cholesterol levels, and strengthen the heart muscle. Crafted with time-tested cardio-protective herbs.',
  1999,
  1499,
  ARRAY['https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png'],
  ARRAY['Supports cardiovascular health', 'Maintains healthy cholesterol', 'Strengthens heart muscle', 'Improves blood circulation', 'Reduces stress on heart'],
  ARRAY['Arjuna', 'Ashwagandha', 'Turmeric', 'Amla', 'Sarpagandha'],
  'Take 1 capsule twice daily with warm water after meals.',
  c.id,
  false,
  true,
  4.7,
  134,
  100
FROM categories c WHERE c.slug = 'heart-care'
ON CONFLICT (slug) DO NOTHING;

-- Rename Kidney Stone Complete Kit -> Pathri Mukti Complete Combo
UPDATE combos SET
  name = 'Pathri Mukti Complete Combo',
  slug = 'pathri-mukti-complete-combo',
  description = 'The ultimate kidney stone solution — Pathri Mukti Capsules + Powder + Liquid for maximum effectiveness. Dissolve stones, cleanse kidneys and restore urinary health.',
  is_featured = true
WHERE slug = 'kidney-stone-kit';

-- Add Ear Veda Complete Combo
INSERT INTO combos (name, slug, description, image_url, price, offer_price, product_ids, is_featured, is_active)
SELECT
  'Ear Veda Complete Combo',
  'ear-veda-complete-combo',
  'Complete ear care solution — Ear Veda Capsules + Powder for comprehensive treatment of ear infections, hearing issues, and ear pain. Maximum relief guaranteed.',
  'https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png',
  3298,
  1999,
  ARRAY[
    (SELECT id FROM products WHERE slug = 'ear-veda-capsules'),
    (SELECT id FROM products WHERE slug = 'ear-veda-powder')
  ],
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM combos WHERE slug = 'ear-veda-complete-combo');
