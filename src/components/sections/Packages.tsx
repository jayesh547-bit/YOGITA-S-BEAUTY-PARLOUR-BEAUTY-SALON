"use client";

import React from "react";
import { Sparkles, Check, Clock, ArrowRight, Star } from "lucide-react";
import { PackageItem } from "@/lib/types";

interface PackagesProps {
  packages: PackageItem[];
  onSelectPackageToBook: (pkg: PackageItem) => void;
}

export default function Packages({
  packages,
  onSelectPackageToBook,
}: PackagesProps) {
  return (
    <section id="packages" className="py-24 bg-gradient-to-b from-blush-50/50 to-ivory-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Pampering Suites</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            Exclusive Beauty Packages
          </h2>
          <p className="text-chocolate/75 text-sm sm:text-base font-light">
            Indulge in harmonized multi-treatment experiences designed to restore your glow and provide comprehensive head-to-toe luxury.
          </p>
        </div>

        {/* 4 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const isFeatured = pkg.is_popular;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? "bg-white border-2 border-gold-400 shadow-luxury-lg scale-105 z-10"
                    : "bg-white/80 border border-blush-200/80 shadow-luxury hover:border-gold-300 hover:scale-[1.02]"
                }`}
              >
                {/* Popular Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-400 text-chocolate text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full shadow-sm flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Most Requested</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Package Title & Tagline */}
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-600 font-bold block mb-1">
                      {pkg.tagline}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-chocolate">
                      {pkg.name}
                    </h3>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="pt-2 pb-4 border-b border-blush-200">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-editorial text-3xl sm:text-4xl font-bold text-chocolate">
                        ₹{pkg.price}
                      </span>
                      <span className="text-xs text-chocolate/60">/ package</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gold-600 font-medium mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Approx. {pkg.duration_minutes} Minutes</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-chocolate/75 font-light leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Included Services List */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] uppercase tracking-wider text-chocolate font-bold">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-2">
                      {pkg.included_services.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2 text-xs text-chocolate/80"
                        >
                          <div className="w-4 h-4 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Book Package CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectPackageToBook(pkg)}
                    className={`w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all ${
                      isFeatured
                        ? "gold-gradient-btn shadow-gold"
                        : "bg-chocolate text-ivory-100 hover:bg-chocolate-light"
                    }`}
                  >
                    <span>Reserve Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

