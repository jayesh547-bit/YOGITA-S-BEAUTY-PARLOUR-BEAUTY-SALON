"use client";

import React, { useState } from "react";
import { Clock, Sparkles, ArrowRight, X, Info } from "lucide-react";
import { ServiceItem } from "@/lib/types";

interface ServicesProps {
  services: ServiceItem[];
  onSelectServiceToBook: (service: ServiceItem) => void;
}

export default function Services({
  services,
  onSelectServiceToBook,
}: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = [
    "All",
    "Hair",
    "Skin & Facial",
    "Bridal & Makeup",
    "Nails & Care",
    "Spa & Wellness",
  ];

  const filteredServices = services.filter((s) =>
    activeCategory === "All" ? true : s.category === activeCategory
  );

  return (
    <section id="services" className="py-24 bg-ivory-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Salon Menu</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            Curated Beauty & Wellness Rituals
          </h2>
          <p className="text-chocolate/75 text-sm sm:text-base font-light">
            Indulge in expert haircare, radiance-boosting facials, bridal couture artistry, and rejuvenating body therapies tailored for you.
          </p>

          {/* Sample Data Disclosure */}
          <div className="inline-block bg-blush-100/70 border border-blush-200 text-chocolate/70 text-[11px] px-3.5 py-1 rounded-full">
            <span>Sample baseline pricing displayed. Configurable from the Salon Admin Dashboard.</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gold-400 text-chocolate shadow-gold"
                  : "bg-white/80 border border-blush-200 text-chocolate/70 hover:border-gold-300 hover:text-chocolate"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-blush-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-deep/60 via-transparent to-transparent opacity-80" />
                
                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gold-200">
                  <span className="text-[10px] uppercase tracking-wider text-chocolate font-bold">
                    {service.category}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3.5 right-3.5 bg-chocolate/85 text-ivory-100 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center space-x-1.5 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-gold-400" />
                  <span>{service.duration_minutes} mins</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-editorial text-xl font-bold text-chocolate leading-snug">
                      {service.name}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-chocolate/60 block">
                        Starts at
                      </span>
                      <span className="font-editorial text-xl font-bold text-gold-700">
                        ₹{service.price}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-chocolate/75 font-light line-clamp-3 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-blush-200 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs font-semibold text-chocolate/80 hover:text-gold-700 transition flex items-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => onSelectServiceToBook(service)}
                    className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Details Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chocolate-deep/70 backdrop-blur-sm">
          <div className="bg-ivory-100 rounded-2xl max-w-lg w-full border border-gold-300 overflow-hidden shadow-luxury-lg animate-in fade-in zoom-in-95">
            <div className="relative aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalService.image_url}
                alt={activeModalService.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalService(null)}
                aria-label="Close details"
                className="absolute top-3 right-3 p-1.5 bg-chocolate/80 hover:bg-chocolate text-white rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-600 font-bold">
                    {activeModalService.category}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-chocolate">
                    {activeModalService.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-chocolate/60 block">Price</span>
                  <span className="font-editorial text-2xl font-bold text-gold-700">
                    ₹{activeModalService.price}
                  </span>
                </div>
              </div>

              <p className="text-sm text-chocolate/80 leading-relaxed font-light">
                {activeModalService.description}
              </p>

              <div className="p-3 bg-blush-100/60 rounded-xl border border-blush-200 text-xs text-chocolate/80 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gold-600" />
                  <span>Estimated Duration</span>
                </span>
                <span className="font-bold text-chocolate">
                  {activeModalService.duration_minutes} Minutes
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalService(null)}
                  className="px-4 py-2 text-xs font-semibold text-chocolate hover:bg-blush-100 rounded-lg transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const s = activeModalService;
                    setActiveModalService(null);
                    onSelectServiceToBook(s);
                  }}
                  className="gold-gradient-btn px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

