-- Script untuk membuat akun Admin secara langsung di database Supabase
-- Eksekusi script ini di menu "SQL Editor" pada dashboard Supabase Anda.

-- Pastikan ekstensi pgcrypto aktif (biasanya sudah aktif di Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert ke tabel auth.users
WITH admin_insert AS (
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@florentt.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin Florentt","role":"admin"}', -- role: admin ada di meta_data
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id
)
-- 2. Insert ke public.profiles (Opsional jika trigger handle_new_user sudah berjalan, 
-- tapi kita masukkan manual untuk memastikan role admin tersimpan)
INSERT INTO public.profiles (id, email, nama, role, created_at)
SELECT id, 'admin@florentt.com', 'Admin Florentt', 'admin', now()
FROM admin_insert
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Selesai! Anda sekarang dapat login dengan:
-- Email: admin@florentt.com
-- Password: admin123
