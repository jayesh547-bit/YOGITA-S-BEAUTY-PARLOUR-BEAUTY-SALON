"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Send,
  CheckCircle2,
} from "lucide-react";
import { BusinessSettings } from "@/lib/types";

interface ContactProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export default function Contact({ settings, onOpenBooking }: ContactProps) {
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !msg) return;
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setName("");
      setEmail("");
      setMsg("");
    }, 4000);
  };

  const cleanWhatsapp = settings.whatsapp_number.replace(/\D/g, "");

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-ivory-100 to-blush-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 text-gold-600 font-semibold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect With Us</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-chocolate leading-tight">
            We Welcome You to Our Salon
          </h2>
          <p className="text-chocolate/75 text-sm sm:text-base font-light">
            Have questions about an upcoming bridal trial, hair transformation, or custom package? Reach out to our dedicated concierge.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Configurable Salon Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="luxury-card rounded-3xl p-8 space-y-6">
              <h3 className="font-editorial text-2xl font-bold text-chocolate">
                Salon Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-semibold block">
                      Telephone Inquiries
                    </span>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                      className="font-medium text-chocolate hover:text-gold-700 transition"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-semibold block">
                      Official WhatsApp Concierge
                    </span>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-700 hover:underline transition"
                    >
                      +{cleanWhatsapp} (Click to Chat)
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-semibold block">
                      Email Concierge
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-medium text-chocolate hover:text-gold-700 transition"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-semibold block">
                      Salon Address
                    </span>
                    <p className="font-medium text-chocolate leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-blush-100 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-semibold block">
                      Salon Business Hours
                    </span>
                    <p className="font-medium text-chocolate">
                      {settings.opening_hours}
                    </p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start space-x-3.5 pt-2">
                  <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0 mt-0.5">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-semibold block">
                      Instagram Stories & Looks
                    </span>
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-chocolate hover:text-gold-700 transition"
                    >
                      @yogitasbeautysalon &rarr;
                    </a>
                  </div>
                </div>

              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="gold-gradient-btn w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-gold"
                >
                  Book Instant Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map & Quick Message Form */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Google Map Card */}
            <div className="rounded-3xl overflow-hidden border border-gold-200/70 shadow-luxury h-64 sm:h-72 bg-blush-100 relative">
              <iframe
                title="Yogita's Beauty Parlour Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120615.82285810014!2d72.825833!3d19.082522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[30%] hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Quick Contact Form */}
            <div className="luxury-card rounded-3xl p-6 sm:p-8">
              <h3 className="font-editorial text-xl font-bold text-chocolate mb-1">
                Send a Direct Message
              </h3>
              <p className="text-xs text-chocolate/70 mb-4">
                We respond within 24 hours to all event inquiries and special requests.
              </p>

              {formSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>
                    Thank you, {name}! Your message has been sent to our salon team.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full luxury-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                        Email or Phone
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9876543210"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full luxury-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                      Message / Questions
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us what you have in mind..."
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      className="w-full luxury-input text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

