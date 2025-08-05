-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PERMISSIVE POLICIES - Allow everyone to access images bucket
-- Since your app handles authentication at the application level
-- =============================================

-- Policy to allow ANYONE to upload images
CREATE POLICY "Allow anyone to upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

-- Policy to allow ANYONE to read images
CREATE POLICY "Allow anyone to read images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Policy to allow ANYONE to update images
CREATE POLICY "Allow anyone to update images" ON storage.objects
FOR UPDATE WITH CHECK (bucket_id = 'images');

-- Policy to allow ANYONE to delete images
CREATE POLICY "Allow anyone to delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'images');

-- Note: These policies are permissive because your app already handles 
-- authentication and authorization at the application level through NextAuth.
-- Only admin users can access the admin routes where image uploads happen.