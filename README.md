# YOGITA'S BEAUTY PARLOUR & BEAUTY SALON
### Luxury 3D Experience • Real Appointment Booking Engine • Secure Admin Dashboard

> **Tagline:** *"Your Beauty, Our Passion."*  
> **Category:** Exclusive Girls-Only & Women-Only Luxury Beauty Sanctuary.

---

## 💎 Project Overview

**Yogita's Beauty Parlour & Beauty Salon** is a commercial luxury digital web platform engineered for an exclusive women-only salon brand. Designed with the aesthetics of an international luxury couture brand, this application features custom **interactive 3D WebGL experiences**, a **real 5-step appointment booking engine** with **server-side conflict prevention** in the `Asia/Kolkata` timezone, **WhatsApp click-to-chat concierge**, and a comprehensive **secure Salon Admin Portal**.

---

## 🎨 Phase 1: Brand Identity & Design System

The platform is designed around a feminine luxury color palette:

| Color Role | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary** | `#F4DDE2` | Blush Pink — Soft backgrounds, delicate cards, subtle accents |
| **Secondary** | `#FFF9F3` | Warm Ivory — Editorial whitespace, clean canvas |
| **Accent** | `#C5A46D` | Champagne Gold — Buttons, borders, foil gradients, 3D lighting |
| **Supporting** | `#D9B7AE` | Rose Beige — Dividers, scrollbars, muted tones |
| **Dark** | `#382B2B` | Deep Chocolate Brown — Luxury typography, high contrast |

- **Headings Typography:** *Playfair Display* & *Cormorant Garamond* (Editorial Serif)
- **Body Typography:** *Plus Jakarta Sans* (Minimalist modern sans-serif)
- **Visual Styling:** Frosted glassmorphism (`backdrop-blur-md`), gold shimmer borders, smooth transitions, and custom gold scrollbars.

---

## 🌸 Phase 2: Advanced 3D Experience

Implemented in `src/components/3d/Hero3DExperience.tsx` using **Three.js**:
- **3D Procedural Fluted Perfume Bottle:** Realistic refractive physical glass transmission (`transmission: 0.88`, `thickness: 1.4`), inner rose-gold elixir, champagne gold neck collar, and octagonal crystal cap.
- **Cosmetic Gold Cream Jar:** Frosted blush glass container with polished champagne gold mirror lid.
- **Floating Silk Rose Petals:** Curving 3D petals with aerodynamic drift, flutter, and rotational physics.
- **Champagne Gold Dust Particles:** Ambient twinkling flecks reacting to lighting.
- **Interactive Lighting:** Directional key and fill lights, plus dynamic cursor-tracking point light.
- **Mouse Parallax & Scroll Depth:** Smooth lerp camera tracking with WebGL detection and responsive mobile fallbacks.

---

## 🏛️ Phase 3: Website Architecture & Sections

1. **Sticky / Transparent Navbar:**
   - Brand monogram and luxury typography
   - Top banner: *"Exclusive Girls-Only & Women-Only Luxury Sanctuary"*
   - Smooth navigation links to all sections
   - Direct CTA: *"Book Appointment"*
   - Mobile hamburger drawer
2. **Hero Section:**
   - Interactive 3D scene + high-fashion photography showcase
   - Headline: *"Discover Your Beauty. Rediscover Yourself."*
   - Supporting narrative and dual CTA buttons
3. **About Us:**
   - Heading: *"Beauty Is Personal. So Is Our Care."*
   - Honest brand philosophy highlighting the comfortable, hygienic, women-only environment
4. **Services Menu:**
   - Interactive category filters: *All, Hair, Skin & Facial, Bridal & Makeup, Nails & Care, Spa & Wellness*
   - 10 full services: Haircut & Styling, Hair Spa, Facials, Bridal Makeup, Party Makeup, Mani-Pedi, Nail Art, Waxing & Threading, Aromatherapy Body Spa, Balayage
   - Starting price, duration in minutes, "View Details" modal, and "Book Now" CTA
5. **Curated Packages:**
   - 4 bespoke packages: *Everyday Glow, Premium Self-Care, Bridal Beauty, Complete Makeover*
   - Included service checklists, durations, and pricing
6. **Beauty Gallery:**
   - Category filtering (*Salon Interior, Bridal Makeup, Party Makeup, Hair Styling, Nail Art, Skincare*)
   - Full-screen high-resolution lightbox with Next/Previous navigation
7. **Our Beauty Specialists:**
   - Master Stylist profiles for **Yogita** (Founder), **Pooja** (Bridal), and **Priya** (Hair & Nails)
   - "Book with this expert" quick trigger
8. **Customer Testimonials:**
   - Animated slider with demo reviews clearly identified as sample client reviews
9. **Frequently Asked Questions (FAQ):**
   - Accordion answering booking policies, beautician choice, advance notice, bridal makeup, and hygiene
10. **Contact & Location:**
    - Full salon address, telephone, email, opening hours, Google Maps embed, Instagram link, and contact form

---

## 📅 Phase 4: Real Appointment Booking System

Located in `src/components/booking/BookingModal.tsx` and `src/app/api/appointments/route.ts`:

- **Step 1: Choose Your Ritual** — Toggle between Individual Services and Packages; category filter.
- **Step 2: Select Your Expert** — Pick a specific specialist or choose *"Any Available Beautician"*.
- **Step 3: Select Date & Time** —
  * Calendar with disabled past dates.
  * Real-time slot generator calculating slots between salon opening (`10:00`) and closing (`20:30`).
  * Accounts for service duration so bookings don't exceed closing time.
  * `Asia/Kolkata` timezone aware.
- **Step 4: Guest Details** — Full Name, Mobile Number (with phone validation), Email, and Special Requests.
  * Payment Notice: *"No advance online payment required. Payment can be made directly at the salon during your visit."*
- **Step 5: Confirmation & Real Save** —
  * Server-side conflict check: rejects overlapping appointments for the same beautician.
  * Generates unique booking reference (e.g. `YOG-2026-XXXX`).
  * Initial status: `PENDING`.
  * Celebratory golden confetti animation.
  * Instant *"Notify Salon via WhatsApp"* pre-filled button.

---

## 💬 Phase 5: WhatsApp Concierge Integration

Located in `src/components/ui/FloatingWhatsApp.tsx`:
- Floating badge with pulsating online status indicator.
- Interactive popover with 4 quick pre-filled prompts:
  1. *Bridal & Occasion Inquiry*
  2. *Check Appointment Availability*
  3. *Services & Custom Pricing*
  4. *Direct Consultation with Master Stylist Yogita*
- Opens native WhatsApp / Web WhatsApp using configured phone number.

---

## 🛡️ Phase 6: Secure Admin Dashboard (`/admin`)

- **Secure Login Route:** Protected with HTTP-only session cookies and backend validation (`/api/admin/login`).
- **Dashboard Overview:** Metric counters for Total Bookings, Today's Schedule, Pending Review, Confirmed, and Completed.
- **Appointment Management:** Real-time search by guest name, mobile, or reference number; filter by status and date; Confirm, Reject, Cancel, or Mark Completed; direct WhatsApp reply button.
- **Services Management:** Add, edit, or delete salon services; update prices, durations, descriptions, and image URLs.
- **Packages Management:** Edit package prices, descriptions, and durations.
- **Beautician Management:** Add new stylists, update bios, and toggle active/inactive roster status.
- **Availability Management:** Configure salon opening/closing hours, slot intervals (15, 30, 45, 60 mins), and register blackout dates for holidays or private events.
- **Business Settings & Supabase Status:** Update salon phone, WhatsApp, email, address, Instagram, and inspect live Supabase database status.

---

## 🗄️ Phase 7: Supabase Integration & Dual Persistence

The repository layer (`src/lib/supabase.ts`) implements **resilient dual persistence**:

1. **When Supabase is connected:** Reads and writes directly to PostgreSQL tables with Row-Level Security (RLS) policies and triggers (`supabase/schema.sql`).
2. **When running offline / demo:** Gracefully falls back to local storage and in-memory server cache so the application remains 100% operational without errors.

### Supabase Setup Instructions:
1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and execute `supabase/schema.sql`.
3. Create `.env.local` based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_DEFAULT_EMAIL=admin@yogitasbeauty.com
ADMIN_DEFAULT_PASSWORD=YogitaLuxury@2025
NEXT_PUBLIC_SALON_WHATSAPP=919876543210
NEXT_PUBLIC_SALON_PHONE=+91 98765 43210
NEXT_PUBLIC_SALON_EMAIL=contact@yogitasbeauty.com
```

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm run start

# Server will be running on http://localhost:3000
# Admin Dashboard at http://localhost:3000/admin
```

### Default Admin Credentials:
- **Email:** `admin@yogitasbeauty.com`
- **Password:** `YogitaLuxury@2025`

