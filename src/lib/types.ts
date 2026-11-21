export type ServiceCategory =
  | "Hair"
  | "Skin & Facial"
  | "Bridal & Makeup"
  | "Nails & Care"
  | "Spa & Wellness";

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  is_featured?: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  included_services: string[];
  price: number;
  duration_minutes: number;
  is_popular?: boolean;
  image_url: string;
}

export interface BeauticianItem {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  bio: string;
  image_url: string;
  is_active: boolean;
}

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface AppointmentItem {
  id: string;
  reference_no: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_id: string;
  service_name: string;
  service_type: "service" | "package";
  beautician_id: string;
  beautician_name: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:mm (24-hour)
  duration_minutes: number;
  status: AppointmentStatus;
  special_requests?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | "Salon Interior"
    | "Bridal Makeup"
    | "Party Makeup"
    | "Hair Styling"
    | "Nail Art"
    | "Skincare";
  image_url: string;
  caption?: string;
}

export interface BusinessSettings {
  salon_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  opening_hours: string;
  open_time: string; // e.g. "10:00"
  close_time: string; // e.g. "20:30"
  instagram_url: string;
  google_maps_url: string;
  slot_interval_minutes: number;
}

export interface BlockedDateItem {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  is_full_day: boolean;
  blocked_times?: string[];
}

