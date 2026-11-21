"use client";

import React, { useState } from "react";
import { MessageCircle, X, Sparkles, Calendar, HelpCircle, PhoneCall } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  salonName?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber,
  salonName = "Yogita's Beauty Parlour",
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  const quickPrompts = [
    {
      title: "Bridal & Occasion Inquiry",
      icon: Sparkles,
      text: `Hello ${salonName}! I would like to inquire about your Bridal Makeup packages, pre-bridal trials, and availability.`,
    },
    {
      title: "Check Appointment Availability",
      icon: Calendar,
      text: `Hello! I would like to check available appointment slots for this week at ${salonName}.`,
    },
    {
      title: "Services & Custom Pricing",
      icon: HelpCircle,
      text: `Hi! Could you please share details and pricing for your hair spa and skincare facial treatments?`,
    },
    {
      title: "Speak with Master Stylist Yogita",
      icon: PhoneCall,
      text: `Hello, I'd like to consult with Yogita regarding a personalized hair & skin makeover.`,
    },
  ];

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Inquiry Popover */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white/95 backdrop-blur-md border border-gold-300/60 rounded-2xl shadow-luxury-lg overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-emerald-600 px-5 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Chat with Yogita's Salon</h4>
                <p className="text-[11px] text-emerald-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Typically replies within minutes</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-emerald-700 transition"
              aria-label="Close WhatsApp prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-ivory-100/70 space-y-2">
            <p className="text-xs text-chocolate/80 mb-2 font-medium">
              Welcome to our women-only luxury salon! How can we assist you today?
            </p>

            {quickPrompts.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(prompt.text)}
                  className="w-full text-left p-2.5 bg-white border border-blush-200 hover:border-gold-400 rounded-xl transition-all hover:bg-gold-50/50 flex items-start space-x-3 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blush-100 flex items-center justify-center text-gold-600 group-hover:bg-gold-100 flex-shrink-0 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-chocolate group-hover:text-gold-700">
                      {prompt.title}
                    </h5>
                    <p className="text-[10px] text-chocolate/60 line-clamp-1 mt-0.5">
                      {prompt.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-white border-t border-blush-200 text-center">
            <button
              onClick={() => handleOpenWhatsApp(`Hello ${salonName}! I have a general inquiry.`)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
            >
              Start Custom WhatsApp Chat &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main WhatsApp Floating Pill / Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Yogita's Beauty Salon on WhatsApp"
        className="group relative flex items-center space-x-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-luxury-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-300 rounded-full border-2 border-emerald-600 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-300 rounded-full border-2 border-emerald-600" />
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
}

