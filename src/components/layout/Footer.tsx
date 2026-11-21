"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";
import { BusinessSettings } from "@/lib/types";

interface FooterProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export default function Footer({ settings, onOpenBooking }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chocolate text-ivory-100 pt-16 pb-12 border-t border-gold-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-400 to-blush-200 flex items-center justify-center text-chocolate font-bold">
                <span className="font-editorial text-lg">Y</span>
              </div>
              <div>
                <span className="font-editorial text-xl font-bold tracking-tight text-ivory-100 block">
                  YOGITA&apos;S
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
                  Beauty Parlour & Salon
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ivory-100/70 font-light leading-relaxed max-w-sm">
              &ldquo;{settings.tagline}&rdquo; An exclusive girls-only and women-only beauty salon dedicated to personal empowerment, unhurried care, and clinical hygiene.
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-gold-300 bg-white/5 py-1.5 px-3 rounded-full border border-gold-400/20">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Strictly Women & Girls Only</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-ivory-100/80">
              <li>
                <a href="#hero" className="hover:text-gold-300 transition">
                  Home Sanctuary
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gold-300 transition">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-300 transition">
                  Services & Treatments
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-gold-300 transition">
                  Curated Packages
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-gold-300 transition">
                  Visual Gallery
                </a>
              </li>
              <li>
                <a href="#experts" className="hover:text-gold-300 transition">
                  Our Beauty Experts
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold-300 transition">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Concierge */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400">
              Concierge & Booking
            </h4>
            <p className="text-xs text-ivory-100/70 leading-relaxed">
              Appointments are required to guarantee unhurried attention.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenBooking}
                className="gold-gradient-btn w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book Your Session</span>
              </button>
            </div>
            <p className="text-[11px] text-ivory-100/60 pt-1">
              * Payment can be made directly at the salon upon completion of service.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-100/60 gap-4">
          <p>
            &copy; {currentYear} {settings.salon_name}. All rights reserved.
          </p>

          <div className="flex items-center space-x-6">
            <Link
              href="/admin"
              className="text-ivory-100/50 hover:text-gold-400 transition"
            >
              Salon Admin Dashboard
            </Link>
            <span className="flex items-center space-x-1 text-ivory-100/50">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-blush-300 fill-current" />
              <span>for Women</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

