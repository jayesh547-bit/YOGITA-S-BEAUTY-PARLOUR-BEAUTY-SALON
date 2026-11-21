"use client";

import React from "react";
import { Sparkles, Calendar, Award } from "lucide-react";
import { BeauticianItem } from "@/lib/types";

interface ExpertsProps {
  beauticians: BeauticianItem[];
  onSelectExpertToBook: (beauticianId: string) => void;
}

export default function Experts({
  beauticians,
  onSelectExpertToBook,
}: ExpertsProps) {
  const activeBeauticians = beauticians.filter((b) => b.is_active);

  return (
    <section id="experts" className="py-24 bg-gradient-to-b from-ivory-100 to-blush-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Artisans</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            Meet Our Beauty Specialists
          </h2>
          <p className="text-chocolate/75 text-sm sm:text-base font-light">
            Dedicated artists specializing in aesthetic haircare, skin radiance, and bridal perfection, ensuring every guest experiences comforting care.
          </p>
        </div>

        {/* Beauticians Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeBeauticians.map((expert) => (
            <div
              key={expert.id}
              className="luxury-card rounded-3xl overflow-hidden flex flex-col group p-6 text-center"
            >
              {/* Circular / Rounded Portrait */}
              <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-2 border-gold-300 p-1.5 shadow-md mb-6">
                <div className="w-full h-full rounded-full overflow-hidden bg-blush-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={expert.image_url}
                    alt={expert.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-1.5 mb-3">
                <h3 className="font-editorial text-2xl font-bold text-chocolate">
                  {expert.name}
                </h3>
                <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest">
                  {expert.specialization}
                </p>
              </div>

              {/* Experience Badge */}
              <div className="inline-flex items-center justify-center space-x-1.5 text-xs text-chocolate/70 font-medium mb-4 bg-blush-100/60 py-1 px-3 rounded-full mx-auto">
                <Award className="w-3.5 h-3.5 text-gold-500" />
                <span>{expert.experience}</span>
              </div>

              {/* Bio */}
              <p className="text-xs text-chocolate/75 font-light leading-relaxed mb-6 flex-1">
                {expert.bio}
              </p>

              {/* CTA */}
              <button
                onClick={() => onSelectExpertToBook(expert.id)}
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book with {expert.name}</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

