/*
# Fix remaining product and combo images

Updates all products/combos still using old CDN URLs to use local uploaded images.
- Products without a dedicated uploaded image get the Pathri Mukti bottle image as branded fallback.
- The Triphala+Isabgol combo (not in the main 6 combos) also gets the fallback image.
*/

UPDATE products SET images = ARRAY['/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg']
WHERE slug IN (
  'bp-control-capsules',
  'ear-veda-capsules',
  'ear-veda-powder',
  'liver-care-capsules',
  'pet-safa',
  'sugar-control-capsules',
  'triphala-tablets'
);

UPDATE combos SET image_url = '/images/WhatsApp_Image_2026-06-05_at_10.54.04_PM.jpeg'
WHERE slug = 'triphala-isabgol-combo';
