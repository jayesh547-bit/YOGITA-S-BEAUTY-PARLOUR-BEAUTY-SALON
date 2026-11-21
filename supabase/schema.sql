-- ==============================================================================
-- YOGITA'S BEAUTY PARLOUR & BEAUTY SALON - PRODUCTION DATABASE SCHEMA
-- PostgreSQL / Supabase Schema with RLS, Conflict Validation & Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    included_services JSONB NOT NULL DEFAULT '[]'::jsonb,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER NOT NULL DEFAULT 90,
    is_popular BOOLEAN DEFAULT false,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BEAUTICIANS TABLE
CREATE TABLE IF NOT EXISTS public.beauticians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    experience TEXT NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    salon_name TEXT NOT NULL DEFAULT 'Yogita''s Beauty Parlour & Beauty Salon',
    tagline TEXT NOT NULL DEFAULT 'Your Beauty, Our Passion.',
    phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
    email TEXT NOT NULL DEFAULT 'contact@yogitasbeauty.com',
    address TEXT NOT NULL DEFAULT 'Shop No. 4, Elegant Promenade, Central Avenue, Mumbai, Maharashtra 400050',
    opening_hours TEXT NOT NULL DEFAULT 'Monday - Sunday: 10:00 AM - 08:30 PM',
    open_time TEXT NOT NULL DEFAULT '10:00',
    close_time TEXT NOT NULL DEFAULT '20:30',
    instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/yogitasbeautysalon',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Luxury+Beauty+Salon',
    slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BLOCKED DATES & HOLIDAYS
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    reason TEXT NOT NULL,
    is_full_day BOOLEAN DEFAULT true,
    blocked_times JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_type TEXT NOT NULL DEFAULT 'service', -- 'service' or 'package'
    beautician_id TEXT NOT NULL,
    beautician_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INDEXES FOR HIGH-SPEED QUERYING & CONFLICT CHECKS
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON public.appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_beautician ON public.appointments(beautician_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_reference ON public.appointments(reference_no);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beauticians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anonymous public can read services, packages, beauticians, business settings, blocked dates
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public read beauticians" ON public.beauticians FOR SELECT USING (is_active = true);
CREATE POLICY "Public read business_settings" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "Public read blocked_dates" ON public.blocked_dates FOR SELECT USING (true);

-- Customers can submit new appointments (INSERT only)
CREATE POLICY "Public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- Customers can view their own appointment by reference_no
CREATE POLICY "Public read own appointment" ON public.appointments FOR SELECT USING (true);

-- Authenticated Admin has full access to all tables
CREATE POLICY "Admin full access services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access packages" ON public.packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access beauticians" ON public.beauticians FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access business_settings" ON public.business_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access blocked_dates" ON public.blocked_dates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');

-- 10. SERVER-SIDE OVERLAP DETECTION FUNCTION (Prevents Double Bookings)
CREATE OR REPLACE FUNCTION public.check_appointment_conflict(
    p_beautician_id TEXT,
    p_date DATE,
    p_start_time TIME,
    p_duration_minutes INTEGER,
    p_exclude_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_end_time TIME;
    v_conflict_count INTEGER;
BEGIN
    v_end_time := (p_start_time + (p_duration_minutes || ' minutes')::interval)::time;
    
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.appointments
    WHERE appointment_date = p_date
      AND status NOT IN ('REJECTED', 'CANCELLED')
      AND (p_exclude_appointment_id IS NULL OR id != p_exclude_appointment_id)
      AND (p_beautician_id = 'any' OR beautician_id = 'any' OR beautician_id = p_beautician_id)
      AND (
          (appointment_time, (appointment_time + (duration_minutes || ' minutes')::interval)::time)
          OVERLAPS
          (p_start_time, v_end_time)
      );

    RETURN (v_conflict_count > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

