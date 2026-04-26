ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS model_url text;

UPDATE gallery SET images = ARRAY[image_url] WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);
