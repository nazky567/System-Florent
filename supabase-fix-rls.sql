-- ══════════════════════════════════════════════════════════════
-- Florentt — Fix Infinite Recursion in profiles RLS
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin manage products" ON public.products;
DROP POLICY IF EXISTS "Admin view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;

-- Recreate profiles policies using auth.jwt() instead of querying profiles table
-- This avoids the circular dependency

-- Admin can view all profiles (check role from JWT metadata, not profiles table)
CREATE POLICY "Admin view all profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
        OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- Since we can't easily check admin from JWT for new users,
-- use a simpler approach: let authenticated users read their own profile
-- and use a service role for admin operations
-- For now, we'll use a security definer function

-- Create a helper function to check admin status without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop the overly complex policy we just created and use the function
DROP POLICY IF EXISTS "Admin view all profiles" ON public.profiles;

-- Simple policy: users see their own profile
-- (The "Users view own profile" policy already handles this)

-- Admin policy using the security definer function (avoids recursion)
CREATE POLICY "Admin view all profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR public.is_admin()
    );

-- Fix other admin policies that query profiles table
CREATE POLICY "Admin manage products" ON public.products
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admin view all orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = user_id OR public.is_admin()
    );

-- Also fix admin manage orders if it exists
CREATE POLICY "Admin manage orders" ON public.orders
    FOR ALL USING (public.is_admin());

-- ── Done! RLS infinite recursion fixed ──────────────────────
