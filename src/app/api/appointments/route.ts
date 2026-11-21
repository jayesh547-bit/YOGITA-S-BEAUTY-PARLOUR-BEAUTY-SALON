import { NextRequest, NextResponse } from "next/server";
import { SalonRepo } from "@/lib/supabase";
import {
  validateBookingConflict,
  generateReferenceNumber,
} from "@/lib/booking-engine";
import { AppointmentItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const ref = searchParams.get("ref");

    const all = await SalonRepo.getAppointments();

    if (ref) {
      const match = all.find((a) => a.reference_no.toUpperCase() === ref.toUpperCase());
      if (!match) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      return NextResponse.json({ appointment: match });
    }

    if (date) {
      const filtered = all.filter((a) => a.appointment_date === date);
      return NextResponse.json({ appointments: filtered });
    }

    return NextResponse.json({ appointments: all });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      service_id,
      service_name,
      service_type = "service",
      beautician_id = "any",
      beautician_name = "Any Available Beautician",
      appointment_date,
      appointment_time,
      duration_minutes = 45,
      special_requests = "",
    } = body;

    // 1. Validation of required fields
    if (
      !customer_name?.trim() ||
      !customer_phone?.trim() ||
      !service_id ||
      !service_name ||
      !appointment_date ||
      !appointment_time
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: Name, Phone, Service, Date, and Time are required.",
        },
        { status: 400 }
      );
    }

    // Phone number format sanity check (at least 10 digits)
    const cleanPhone = customer_phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    // 2. Fetch existing appointments to validate conflict on server
    const existing = await SalonRepo.getAppointments();
    const settings = await SalonRepo.getSettings();

    const conflictCheck = validateBookingConflict({
      date: appointment_date,
      time: appointment_time,
      durationMinutes: Number(duration_minutes),
      beauticianId: beautician_id,
      existingAppointments: existing,
      openTime: settings.open_time,
      closeTime: settings.close_time,
    });

    if (!conflictCheck.valid) {
      return NextResponse.json(
        { error: conflictCheck.error || "Time slot conflict detected." },
        { status: 409 }
      );
    }

    // 3. Construct new appointment with unique reference
    const reference_no = generateReferenceNumber();
    const newAppointment: AppointmentItem = {
      id: "app_" + Math.random().toString(36).substring(2, 11),
      reference_no,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email?.trim() || undefined,
      service_id,
      service_name,
      service_type: service_type as "service" | "package",
      beautician_id,
      beautician_name,
      appointment_date,
      appointment_time,
      duration_minutes: Number(duration_minutes),
      status: "PENDING",
      special_requests: special_requests.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    const result = await SalonRepo.saveAppointment(newAppointment);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Could not save appointment to database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request received successfully.",
        appointment: result.data || newAppointment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

