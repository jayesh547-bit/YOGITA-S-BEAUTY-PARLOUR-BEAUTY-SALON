"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  CheckCircle,
  XCircle,
  Check,
  Plus,
  Trash2,
  Edit2,
  Settings,
  Shield,
  LogOut,
  Sparkles,
  Lock,
  Database,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  AppointmentItem,
  ServiceItem,
  PackageItem,
  BeauticianItem,
  BusinessSettings,
  BlockedDateItem,
} from "@/lib/types";
import { SalonRepo, isSupabaseConfigured } from "@/lib/supabase";
import {
  formatDateReadable,
  formatTime12Hour,
  getKolkataCurrentDate,
} from "@/lib/booking-engine";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>("admin@yogitasbeauty.com");
  const [authPassword, setAuthPassword] = useState<string>("YogitaLuxury@2025");
  const [authError, setAuthError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "services" | "packages" | "beauticians" | "availability" | "settings"
  >("overview");

  // Core Data States
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [beauticians, setBeauticians] = useState<BeauticianItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDateItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  // Filters for Appointments
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Editing Modals / Forms
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState<boolean>(false);
  const [editingBeautician, setEditingBeautician] = useState<BeauticianItem | null>(null);
  const [isAddingBeautician, setIsAddingBeautician] = useState<boolean>(false);

  // New Block Date Form
  const [newBlockDate, setNewBlockDate] = useState<string>("");
  const [newBlockReason, setNewBlockReason] = useState<string>("");

  // Load Data
  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [apps, srvs, pkgs, btc, stg, blk] = await Promise.all([
        SalonRepo.getAppointments(),
        SalonRepo.getServices(),
        SalonRepo.getPackages(),
        SalonRepo.getBeauticians(),
        SalonRepo.getSettings(),
        SalonRepo.getBlockedDates(),
      ]);
      setAppointments(apps);
      setServices(srvs);
      setPackages(pkgs);
      setBeauticians(btc);
      setSettings(stg);
      setBlockedDates(blk);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check local session
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("yogita_admin_logged_in");
      if (session === "true") {
        setIsAuthenticated(true);
        refreshAllData();
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("yogita_admin_logged_in", "true");
      }
      refreshAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid credentials";
      setAuthError(errorMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("yogita_admin_logged_in");
    }
  };

  // Appointment Status Updater
  const handleUpdateStatus = async (
    id: string,
    newStatus: AppointmentItem["status"]
  ) => {
    const success = await SalonRepo.updateAppointmentStatus(id, newStatus);
    if (success) {
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      showFlash("Appointment status updated to " + newStatus);
    }
  };

  const showFlash = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchesSearch =
        searchQuery === "" ||
        app.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.customer_phone.includes(searchQuery) ||
        app.reference_no.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || app.status === statusFilter;

      const matchesDate = dateFilter === "" || app.appointment_date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchQuery, statusFilter, dateFilter]);

  // Metrics
  const todayStr = getKolkataCurrentDate();
  const metrics = useMemo(() => {
    const total = appointments.length;
    const today = appointments.filter((a) => a.appointment_date === todayStr).length;
    const pending = appointments.filter((a) => a.status === "PENDING").length;
    const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
    const completed = appointments.filter((a) => a.status === "COMPLETED").length;
    return { total, today, pending, confirmed, completed };
  }, [appointments, todayStr]);

  // --- SERVICE CRUD ---
  const handleSaveService = async (service: ServiceItem) => {
    let updated: ServiceItem[];
    if (services.some((s) => s.id === service.id)) {
      updated = services.map((s) => (s.id === service.id ? service : s));
    } else {
      updated = [service, ...services];
    }
    setServices(updated);
    await SalonRepo.saveServices(updated);
    setEditingService(null);
    setIsAddingService(false);
    showFlash("Service saved successfully!");
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    await SalonRepo.saveServices(updated);
    showFlash("Service removed.");
  };

  // --- BEAUTICIAN CRUD ---
  const handleSaveBeautician = async (btc: BeauticianItem) => {
    let updated: BeauticianItem[];
    if (beauticians.some((b) => b.id === btc.id)) {
      updated = beauticians.map((b) => (b.id === btc.id ? btc : b));
    } else {
      updated = [...beauticians, btc];
    }
    setBeauticians(updated);
    await SalonRepo.saveBeauticians(updated);
    setEditingBeautician(null);
    setIsAddingBeautician(false);
    showFlash("Beautician profile saved!");
  };

  const handleToggleBeauticianActive = async (id: string) => {
    const updated = beauticians.map((b) =>
      b.id === id ? { ...b, is_active: !b.is_active } : b
    );
    setBeauticians(updated);
    await SalonRepo.saveBeauticians(updated);
    showFlash("Beautician status updated.");
  };

  // --- PACKAGE PRICE / DURATION EDIT ---
  const handleUpdatePackage = async (pkg: PackageItem) => {
    const updated = packages.map((p) => (p.id === pkg.id ? pkg : p));
    setPackages(updated);
    await SalonRepo.savePackages(updated);
    showFlash("Package details updated!");
  };

  // --- AVAILABILITY / BLACKOUT DATES ---
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate || !newBlockReason) return;
    const newEntry: BlockedDateItem = {
      id: "blk_" + Date.now(),
      date: newBlockDate,
      reason: newBlockReason,
      is_full_day: true,
    };
    const updated = [newEntry, ...blockedDates];
    setBlockedDates(updated);
    await SalonRepo.saveBlockedDates(updated);
    setNewBlockDate("");
    setNewBlockReason("");
    showFlash("Blocked date registered.");
  };

  const handleDeleteBlockedDate = async (id: string) => {
    const updated = blockedDates.filter((b) => b.id !== id);
    setBlockedDates(updated);
    await SalonRepo.saveBlockedDates(updated);
    showFlash("Date unblocked.");
  };

  // --- SETTINGS SAVE ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await SalonRepo.saveSettings(settings);
    showFlash("Business settings saved successfully!");
  };

  // =========================================================================
  // VIEW: LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-ivory-200 via-blush-100 to-ivory-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gold-300/50 rounded-3xl p-8 shadow-luxury-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-400 to-blush-200 flex items-center justify-center text-chocolate mx-auto font-bold shadow-sm">
              <Lock className="w-5 h-5 text-chocolate" />
            </div>
            <h2 className="font-editorial text-2xl font-bold text-chocolate">
              Yogita&apos;s Salon Portal
            </h2>
            <p className="text-xs text-chocolate/70">
              Authorized Management & Appointment Dashboard
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-chocolate/80 font-bold mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full luxury-input text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-chocolate/80 font-bold mb-1">
                Master Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full luxury-input text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="gold-gradient-btn w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoggingIn ? "Authenticating..." : "Access Dashboard"}</span>
            </button>
          </form>

          {/* Demo Convenience Card */}
          <div className="p-3.5 bg-blush-50/80 border border-blush-200 rounded-xl text-[11px] space-y-1 text-chocolate/80">
            <p className="font-bold text-gold-700 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Administrator Access:</span>
            </p>
            <p>
              Email: <code className="bg-white px-1.5 py-0.5 rounded border border-blush-200">admin@yogitasbeauty.com</code>
            </p>
            <p>
              Password: <code className="bg-white px-1.5 py-0.5 rounded border border-blush-200">YogitaLuxury@2025</code>
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-chocolate/60 hover:text-gold-700 transition"
            >
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-ivory-50 text-chocolate flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="bg-chocolate text-ivory-100 border-b border-gold-400/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gold-400 text-chocolate flex items-center justify-center font-bold font-editorial">
            Y
          </div>
          <div>
            <h1 className="font-editorial text-lg font-bold text-ivory-100 leading-tight">
              Yogita&apos;s Salon Portal
            </h1>
            <div className="flex items-center space-x-2 text-[10px] text-ivory-100/70">
              <span className="flex items-center space-x-1">
                <Database className="w-3 h-3 text-gold-400" />
                <span>
                  Backend: {isSupabaseConfigured ? "Connected to Supabase" : "Active Demo Storage"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-ivory-100 font-medium flex items-center space-x-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={refreshAllData}
            title="Refresh database"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-ivory-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-900 text-xs text-red-200 font-medium flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Flash Alert */}
      {saveSuccessMsg && (
        <div className="bg-gold-500 text-chocolate font-bold text-xs py-2 px-6 text-center shadow-md animate-in fade-in duration-200 flex items-center justify-center space-x-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-blush-200">
          {[
            { id: "overview", label: "Dashboard Overview", icon: Sliders },
            { id: "appointments", label: "Appointments", icon: Calendar, badge: metrics.pending },
            { id: "services", label: "Services Menu", icon: Sparkles },
            { id: "packages", label: "Curated Packages", icon: DollarSign },
            { id: "beauticians", label: "Beauty Experts", icon: User },
            { id: "availability", label: "Availability & Blocks", icon: Clock },
            { id: "settings", label: "Business Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-chocolate text-ivory-100 shadow-md"
                    : "bg-white/80 border border-blush-200 text-chocolate/70 hover:border-gold-300 hover:text-chocolate"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="w-5 h-5 rounded-full bg-gold-400 text-chocolate text-[10px] flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW METRICS
        ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-blush-200 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-bold block mb-1">
                  Total Bookings
                </span>
                <span className="font-editorial text-3xl font-bold text-chocolate">
                  {metrics.total}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-blush-200 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-chocolate/60 font-bold block mb-1">
                  Today&apos;s Schedule
                </span>
                <span className="font-editorial text-3xl font-bold text-gold-600">
                  {metrics.today}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block mb-1">
                  Pending Review
                </span>
                <span className="font-editorial text-3xl font-bold text-amber-600">
                  {metrics.pending}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                  Confirmed
                </span>
                <span className="font-editorial text-3xl font-bold text-emerald-600">
                  {metrics.confirmed}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-blue-700 font-bold block mb-1">
                  Completed
                </span>
                <span className="font-editorial text-3xl font-bold text-blue-600">
                  {metrics.completed}
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="bg-white rounded-2xl border border-blush-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-editorial text-xl font-bold text-chocolate">
                  Latest Appointment Requests
                </h3>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="text-xs font-semibold text-gold-700 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="divide-y divide-blush-100">
                {appointments.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gold-700">
                          {app.reference_no}
                        </span>
                        <span className="font-semibold text-chocolate">
                          {app.customer_name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800"
                              : app.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : app.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-chocolate/70 mt-0.5">
                        {app.service_name} • With {app.beautician_name} • {formatDateReadable(app.appointment_date)} at {formatTime12Hour(app.appointment_time)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {app.status === "PENDING" && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, "CONFIRMED")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
                        >
                          Confirm
                        </button>
                      )}
                      {app.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, "COMPLETED")}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                        >
                          Mark Done
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${app.customer_phone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(app.customer_name)}, regarding your appointment at Yogita's Beauty Salon for ${encodeURIComponent(app.service_name)}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 font-medium rounded-lg"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: APPOINTMENT MANAGEMENT
        ========================================================================= */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-blush-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search name, phone, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full luxury-input pl-9 text-xs"
                />
                <Search className="w-4 h-4 text-chocolate/50 absolute left-3 top-3" />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="luxury-input text-xs"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter("")}
                    className="text-xs text-chocolate/60 hover:text-chocolate px-2"
                  >
                    Clear Date
                  </button>
                )}

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="luxury-input text-xs font-medium"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Appointments List / Table */}
            <div className="bg-white rounded-2xl border border-blush-200 overflow-hidden shadow-sm">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-xs text-chocolate/60">
                  No appointments match your filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-blush-50/70 border-b border-blush-200 text-chocolate/70 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Reference</th>
                        <th className="p-4">Guest Details</th>
                        <th className="p-4">Service & Expert</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blush-100">
                      {filteredAppointments.map((app) => (
                        <tr key={app.id} className="hover:bg-blush-50/30 transition">
                          <td className="p-4 font-mono font-bold text-gold-700">
                            {app.reference_no}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-chocolate">
                              {app.customer_name}
                            </div>
                            <div className="text-chocolate/60 flex items-center space-x-1 mt-0.5">
                              <Phone className="w-3 h-3 text-gold-600" />
                              <span>{app.customer_phone}</span>
                            </div>
                            {app.special_requests && (
                              <div className="text-[11px] text-amber-700 italic mt-1 bg-amber-50 p-1 rounded max-w-xs">
                                Note: {app.special_requests}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-chocolate">
                              {app.service_name}
                            </div>
                            <div className="text-chocolate/60">
                              By {app.beautician_name} ({app.duration_minutes}m)
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-chocolate">
                              {formatDateReadable(app.appointment_date)}
                            </div>
                            <div className="text-gold-700 font-bold">
                              {formatTime12Hour(app.appointment_time)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                app.status === "CONFIRMED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : app.status === "PENDING"
                                  ? "bg-amber-100 text-amber-800"
                                  : app.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            {app.status !== "CONFIRMED" && app.status !== "COMPLETED" && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, "CONFIRMED")}
                                title="Confirm Appointment"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            {app.status === "CONFIRMED" && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, "COMPLETED")}
                                title="Mark Completed"
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {app.status !== "REJECTED" && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                title="Reject Booking"
                                className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SERVICES MANAGEMENT
        ========================================================================= */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-chocolate">
                  Manage Salon Services
                </h3>
                <p className="text-xs text-chocolate/70">
                  Configure real-time service names, durations, categories, starting prices, and imagery.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    id: "srv_" + Date.now(),
                    name: "",
                    category: "Hair",
                    description: "",
                    price: 1000,
                    duration_minutes: 45,
                    image_url:
                      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
                    is_featured: false,
                  });
                  setIsAddingService(true);
                }}
                className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-blush-200 overflow-hidden shadow-sm p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase tracking-wider text-gold-600 font-bold bg-blush-100/60 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                      <span className="font-editorial text-xl font-bold text-chocolate">
                        ₹{srv.price}
                      </span>
                    </div>

                    <h4 className="font-editorial text-lg font-bold text-chocolate">
                      {srv.name}
                    </h4>

                    <p className="text-xs text-chocolate/70 line-clamp-2">
                      {srv.description}
                    </p>

                    <div className="text-[11px] text-chocolate/60 flex items-center space-x-1 pt-1">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      <span>{srv.duration_minutes} Minutes Duration</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blush-100 flex items-center justify-between">
                    <button
                      onClick={() => setEditingService(srv)}
                      className="text-xs font-semibold text-chocolate/80 hover:text-gold-700 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Edit Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chocolate-deep/70 backdrop-blur-sm">
                <div className="bg-ivory-100 rounded-2xl max-w-lg w-full border border-gold-300 p-6 space-y-4 shadow-luxury-lg animate-in fade-in">
                  <h3 className="font-editorial text-2xl font-bold text-chocolate">
                    {isAddingService ? "Add New Service" : "Edit Service"}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({ ...editingService, name: e.target.value })
                        }
                        className="w-full luxury-input text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                          Category
                        </label>
                        <select
                          value={editingService.category}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              category: e.target.value as ServiceItem["category"],
                            })
                          }
                          className="w-full luxury-input text-xs"
                        >
                          <option value="Hair">Hair</option>
                          <option value="Skin & Facial">Skin & Facial</option>
                          <option value="Bridal & Makeup">Bridal & Makeup</option>
                          <option value="Nails & Care">Nails & Care</option>
                          <option value="Spa & Wellness">Spa & Wellness</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editingService.price}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full luxury-input text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        step={15}
                        value={editingService.duration_minutes}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            duration_minutes: Number(e.target.value),
                          })
                        }
                        className="w-full luxury-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            description: e.target.value,
                          })
                        }
                        className="w-full luxury-input text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={editingService.image_url}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            image_url: e.target.value,
                          })
                        }
                        className="w-full luxury-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-chocolate hover:bg-blush-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveService(editingService)}
                      className="gold-gradient-btn px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: PACKAGES MANAGEMENT
        ========================================================================= */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-chocolate">
                Configure Premium Packages
              </h3>
              <p className="text-xs text-chocolate/70">
                Update prices, duration, and package services for Everyday Glow, Premium Self-Care, Bridal Beauty, and Complete Makeover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-blush-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-600 font-bold">
                        {pkg.tagline}
                      </span>
                      <h4 className="font-editorial text-xl font-bold text-chocolate">
                        {pkg.name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-chocolate/60">₹</span>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) =>
                          handleUpdatePackage({ ...pkg, price: Number(e.target.value) })
                        }
                        className="w-24 text-right font-bold text-lg border border-blush-200 rounded px-2 py-0.5"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-chocolate/70">{pkg.description}</p>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-chocolate/60">Duration (mins):</span>
                    <input
                      type="number"
                      step={15}
                      value={pkg.duration_minutes}
                      onChange={(e) =>
                        handleUpdatePackage({
                          ...pkg,
                          duration_minutes: Number(e.target.value),
                        })
                      }
                      className="w-20 border border-blush-200 rounded px-2 py-0.5 text-xs font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: BEAUTICIAN MANAGEMENT
        ========================================================================= */}
        {activeTab === "beauticians" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-chocolate">
                  Beautician & Expert Profiles
                </h3>
                <p className="text-xs text-chocolate/70">
                  Manage specialist bios, active roster availability, and photo portraits.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingBeautician({
                    id: "btc_" + Date.now(),
                    name: "",
                    specialization: "Beauty Specialist",
                    experience: "3+ Years",
                    bio: "",
                    image_url:
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
                    is_active: true,
                  });
                  setIsAddingBeautician(true);
                }}
                className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Beautician</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {beauticians.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-blush-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gold-300 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.image_url}
                        alt={b.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-editorial text-lg font-bold text-chocolate">
                        {b.name}
                      </h4>
                      <p className="text-xs text-gold-600 font-medium">
                        {b.specialization}
                      </p>
                      <span className="text-[10px] text-chocolate/50">
                        {b.experience}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-chocolate/75 line-clamp-3">{b.bio}</p>

                  <div className="pt-3 border-t border-blush-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleBeauticianActive(b.id)}
                      className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                        b.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.is_active ? "Active" : "Inactive"}
                    </button>

                    <button
                      onClick={() => setEditingBeautician(b)}
                      className="font-semibold text-chocolate/80 hover:text-gold-700 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Beautician Edit Modal */}
            {editingBeautician && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chocolate-deep/70 backdrop-blur-sm">
                <div className="bg-ivory-100 rounded-2xl max-w-lg w-full border border-gold-300 p-6 space-y-4 shadow-luxury-lg animate-in fade-in">
                  <h3 className="font-editorial text-2xl font-bold text-chocolate">
                    {isAddingBeautician ? "Add Beauty Expert" : "Edit Profile"}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editingBeautician.name}
                        onChange={(e) =>
                          setEditingBeautician({
                            ...editingBeautician,
                            name: e.target.value,
                          })
                        }
                        className="w-full luxury-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Specialization Title
                      </label>
                      <input
                        type="text"
                        value={editingBeautician.specialization}
                        onChange={(e) =>
                          setEditingBeautician({
                            ...editingBeautician,
                            specialization: e.target.value,
                          })
                        }
                        className="w-full luxury-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={editingBeautician.experience}
                        onChange={(e) =>
                          setEditingBeautician({
                            ...editingBeautician,
                            experience: e.target.value,
                          })
                        }
                        className="w-full luxury-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Biography
                      </label>
                      <textarea
                        rows={3}
                        value={editingBeautician.bio}
                        onChange={(e) =>
                          setEditingBeautician({
                            ...editingBeautician,
                            bio: e.target.value,
                          })
                        }
                        className="w-full luxury-input resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Portrait Image URL
                      </label>
                      <input
                        type="url"
                        value={editingBeautician.image_url}
                        onChange={(e) =>
                          setEditingBeautician({
                            ...editingBeautician,
                            image_url: e.target.value,
                          })
                        }
                        className="w-full luxury-input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingBeautician(null);
                        setIsAddingBeautician(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-chocolate hover:bg-blush-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveBeautician(editingBeautician)}
                      className="gold-gradient-btn px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 6: AVAILABILITY & BLACKOUT DATES
        ========================================================================= */}
        {activeTab === "availability" && settings && (
          <div className="space-y-8">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-chocolate">
                Availability & Calendar Management
              </h3>
              <p className="text-xs text-chocolate/70">
                Configure salon business hours, appointment slot increments, and block dates for holidays or private events.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Working Hours Config */}
              <div className="bg-white rounded-2xl border border-blush-200 p-6 shadow-sm space-y-4">
                <h4 className="font-editorial text-lg font-bold text-chocolate">
                  Daily Business Hours (Asia/Kolkata)
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={settings.open_time}
                      onChange={(e) =>
                        setSettings({ ...settings, open_time: e.target.value })
                      }
                      className="w-full luxury-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={settings.close_time}
                      onChange={(e) =>
                        setSettings({ ...settings, close_time: e.target.value })
                      }
                      className="w-full luxury-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                    Slot Step Interval (Minutes)
                  </label>
                  <select
                    value={settings.slot_interval_minutes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        slot_interval_minutes: Number(e.target.value),
                      })
                    }
                    className="w-full luxury-input text-xs font-medium"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes (Recommended)</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Update Hours
                </button>
              </div>

              {/* Block Date Tool */}
              <div className="bg-white rounded-2xl border border-blush-200 p-6 shadow-sm space-y-4">
                <h4 className="font-editorial text-lg font-bold text-chocolate">
                  Block a Specific Date
                </h4>

                <form onSubmit={handleAddBlockedDate} className="space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Date to Block
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="w-full luxury-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Reason
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Festival Holiday, Maintenance, Private Event"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      className="w-full luxury-input text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Blackout Date</span>
                  </button>
                </form>

                {/* List of Blocked Dates */}
                <div className="pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-chocolate/80 mb-2">
                    Active Blackout Dates
                  </h5>
                  {blockedDates.length === 0 ? (
                    <p className="text-xs text-chocolate/50 italic">
                      No dates are currently blocked.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {blockedDates.map((b) => (
                        <div
                          key={b.id}
                          className="flex justify-between items-center text-xs p-2.5 bg-blush-50 rounded-lg border border-blush-200"
                        >
                          <div>
                            <span className="font-bold text-chocolate">{b.date}</span>:{" "}
                            <span className="text-chocolate/70">{b.reason}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteBlockedDate(b.id)}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: BUSINESS SETTINGS & SUPABASE CONFIG
        ========================================================================= */}
        {activeTab === "settings" && settings && (
          <div className="space-y-8">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-chocolate">
                Salon Configuration & Supabase Status
              </h3>
              <p className="text-xs text-chocolate/70">
                Customize contact numbers, address, Instagram profile, and review backend connectivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Settings Form */}
              <div className="md:col-span-8 bg-white rounded-2xl border border-blush-200 p-6 shadow-sm">
                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Salon Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.salon_name}
                      onChange={(e) =>
                        setSettings({ ...settings, salon_name: e.target.value })
                      }
                      className="w-full luxury-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.tagline}
                      onChange={(e) =>
                        setSettings({ ...settings, tagline: e.target.value })
                      }
                      className="w-full luxury-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        Phone Number (Display)
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.phone}
                        onChange={(e) =>
                          setSettings({ ...settings, phone: e.target.value })
                        }
                        className="w-full luxury-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                        WhatsApp Number (digits with country code, e.g. 919876543210)
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.whatsapp_number}
                        onChange={(e) =>
                          setSettings({ ...settings, whatsapp_number: e.target.value })
                        }
                        className="w-full luxury-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      className="w-full luxury-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Full Salon Address
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.address}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                      className="w-full luxury-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Opening Hours (Display string)
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.opening_hours}
                      onChange={(e) =>
                        setSettings({ ...settings, opening_hours: e.target.value })
                      }
                      className="w-full luxury-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-chocolate/70 font-bold mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={settings.instagram_url}
                      onChange={(e) =>
                        setSettings({ ...settings, instagram_url: e.target.value })
                      }
                      className="w-full luxury-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Save All Settings
                  </button>
                </form>
              </div>

              {/* Backend & Deployment Status */}
              <div className="md:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-blush-200 p-5 shadow-sm space-y-3">
                  <h4 className="font-editorial text-base font-bold text-chocolate flex items-center space-x-2">
                    <Database className="w-4 h-4 text-gold-600" />
                    <span>Database Status</span>
                  </h4>

                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      isSupabaseConfigured
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold mb-1">
                      {isSupabaseConfigured ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Supabase Live Sync Active</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Local Demo Persistence Active</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {isSupabaseConfigured
                        ? "Appointments, services, and schedules are synced in real-time with your PostgreSQL Supabase cluster."
                        : "Supabase credentials are not yet entered in .env.local. The application is running on its built-in persistent storage and repository fallback."}
                    </p>
                  </div>

                  <div className="text-[11px] text-chocolate/70 space-y-1">
                    <p className="font-bold text-chocolate">To connect your Supabase:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-chocolate/60">
                      <li>Copy <code className="bg-blush-100 px-1 py-0.5 rounded">.env.example</code> to <code className="bg-blush-100 px-1 py-0.5 rounded">.env.local</code></li>
                      <li>Run <code className="bg-blush-100 px-1 py-0.5 rounded">supabase/schema.sql</code> in SQL Editor</li>
                      <li>Paste Project URL and anon key</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

