"use client";

import React from "react";
import { Sparkles, ArrowRight, Shield, Award, Heart } from "lucide-react";
import Hero3DExperience from "../3d/Hero3DExperience";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-8 pb-16"
    >
      {/* 3D Immersive Canvas Layer */}
      <Hero3DExperience />

      {/* Subtle Background Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blush-100/60 via-gold-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Editorial Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Elegant Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold-300/50 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-chocolate">
                Your Beauty, Our Passion.
              </span>
            </div>

            {/* Cinematic Headings */}
            <h1 className="font-editorial text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-chocolate leading-[1.08]">
              Discover Your Beauty. <br />
              <span className="italic font-normal gold-gradient-text">
                Rediscover Yourself.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-chocolate/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Where beauty meets elegance. Experience personalized beauty, haircare and skincare services designed exclusively for women.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenBooking}
                className="gold-gradient-btn w-full sm:w-auto px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-gold flex items-center justify-center space-x-3 group"
              >
                <span>Book Your Appointment</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-7 py-4 rounded-full text-xs uppercase tracking-widest font-bold text-chocolate bg-white/70 hover:bg-white border border-gold-300/60 shadow-sm backdrop-blur-sm transition-all text-center"
              >
                Explore Our Services
              </a>
            </div>

            {/* Value Highlights */}
            <div className="pt-8 border-t border-blush-200/70 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center lg:justify-start space-x-1.5 text-gold-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-editorial text-lg font-bold text-chocolate">100%</span>
                </div>
                <p className="text-[11px] text-chocolate/70 font-medium">Girls & Women Only</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-center lg:justify-start space-x-1.5 text-gold-600">
                  <Award className="w-4 h-4" />
                  <span className="font-editorial text-lg font-bold text-chocolate">Premium</span>
                </div>
                <p className="text-[11px] text-chocolate/70 font-medium">Bespoke Couture Care</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-center lg:justify-start space-x-1.5 text-gold-600">
                  <Heart className="w-4 h-4" />
                  <span className="font-editorial text-lg font-bold text-chocolate">Hygienic</span>
                </div>
                <p className="text-[11px] text-chocolate/70 font-medium">Sanitized Sanctuary</p>
              </div>
            </div>
          </div>

          {/* Right Floating Editorial Showcase Card */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-sm">
              
              {/* Outer decorative gold frame */}
              <div className="absolute -inset-3 rounded-[2.5rem] border border-gold-300/40 -rotate-2 pointer-events-none" />

              {/* Main Editorial Image Card */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-luxury-lg border border-gold-200/60 bg-white">
                <div className="aspect-[4/5] relative overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
                    alt="Luxury Salon Experience at Yogita's Beauty Parlour"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-deep/80 via-transparent to-transparent" />
                  
                  {/* Floating Overlay Badge */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
                      Private Suite
                    </span>
                    <h3 className="font-editorial text-xl font-bold">
                      A Pure Retreat for the Modern Woman
                    </h3>
                    <p className="text-xs text-ivory-100/80">
                      Relax in complete privacy, comfort and hygienic tranquility.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill */}
              <div className="absolute -bottom-5 -left-8 bg-white/95 backdrop-blur-md border border-gold-300/60 rounded-2xl p-3.5 shadow-luxury flex items-center space-x-3 max-w-[240px]">
                <div className="w-9 h-9 rounded-full bg-blush-200 flex items-center justify-center text-chocolate font-bold text-xs flex-shrink-0">
                  ★ 5.0
                </div>
                <div>
                  <p className="text-[11px] font-bold text-chocolate leading-tight">
                    Rated 5 Stars
                  </p>
                  <p className="text-[10px] text-chocolate/70">
                    Trusted by local women & brides
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

