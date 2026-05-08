-- ══════════════════════════════════════════════════════════════
-- Florentt — Supabase PostgreSQL Setup Script
-- ══════════════════════════════════════════════════════════════
-- Jalankan script ini di Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste → Run
-- ══════════════════════════════════════════════════════════════

-- ── 1. Create profiles table (extends auth.users) ────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nama VARCHAR(100) NOT NULL DEFAULT 'User',
    email VARCHAR(100) NOT NULL,
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    provider VARCHAR(20) DEFAULT 'email',
    no_hp VARCHAR(20),
    alamat TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Create products table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    nama_produk VARCHAR(200) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    harga NUMERIC(12,2) NOT NULL,
    stok INTEGER DEFAULT 0,
    deskripsi TEXT,
    gambar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Create orders table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    tanggal_order DATE DEFAULT CURRENT_DATE,
    total_harga NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
    alamat_kirim TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Create order_details table ────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_details (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id),
    nama_produk VARCHAR(200),
    harga NUMERIC(12,2),
    qty INTEGER DEFAULT 1,
    gambar TEXT
);

-- ── 5. Create custom_designs table ───────────────────────────
CREATE TABLE IF NOT EXISTS public.custom_designs (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    ucapan TEXT,
    warna VARCHAR(50),
    tema VARCHAR(50),
    file_gambar TEXT
);

-- ── 6. Create payments table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    metode VARCHAR(50),
    jumlah NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'pending',
    tanggal_bayar TIMESTAMPTZ
);

-- ── 7. Create shipping table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipping (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    kurir VARCHAR(100),
    no_resi VARCHAR(100),
    status_pengiriman VARCHAR(30) DEFAULT 'diproses',
    tanggal_kirim TIMESTAMPTZ
);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping ENABLE ROW LEVEL SECURITY;

-- Products: public read
CREATE POLICY "Products viewable by everyone" ON public.products
    FOR SELECT USING (true);

-- Products: admin insert/update/delete
CREATE POLICY "Admin manage products" ON public.products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Profiles: users can read own profile
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Profiles: users can update own profile
CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Profiles: insert allowed (for trigger)
CREATE POLICY "Allow profile insert" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Admin can view all profiles
CREATE POLICY "Admin view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Orders: users can read own orders
CREATE POLICY "Users view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Orders: users can create orders
CREATE POLICY "Users create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can view all orders
CREATE POLICY "Admin view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can update orders
CREATE POLICY "Admin update orders" ON public.orders
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Order details: follow order access
CREATE POLICY "Order details follow order access" ON public.order_details
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_details.order_id AND orders.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users create order details" ON public.order_details
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_details.order_id AND orders.user_id = auth.uid())
    );

-- Custom designs: follow order access
CREATE POLICY "Custom designs follow order access" ON public.custom_designs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = custom_designs.order_id AND orders.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users create custom designs" ON public.custom_designs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = custom_designs.order_id AND orders.user_id = auth.uid())
    );

-- Payments: follow order access
CREATE POLICY "Payments follow order access" ON public.payments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users create payments" ON public.payments
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
    );

-- Shipping: follow order access
CREATE POLICY "Shipping follow order access" ON public.shipping
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = shipping.order_id AND orders.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ══════════════════════════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nama, email, avatar, provider)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ══════════════════════════════════════════════════════════════
-- SEED DATA — Products
-- ══════════════════════════════════════════════════════════════

INSERT INTO public.products (nama_produk, kategori, harga, stok, deskripsi, gambar) VALUES
('Papan Bunga Happy Wedding', 'Papan Bunga', 850000, 25, 'Papan bunga pernikahan premium dengan rangkaian bunga segar pilihan. Cocok untuk ucapan selamat menikah yang elegan dan berkesan.', '/images/products/papan-wedding.png'),
('Papan Bunga Duka Cita', 'Papan Bunga', 750000, 20, 'Papan bunga belasungkawa dengan desain elegan dan warna lembut. Menyampaikan simpati dengan penuh hormat.', '/images/products/papan-dukacita.png'),
('Papan Bunga Grand Opening', 'Papan Bunga', 950000, 15, 'Papan bunga pembukaan usaha baru dengan desain megah dan warna ceria. Sempurna untuk merayakan grand opening.', '/images/products/papan-opening.png'),
('Bouquet Rose Premium', 'Bouquet', 450000, 30, 'Rangkaian buket mawar premium 20 tangkai yang dibungkus elegan. Pilihan sempurna untuk hari spesial.', '/images/products/bouquet-rose.png'),
('Standing Flower Congratulations', 'Standing Flower', 1200000, 10, 'Standing flower megah tinggi 2 meter dengan campuran bunga tropis dan mawar. Statement piece untuk acara besar.', '/images/products/standing-flower.png'),
('Hand Bouquet Anniversary', 'Bouquet', 350000, 35, 'Hand bouquet romantis dengan mawar pink dan baby breath. Pilihan yang tepat untuk merayakan anniversary.', '/images/products/bouquet-anniversary.png'),
('Papan Bunga Selamat & Sukses', 'Papan Bunga', 800000, 18, 'Papan bunga ucapan selamat dan sukses dengan warna-warna ceria. Cocok untuk berbagai acara perayaan.', '/images/products/papan-sukses.png'),
('Table Arrangement Elegant', 'Table Arrangement', 275000, 40, 'Rangkaian bunga meja elegan dalam vas keramik premium. Sentuhan estetis untuk ruangan Anda.', '/images/products/table-arrangement.png')
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- Done! Database siap digunakan.
-- ══════════════════════════════════════════════════════════════
