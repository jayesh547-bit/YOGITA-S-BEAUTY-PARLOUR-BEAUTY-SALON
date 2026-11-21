import { createClient } from "@supabase/supabase-js";
import {
  AppointmentItem,
  ServiceItem,
  PackageItem,
  BeauticianItem,
  BusinessSettings,
  BlockedDateItem,
} from "./types";
import {
  initialServices,
  initialPackages,
  initialBeauticians,
  initialBusinessSettings,
} from "./data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project.supabase.co")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Storage keys for fallback client persistence
 */
const STORAGE_KEYS = {
  APPOINTMENTS: "yogitas_appointments_v1",
  SERVICES: "yogitas_services_v1",
  PACKAGES: "yogitas_packages_v1",
  BEAUTICIANS: "yogitas_beauticians_v1",
  SETTINGS: "yogitas_settings_v1",
  BLOCKED: "yogitas_blocked_dates_v1",
};

/**
 * Initial sample appointments
 */
const initialSampleAppointments: AppointmentItem[] = [
  {
    id: "app-101",
    reference_no: "YOG-2025-8491",
    customer_name: "Sneha Kapoor",
    customer_phone: "+91 98201 12345",
    customer_email: "sneha.k@example.com",
    service_id: "bridal-makeup",
    service_name: "Bridal Makeup",
    service_type: "service",
    beautician_id: "pooja-bridal",
    beautician_name: "Pooja",
    appointment_date: "2026-11-04",
    appointment_time: "11:00",
    duration_minutes: 150,
    status: "CONFIRMED",
    special_requests: "Airbrush finish requested for sangeet ceremony.",
    created_at: new Date().toISOString(),
  },
  {
    id: "app-102",
    reference_no: "YOG-2025-3312",
    customer_name: "Meera Nair",
    customer_phone: "+91 98190 67890",
    customer_email: "meera.n@example.com",
    service_id: "everyday-glow",
    service_name: "Everyday Glow",
    service_type: "package",
    beautician_id: "yogita-lead",
    beautician_name: "Yogita",
    appointment_date: "2026-11-04",
    appointment_time: "15:00",
    duration_minutes: 90,
    status: "PENDING",
    special_requests: "First-time visitor. Sensitive skin care required.",
    created_at: new Date().toISOString(),
  },
];

// Server-side in-memory cache for stateful API routes during demo / local testing
let serverAppointments = [...initialSampleAppointments];
let serverServices = [...initialServices];
let serverPackages = [...initialPackages];
let serverBeauticians = [...initialBeauticians];
let serverSettings: BusinessSettings = { ...initialBusinessSettings };
let serverBlockedDates: BlockedDateItem[] = [];

/**
 * Repository Service Layer that transparently switches between Supabase (when configured)
 * and Local Persisted State (when unconfigured or offline).
 */
export const SalonRepo = {
  // --- APPOINTMENTS ---
  async getAppointments(): Promise<AppointmentItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data as AppointmentItem[];
      } catch (e) {
        console.warn("Supabase fetch appointments failed, using local store:", e);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return serverAppointments;
  },

  async saveAppointment(appointment: AppointmentItem): Promise<{ success: boolean; data?: AppointmentItem; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .insert([appointment])
          .select()
          .single();
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, data: data as AppointmentItem };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Database error";
        return { success: false, error: errorMsg };
      }
    }

    // Server-side memory storage
    serverAppointments = [appointment, ...serverAppointments];

    // Client-side local storage
    if (typeof window !== "undefined") {
      const current = await this.getAppointments();
      const updated = [appointment, ...current.filter((a) => a.id !== appointment.id)];
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    }
    return { success: true, data: appointment };
  },

  async updateAppointmentStatus(id: string, status: AppointmentItem["status"]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("appointments")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (!error) return true;
      } catch (e) {
        console.warn("Supabase update failed:", e);
      }
    }

    serverAppointments = serverAppointments.map((a) =>
      a.id === id ? { ...a, status } : a
    );

    if (typeof window !== "undefined") {
      const current = await this.getAppointments();
      const updated = current.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    }
    return true;
  },

  // --- SERVICES ---
  async getServices(): Promise<ServiceItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("services").select("*");
        if (!error && data && data.length > 0) return data as ServiceItem[];
      } catch {}
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return serverServices;
  },

  async saveServices(services: ServiceItem[]): Promise<void> {
    serverServices = services;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("services").upsert(services);
      } catch {}
    }
  },

  // --- PACKAGES ---
  async getPackages(): Promise<PackageItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("packages").select("*");
        if (!error && data && data.length > 0) return data as PackageItem[];
      } catch {}
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return serverPackages;
  },

  async savePackages(packages: PackageItem[]): Promise<void> {
    serverPackages = packages;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("packages").upsert(packages);
      } catch {}
    }
  },

  // --- BEAUTICIANS ---
  async getBeauticians(): Promise<BeauticianItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("beauticians").select("*");
        if (!error && data && data.length > 0) return data as BeauticianItem[];
      } catch {}
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.BEAUTICIANS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return serverBeauticians;
  },

  async saveBeauticians(beauticians: BeauticianItem[]): Promise<void> {
    serverBeauticians = beauticians;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.BEAUTICIANS, JSON.stringify(beauticians));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("beauticians").upsert(beauticians);
      } catch {}
    }
  },

  // --- BUSINESS SETTINGS ---
  async getSettings(): Promise<BusinessSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("business_settings")
          .select("*")
          .eq("id", 1)
          .single();
        if (!error && data) return data as BusinessSettings;
      } catch {}
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return serverSettings;
  },

  async saveSettings(settings: BusinessSettings): Promise<void> {
    serverSettings = settings;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("business_settings")
          .upsert({ ...settings, id: 1, updated_at: new Date().toISOString() });
      } catch {}
    }
  },

  // --- BLOCKED DATES ---
  async getBlockedDates(): Promise<BlockedDateItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("blocked_dates").select("*");
        if (!error && data) return data as BlockedDateItem[];
      } catch {}
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.BLOCKED);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return serverBlockedDates;
  },

  async saveBlockedDates(blocked: BlockedDateItem[]): Promise<void> {
    serverBlockedDates = blocked;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blocked));
    }
  },
};
