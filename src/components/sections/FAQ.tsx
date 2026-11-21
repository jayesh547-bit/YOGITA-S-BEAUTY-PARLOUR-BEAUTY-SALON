"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { faqList } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-ivory-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-chocolate/75 text-sm sm:text-base font-light">
            Everything you need to know about our women-only sanctuary, booking policies, and luxury care.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/80 border border-blush-200/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between text-chocolate font-semibold text-sm sm:text-base hover:text-gold-700 transition"
                >
                  <span className="font-editorial text-base sm:text-lg">
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-blush-100 flex items-center justify-center text-chocolate/70 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-gold-100 text-gold-700" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-chocolate/80 leading-relaxed font-light border-t border-blush-100 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

