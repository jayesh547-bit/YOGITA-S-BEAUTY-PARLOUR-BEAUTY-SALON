"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { sampleTestimonials } from "@/lib/data";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto advance testimonial
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sampleTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sampleTestimonials.length) % sampleTestimonials.length
    );
  };

  const current = sampleTestimonials[currentIndex];

  return (
    <section className="py-24 bg-blush-50/70 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Words from Our Guests</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            Guest Testimonials & Praise
          </h2>
          <p className="text-chocolate/60 text-xs uppercase tracking-wider">
            (Sample customer demo reviews shown until verified client reviews are published)
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-white/90 backdrop-blur-md border border-gold-300/50 rounded-3xl p-8 sm:p-12 shadow-luxury-lg text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-blush-100 text-gold-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Quote className="w-6 h-6 rotate-180" />
          </div>

          {/* Star Rating */}
          <div className="flex items-center justify-center space-x-1 mb-6 text-gold-500">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          {/* Testimonial Quote */}
          <p className="font-editorial text-xl sm:text-2xl text-chocolate font-medium italic leading-relaxed mb-8">
            &ldquo;{current.comment}&rdquo;
          </p>

          {/* Reviewer Details */}
          <div>
            <h4 className="font-bold text-chocolate text-base">{current.name}</h4>
            <p className="text-xs text-gold-600 font-medium uppercase tracking-wider mt-0.5">
              Service: {current.service}
            </p>
            <span className="text-[10px] text-chocolate/50 block mt-1">
              {current.date}
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={prevTestimonial}
              aria-label="Previous Testimonial"
              className="p-2 rounded-full border border-blush-200 hover:bg-blush-100 text-chocolate transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {sampleTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-6 bg-gold-400" : "bg-blush-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              aria-label="Next Testimonial"
              className="p-2 rounded-full border border-blush-200 hover:bg-blush-100 text-chocolate transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

