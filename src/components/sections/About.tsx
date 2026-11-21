"use client";

import React from "react";
import { Sparkles, Shield, HeartHandshake, Sparkle, ArrowRight } from "lucide-react";

interface AboutProps {
  onOpenBooking: () => void;
}

export default function About({ onOpenBooking }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-ivory-100 to-blush-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Collage Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary High Fashion Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-luxury-lg border border-gold-200/60 aspect-[4/5] z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
                  alt="Personalized Beauty Care at Yogita's Beauty Parlour"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-deep/40 via-transparent to-transparent" />
              </div>

              {/* Overlapping Secondary Image */}
              <div className="absolute -bottom-8 -right-6 sm:-right-8 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory-100 z-20 hidden sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
                  alt="Hygienic Skincare Facial Treatment"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Gold Accent Badge */}
              <div className="absolute -top-6 -left-6 z-20 bg-ivory-100/90 backdrop-blur-md border border-gold-400/50 rounded-2xl p-4 shadow-luxury">
                <p className="text-[10px] uppercase tracking-widest text-gold-600 font-bold">
                  Women-Only
                </p>
                <p className="font-editorial text-sm font-bold text-chocolate">
                  Comfort & Privacy
                </p>
              </div>

            </div>
          </div>

          {/* Right Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Philosophy & Sanctuary</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
              Beauty Is Personal. <br />
              <span className="italic font-normal gold-gradient-text">
                So Is Our Care.
              </span>
            </h2>

            <p className="text-chocolate/80 text-base font-light leading-relaxed">
              At <strong>Yogita&apos;s Beauty Parlour & Beauty Salon</strong>, we believe that true elegance begins with how you feel inside. Designed exclusively for women and girls, our salon is a welcoming sanctuary crafted to offer peace, unhurried attention, and bespoke aesthetic care.
            </p>

            <p className="text-chocolate/80 text-base font-light leading-relaxed">
              Whether you are preparing for your dream wedding, refreshing your seasonal style with a modern cut and balayage, or indulging in restorative skin therapy, our focus is always on uncompromising hygiene, premium products, and results tailored to your individuality.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/70 border border-blush-200 shadow-sm flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-chocolate text-sm">
                    Hospital-Grade Hygiene
                  </h4>
                  <p className="text-xs text-chocolate/70 mt-0.5">
                    Sterilized tools, disposable single-use kits, and pristine treatment stations.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-blush-200 shadow-sm flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-chocolate text-sm">
                    Personalized Attention
                  </h4>
                  <p className="text-xs text-chocolate/70 mt-0.5">
                    One-on-one consultations to understand your skin texture, hair goals, and lifestyle.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="gold-gradient-btn px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-2"
              >
                <span>Reserve An Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#services"
                className="text-xs font-semibold uppercase tracking-wider text-chocolate hover:text-gold-600 transition-colors inline-flex items-center space-x-1"
              >
                <span>View Full Menu</span>
                <Sparkle className="w-3 h-3 text-gold-500" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

