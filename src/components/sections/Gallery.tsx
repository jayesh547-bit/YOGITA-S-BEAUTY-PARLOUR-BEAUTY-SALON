"use client";

import React, { useState } from "react";
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "@/lib/types";

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export default function Gallery({ galleryItems }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    "All",
    "Salon Interior",
    "Bridal Makeup",
    "Party Makeup",
    "Hair Styling",
    "Nail Art",
    "Skincare",
  ];

  const filteredItems = galleryItems.filter((item) =>
    activeCategory === "All" ? true : item.category === activeCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <section id="gallery" className="py-24 bg-ivory-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Atmosphere & Artistry</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            The Yogita&apos;s Gallery
          </h2>
          <p className="text-chocolate/75 text-sm sm:text-base font-light">
            A glimpse inside our women-only sanctuary, bridal transformations, modern hair artistry, and meticulous skin therapies.
          </p>
        </div>

        {/* Gallery Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gold-400 text-chocolate shadow-gold"
                  : "bg-white/80 border border-blush-200 text-chocolate/70 hover:border-gold-300 hover:text-chocolate"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid with Masonry-like Luxury Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-luxury border border-gold-200/50 bg-blush-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Hover Dark/Gold Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-deep/85 via-chocolate-deep/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-bold mb-1">
                  {item.category}
                </span>
                <h4 className="font-editorial text-lg font-bold leading-tight">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-ivory-100/80 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                <div className="mt-3 flex items-center space-x-1.5 text-xs text-gold-300 font-medium">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Preview</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-chocolate-deep/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous Image"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next Image"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Large Image & Caption */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filteredItems[lightboxIndex].image_url}
              alt={filteredItems[lightboxIndex].title}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-gold-300/30"
            />
            <div className="text-center mt-4 text-white space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="font-editorial text-2xl font-bold">
                {filteredItems[lightboxIndex].title}
              </h3>
              {filteredItems[lightboxIndex].caption && (
                <p className="text-sm text-ivory-100/80 max-w-lg mx-auto">
                  {filteredItems[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

