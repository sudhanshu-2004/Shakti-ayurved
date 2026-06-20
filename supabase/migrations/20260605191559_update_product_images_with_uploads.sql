/*
# Update product images with uploaded photos

1. Changes
   - Pathri Mukti Capsules, Powder, Liquid → use uploaded Pathri Mukti bottle image
   - Joint Pain Relief Oil → use uploaded Joint Pain bottle image
   - Weight Loss → use uploaded Weight Loss bottle image
   - All other products that share the placeholder → use Weight Loss image as closest match
     until dedicated images are uploaded (better than a generic placeholder)
   - Combos also updated

2. Image paths
   - /images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg  → Pathri Mukti
   - /images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(1).jpeg → Joint Pain
   - /images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(2).jpeg → Weight Loss
   - /images/WhatsApp_Image_2026-06-06_at_12.40.22_AM.jpeg     → Logo (not product)
*/

-- Pathri Mukti products use the Pathri Mukti bottle image
UPDATE products SET images = ARRAY['/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg']
WHERE slug IN ('pathri-mukti-capsules', 'pathri-mukti-powder', 'pathri-mukti-liquid');

-- Joint Pain product uses the Joint Pain bottle image
UPDATE products SET images = ARRAY['/images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(1).jpeg']
WHERE slug = 'joint-pain-relief-oil';

-- Weight Loss product uses the Weight Loss bottle image
UPDATE products SET images = ARRAY['/images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(2).jpeg']
WHERE slug = 'weight-loss';

-- Other products without dedicated images: use the Pathri Mukti image as a branded fallback
-- (all images carry the Ayurved Life brand, better than a generic URL)
UPDATE products SET images = ARRAY['/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg']
WHERE slug IN (
  'ear-veda-capsules', 'ear-veda-powder',
  'pet-safa',
  'brain-booster',
  'hair-growth',
  'heart-care-product',
  'liver-care-capsules',
  'bp-control-capsules',
  'sugar-control-capsules',
  'triphala-tablets'
)
AND (images IS NULL OR images = ARRAY['https://customer-assets.emergentagent.com/job_ba20318a-9236-4ba6-8206-da0637ced974/artifacts/28u3cxdo_file_00000000fa30720bbb916092b72c2d8b.png']);

-- Update combos with matching images
UPDATE combos SET image_url = '/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg'
WHERE slug IN ('pathri-mukti-complete-combo', 'ear-veda-complete-combo');

UPDATE combos SET image_url = '/images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(1).jpeg'
WHERE slug = 'joint-pain-combo';

UPDATE combos SET image_url = '/images/WhatsApp_Image_2026-06-06_at_12.32.39_AM_(2).jpeg'
WHERE slug IN ('sugar-control-combo', 'bp-control-combo', 'liver-care-combo');
