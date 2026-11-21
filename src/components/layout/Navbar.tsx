"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, Calendar, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Packages", href: "#packages" },
    { label: "Gallery", href: "#gallery" },
    { label: "Our Experts", href: "#experts" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Top Banner: Exclusive Girls-Only Notice */}
      <div className="bg-chocolate text-ivory-100 text-[11px] py-1.5 px-4 text-center font-medium tracking-widest uppercase flex items-center justify-center space-x-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gold-400 inline" />
        <span>Exclusive Girls-Only & Women-Only Luxury Sanctuary</span>
        <span className="hidden sm:inline text-gold-400">•</span>
        <span className="hidden sm:inline text-gold-300">"Your Beauty, Our Passion."</span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-luxury border-b border-gold-200/50 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="#hero" className="group flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-400 to-blush-200 flex items-center justify-center text-chocolate shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-editorial text-lg font-bold">Y</span>
            </div>
            <div>
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-chocolate block leading-none">
                YOGITA&apos;S
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold-600 font-semibold block mt-0.5">
                Beauty Parlour & Salon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold tracking-wider uppercase text-chocolate/80 hover:text-gold-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-gold-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs: Book Appointment & Admin Shortcut */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider text-chocolate/60 hover:text-gold-600 font-semibold transition px-2 py-1"
            >
              Admin
            </Link>
            <button
              onClick={onOpenBooking}
              className="gold-gradient-btn inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="gold-gradient-btn px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider sm:hidden"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-chocolate hover:text-gold-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-blush-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold uppercase tracking-wider text-chocolate hover:text-gold-600 py-2 border-b border-blush-100"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Appointment Now</span>
              </button>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-chocolate/70 hover:text-chocolate font-medium py-1"
              >
                Salon Owner / Admin Login &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

