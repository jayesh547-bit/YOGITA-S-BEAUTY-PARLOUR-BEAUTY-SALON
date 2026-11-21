"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Packages from "@/components/sections/Packages";
import Gallery from "@/components/sections/Gallery";
import Experts from "@/components/sections/Experts";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import BookingModal from "@/components/booking/BookingModal";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

import {
  ServiceItem,
  PackageItem,
  BeauticianItem,
  BusinessSettings,
  AppointmentItem,
  GalleryItem,
} from "@/lib/types";
import {
  initialServices,
  initialPackages,
  initialBeauticians,
  initialBusinessSettings,
  initialGallery,
} from "@/lib/data";
import { SalonRepo } from "@/lib/supabase";

export default function Home() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [beauticians, setBeauticians] = useState<BeauticianItem[]>(initialBeauticians);
  const [settings, setSettings] = useState<BusinessSettings>(initialBusinessSettings);
  const [galleryItems] = useState<GalleryItem[]>(initialGallery);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | PackageItem | null>(null);
  const [preselectedBeauticianId, setPreselectedBeauticianId] = useState<string | null>(null);

  // Load latest data from Repository (Supabase or Local Persistence)
  useEffect(() => {
    async function loadData() {
      try {
        const [srv, pkg, btc, stg, app] = await Promise.all([
          SalonRepo.getServices(),
          SalonRepo.getPackages(),
          SalonRepo.getBeauticians(),
          SalonRepo.getSettings(),
          SalonRepo.getAppointments(),
        ]);
        if (srv && srv.length) setServices(srv);
        if (pkg && pkg.length) setPackages(pkg);
        if (btc && btc.length) setBeauticians(btc);
        if (stg) setSettings(stg);
        if (app) setAppointments(app);
      } catch (err) {
        console.warn("Error loading salon data:", err);
      }
    }
    loadData();
  }, []);

  const handleOpenBooking = () => {
    setPreselectedService(null);
    setPreselectedBeauticianId(null);
    setIsBookingOpen(true);
  };

  const handleSelectServiceToBook = (service: ServiceItem) => {
    setPreselectedService(service);
    setPreselectedBeauticianId(null);
    setIsBookingOpen(true);
  };

  const handleSelectPackageToBook = (pkg: PackageItem) => {
    setPreselectedService(pkg);
    setPreselectedBeauticianId(null);
    setIsBookingOpen(true);
  };

  const handleSelectExpertToBook = (beauticianId: string) => {
    setPreselectedService(null);
    setPreselectedBeauticianId(beauticianId);
    setIsBookingOpen(true);
  };

  const handleBookingCreated = (newBooking: AppointmentItem) => {
    setAppointments((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-ivory-100 text-chocolate">
      {/* Premium Sticky / Transparent Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Phase 2: 3D Interactive Hero */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* Phase 3: About Us */}
        <About onOpenBooking={handleOpenBooking} />

        {/* Phase 3: Services Menu */}
        <Services
          services={services}
          onSelectServiceToBook={handleSelectServiceToBook}
        />

        {/* Phase 3: Premium Packages */}
        <Packages
          packages={packages}
          onSelectPackageToBook={handleSelectPackageToBook}
        />

        {/* Phase 3: Beauty Gallery */}
        <Gallery galleryItems={galleryItems} />

        {/* Phase 3: Our Beauty Experts */}
        <Experts
          beauticians={beauticians}
          onSelectExpertToBook={handleSelectExpertToBook}
        />

        {/* Phase 3: Customer Testimonials */}
        <Testimonials />

        {/* Phase 3: FAQ */}
        <FAQ />

        {/* Phase 3: Contact & Hours */}
        <Contact settings={settings} onOpenBooking={handleOpenBooking} />
      </main>

      {/* Footer */}
      <Footer settings={settings} onOpenBooking={handleOpenBooking} />

      {/* Phase 4: Multi-Step Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
        preselectedBeauticianId={preselectedBeauticianId}
        services={services}
        packages={packages}
        beauticians={beauticians}
        settings={settings}
        existingAppointments={appointments}
        onBookingCreated={handleBookingCreated}
      />

      {/* Phase 5: Floating WhatsApp Concierge */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsapp_number}
        salonName={settings.salon_name}
      />
    </div>
  );
}

