"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  ServiceItem,
  PackageItem,
  BeauticianItem,
  AppointmentItem,
  BusinessSettings,
} from "@/lib/types";
import {
  formatDateReadable,
  formatTime12Hour,
  getKolkataCurrentDate,
  getAvailableSlots,
} from "@/lib/booking-engine";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceItem | PackageItem | null;
  preselectedBeauticianId?: string | null;
  services: ServiceItem[];
  packages: PackageItem[];
  beauticians: BeauticianItem[];
  settings: BusinessSettings;
  existingAppointments: AppointmentItem[];
  onBookingCreated?: (newBooking: AppointmentItem) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedService,
  preselectedBeauticianId,
  services,
  packages,
  beauticians,
  settings,
  existingAppointments,
  onBookingCreated,
}: BookingModalProps) {
  // Steps: 1 = Service, 2 = Beautician, 3 = Date & Time, 4 = Customer Details, 5 = Confirmation
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedType, setSelectedType] = useState<"service" | "package">("service");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedBeauticianId, setSelectedBeauticianId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentItem | null>(null);

  // Active category filter in Step 1
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setServerError("");
      setConfirmedBooking(null);

      // Default date to tomorrow in Kolkata timezone
      const today = getKolkataCurrentDate();
      const [y, m, d] = today.split("-").map(Number);
      const tomorrow = new Date(y, m - 1, d + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      setSelectedDate(tomorrowStr);
      setSelectedTime("");

      if (preselectedService) {
        const isPkg = "included_services" in preselectedService;
        setSelectedType(isPkg ? "package" : "service");
        setSelectedItemId(preselectedService.id);
        setStep(2); // Advance directly to beautician selection
      } else {
        setSelectedItemId(services[0]?.id || "");
      }

      if (preselectedBeauticianId) {
        setSelectedBeauticianId(preselectedBeauticianId);
      }
    }
  }, [isOpen, preselectedService, preselectedBeauticianId, services]);

  // Current selected service / package object
  const currentSelection = useMemo(() => {
    if (selectedType === "package") {
      return packages.find((p) => p.id === selectedItemId);
    }
    return services.find((s) => s.id === selectedItemId);
  }, [selectedType, selectedItemId, packages, services]);

  // Current beautician object
  const currentBeautician = useMemo(() => {
    if (selectedBeauticianId === "any") {
      return { id: "any", name: "Any Available Beautician", specialization: "Salon Team" };
    }
    return beauticians.find((b) => b.id === selectedBeauticianId);
  }, [selectedBeauticianId, beauticians]);

  // Available Time Slots based on Date, Beautician, and Duration
  const availableSlots = useMemo(() => {
    if (!selectedDate || !currentSelection) return [];
    return getAvailableSlots({
      date: selectedDate,
      durationMinutes: currentSelection.duration_minutes || 45,
      beauticianId: selectedBeauticianId,
      existingAppointments,
      openTime: settings.open_time || "10:00",
      closeTime: settings.close_time || "20:30",
      slotIntervalMinutes: settings.slot_interval_minutes || 30,
    });
  }, [selectedDate, currentSelection, selectedBeauticianId, existingAppointments, settings]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleSubmitBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setServerError("Please enter your full name and contact phone number.");
      return;
    }

    if (customerPhone.replace(/\D/g, "").length < 10) {
      setServerError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        service_id: currentSelection?.id,
        service_name: currentSelection?.name,
        service_type: selectedType,
        beautician_id: selectedBeauticianId,
        beautician_name: currentBeautician?.name || "Any Available Beautician",
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        duration_minutes: currentSelection?.duration_minutes || 45,
        special_requests: specialRequests,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to confirm booking. Please try another slot.");
      }

      setConfirmedBooking(data.appointment);
      if (onBookingCreated) {
        onBookingCreated(data.appointment);
      }
      setStep(5);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C5A46D", "#F4DDE2", "#D9B7AE", "#382B2B"],
        });
      } catch {}
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error reserving appointment. Please try again.";
      setServerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Connect Builder
  const getWhatsAppBookingLink = () => {
    if (!confirmedBooking) return "#";
    const msg = `Hello Yogita's Beauty Salon! ✨%0A%0AI have requested an appointment on your website:%0A%0A*Reference:* ${confirmedBooking.reference_no}%0A*Name:* ${confirmedBooking.customer_name}%0A*Service:* ${confirmedBooking.service_name}%0A*Beautician:* ${confirmedBooking.beautician_name}%0A*Date:* ${formatDateReadable(confirmedBooking.appointment_date)}%0A*Time:* ${formatTime12Hour(confirmedBooking.appointment_time)}%0A%0APlease confirm my appointment availability. Thank you!`;
    return `https://wa.me/${settings.whatsapp_number}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-chocolate-deep/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-ivory-100 border border-gold-300/40 rounded-2xl shadow-luxury-lg overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="bg-blush-100/70 border-b border-blush-200/80 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest text-gold-600 font-semibold">
                Women-Only Sanctuary
              </span>
              <span className="h-1 w-1 rounded-full bg-gold-400" />
              <span className="text-xs text-chocolate/70">Step {step} of 5</span>
            </div>
            <h2 className="font-editorial text-2xl text-chocolate font-semibold">
              {step === 1 && "Choose Your Ritual"}
              {step === 2 && "Select Your Expert"}
              {step === 3 && "Select Date & Time"}
              {step === 4 && "Guest Details"}
              {step === 5 && "Appointment Confirmed"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-blush-200/50 text-chocolate/70 hover:text-chocolate transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-blush-200/40 h-1">
          <div
            className="bg-gold-400 h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* ================= STEP 1: SELECT SERVICE / PACKAGE ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex bg-blush-100/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedType("service")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedType === "service"
                      ? "bg-white text-chocolate shadow-sm"
                      : "text-chocolate/70 hover:text-chocolate"
                  }`}
                >
                  Individual Services
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("package")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedType === "package"
                      ? "bg-white text-chocolate shadow-sm"
                      : "text-chocolate/70 hover:text-chocolate"
                  }`}
                >
                  Curated Packages
                </button>
              </div>

              {selectedType === "service" ? (
                <>
                  <div className="flex flex-wrap gap-2 pt-1 pb-2">
                    {["All", "Hair", "Skin & Facial", "Bridal & Makeup", "Nails & Care", "Spa & Wellness"].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1 text-xs rounded-full border transition-all ${
                            activeCategory === cat
                              ? "bg-gold-400 text-white border-gold-400 shadow-sm"
                              : "border-blush-200 bg-white/70 text-chocolate/80 hover:border-gold-300"
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services
                      .filter((s) => activeCategory === "All" || s.category === activeCategory)
                      .map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedItemId(srv.id)}
                          className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all ${
                            selectedItemId === srv.id
                              ? "border-gold-400 bg-gold-50/50 ring-2 ring-gold-300/40"
                              : "border-blush-200 bg-white/60 hover:border-gold-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-chocolate text-sm">{srv.name}</h4>
                            <span className="text-gold-600 font-bold text-sm">₹{srv.price}</span>
                          </div>
                          <p className="text-xs text-chocolate/70 line-clamp-2 mt-1">
                            {srv.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 text-[11px] text-chocolate/60">
                            <Clock className="w-3 h-3 text-gold-500" />
                            <span>{srv.duration_minutes} mins</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedItemId(pkg.id)}
                      className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                        selectedItemId === pkg.id
                          ? "border-gold-400 bg-gold-50/50 ring-2 ring-gold-300/40"
                          : "border-blush-200 bg-white/60 hover:border-gold-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gold-600 font-bold">
                            {pkg.tagline}
                          </span>
                          <h4 className="font-semibold text-chocolate text-base">{pkg.name}</h4>
                        </div>
                        <span className="text-gold-600 font-bold text-base">₹{pkg.price}</span>
                      </div>
                      <p className="text-xs text-chocolate/70 mt-1 line-clamp-2">
                        {pkg.description}
                      </p>
                      <div className="mt-2 text-[11px] text-chocolate/60 flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-gold-500" />
                        <span>{pkg.duration_minutes} mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: SELECT BEAUTICIAN ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-chocolate/70">
                Choose a dedicated specialist or select Any Available Beautician for the quickest availability.
              </p>

              <div
                onClick={() => setSelectedBeauticianId("any")}
                className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                  selectedBeauticianId === "any"
                    ? "border-gold-400 bg-gold-50/60 ring-2 ring-gold-300/40"
                    : "border-blush-200 bg-white/60 hover:border-gold-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blush-200 flex items-center justify-center text-gold-600 font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-chocolate text-sm">
                      Any Available Beautician
                    </h4>
                    <p className="text-xs text-chocolate/60">
                      We will assign our best expert available for your slot.
                    </p>
                  </div>
                </div>
                {selectedBeauticianId === "any" && (
                  <CheckCircle2 className="w-5 h-5 text-gold-500" />
                )}
              </div>

              {beauticians
                .filter((b) => b.is_active)
                .map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBeauticianId(b.id)}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                      selectedBeauticianId === b.id
                        ? "border-gold-400 bg-gold-50/60 ring-2 ring-gold-300/40"
                        : "border-blush-200 bg-white/60 hover:border-gold-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-300/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.image_url}
                          alt={b.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-chocolate text-sm">{b.name}</h4>
                        <p className="text-xs text-gold-600 font-medium">{b.specialization}</p>
                        <p className="text-[11px] text-chocolate/60 line-clamp-1">{b.experience}</p>
                      </div>
                    </div>
                    {selectedBeauticianId === b.id && (
                      <CheckCircle2 className="w-5 h-5 text-gold-500" />
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* ================= STEP 3: SELECT DATE & TIME ================= */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-chocolate/70 font-semibold mb-2">
                  Select Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={getKolkataCurrentDate()}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="w-full luxury-input font-medium"
                  />
                  <Calendar className="w-4 h-4 text-gold-600 absolute right-4 top-3.5 pointer-events-none" />
                </div>
                {selectedDate && (
                  <p className="text-xs text-gold-600 font-medium mt-1.5">
                    {formatDateReadable(selectedDate)}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-chocolate/70 font-semibold">
                    Available Time Slots (Asia/Kolkata)
                  </label>
                  <span className="text-[11px] text-chocolate/60">
                    Duration: {currentSelection?.duration_minutes} mins
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-4 bg-blush-50 rounded-xl text-center text-xs text-chocolate/70">
                    No available slots for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          title={slot.conflictReason}
                          className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                            !slot.available
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-gold-400 text-white border-gold-400 shadow-sm"
                              : "bg-white/80 border-blush-200 text-chocolate hover:border-gold-300"
                          }`}
                        >
                          {formatTime12Hour(slot.time)}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-[11px] text-chocolate/60 mt-3">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-400 inline-block" />
                    <span>Selected</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-blush-300 inline-block" />
                    <span>Available</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                    <span>Unavailable / Booked</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: CUSTOMER DETAILS ================= */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-blush-100/60 p-3.5 rounded-xl border border-blush-200 text-xs space-y-1">
                <div className="flex justify-between text-chocolate font-semibold">
                  <span>{currentSelection?.name}</span>
                  <span className="text-gold-600">₹{currentSelection?.price}</span>
                </div>
                <div className="text-chocolate/70">
                  With: <span className="font-medium text-chocolate">{currentBeautician?.name}</span>
                </div>
                <div className="text-chocolate/70">
                  On:{" "}
                  <span className="font-medium text-chocolate">
                    {formatDateReadable(selectedDate)} at {formatTime12Hour(selectedTime)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full luxury-input pl-10"
                  />
                  <User className="w-4 h-4 text-gold-600 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                  Mobile / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full luxury-input pl-10"
                  />
                  <Phone className="w-4 h-4 text-gold-600 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full luxury-input"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-chocolate/70 font-semibold mb-1">
                  Special Notes or Skin Sensitivities (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. skin allergies, preferred style, event date..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full luxury-input resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-chocolate/70 pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>
                  <strong>Payment Notice:</strong> No advance online payment required. Payment can be made directly at the salon during your visit.
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 5: CONFIRMATION SUCCESS ================= */}
          {step === 5 && confirmedBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-100 border border-gold-300 text-gold-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 text-xs font-bold uppercase tracking-widest rounded-full mb-1">
                  Status: PENDING CONFIRMATION
                </span>
                <h3 className="font-editorial text-2xl text-chocolate font-semibold">
                  Your Booking Request is Saved!
                </h3>
                <p className="text-xs text-chocolate/70 max-w-md mx-auto mt-1">
                  We have successfully registered your appointment request in our system. Our team will verify your slot shortly.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="bg-white/80 border border-gold-200/80 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto shadow-sm">
                <div className="flex justify-between border-b border-blush-200 pb-2">
                  <span className="text-chocolate/60">Booking Reference</span>
                  <span className="font-mono font-bold text-gold-700 text-sm">
                    {confirmedBooking.reference_no}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Guest Name</span>
                  <span className="font-medium text-chocolate">{confirmedBooking.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Service</span>
                  <span className="font-medium text-chocolate">{confirmedBooking.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Beautician</span>
                  <span className="font-medium text-chocolate">{confirmedBooking.beautician_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-chocolate/60">Date & Time</span>
                  <span className="font-medium text-chocolate">
                    {formatDateReadable(confirmedBooking.appointment_date)} at{" "}
                    {formatTime12Hour(confirmedBooking.appointment_time)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-blush-200 pt-2 text-gold-700 font-semibold">
                  <span>Payment Strategy</span>
                  <span>Pay directly at Salon</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={getWhatsAppBookingLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Salon via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-chocolate/20 text-chocolate hover:bg-white text-xs font-medium transition-all"
                >
                  Close & Return to Salon
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-blush-50/70 border-t border-blush-200/80 px-6 py-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-chocolate/80 hover:text-chocolate px-3 py-2 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedItemId) ||
                  (step === 3 && (!selectedDate || !selectedTime))
                }
                onClick={() => setStep(step + 1)}
                className="gold-gradient-btn inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="gold-gradient-btn inline-flex items-center space-x-2 px-7 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? "Saving Booking..." : "Confirm Appointment"}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

