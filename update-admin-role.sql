-- ============================================================
-- PENTING: Sebelum run, ganti Role di dropdown SQL Editor
-- dari "authenticated" ke "postgres" (pojok kanan atas editor)
-- ============================================================

-- Step 1: Update role menjadi admin
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || 
  '{"role": "admin", "full_name": "Admin Florentt"}'::jsonb
WHERE email = 'admin@florentt.com';

-- Step 2: Verifikasi hasilnya
SELECT 
  id,
  email,
  raw_user_meta_data->>'role'      AS role,
  raw_user_meta_data->>'full_name' AS full_name
FROM auth.users
WHERE email = 'admin@florentt.com';
