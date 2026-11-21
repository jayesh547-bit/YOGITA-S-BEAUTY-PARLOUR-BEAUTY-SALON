import { AppointmentItem } from "./types";

/**
 * Time utility to convert "HH:mm" to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Time utility to convert minutes from midnight back to "HH:mm"
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Formats "HH:mm" (24-hour) to luxury 12-hour display, e.g. "10:30 AM"
 */
export function formatTime12Hour(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const minuteStr = String(m).padStart(2, "0");
  return `${hour12}:${minuteStr} ${period}`;
}

/**
 * Formats date "YYYY-MM-DD" to human readable luxury string, e.g. "Saturday, Nov 8, 2025"
 */
export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get current date string in Asia/Kolkata timezone (YYYY-MM-DD)
 */
export function getKolkataCurrentDate(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

/**
 * Get current time in Asia/Kolkata timezone (HH:mm)
 */
export function getKolkataCurrentTime(): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(new Date());
}

/**
 * Checks if two time intervals [start1, end1] and [start2, end2] overlap
 */
export function doIntervalsOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return Math.max(start1, start2) < Math.min(end1, end2);
}

/**
 * Generates available time slots for a given date, beautician, and duration
 */
export function getAvailableSlots({
  date,
  durationMinutes,
  beauticianId,
  existingAppointments,
  openTime = "10:00",
  closeTime = "20:30",
  slotIntervalMinutes = 30,
}: {
  date: string;
  durationMinutes: number;
  beauticianId: string;
  existingAppointments: AppointmentItem[];
  openTime?: string;
  closeTime?: string;
  slotIntervalMinutes?: number;
}): { time: string; available: boolean; conflictReason?: string }[] {
  const startDayMinutes = timeToMinutes(openTime);
  const endDayMinutes = timeToMinutes(closeTime);
  const slots: { time: string; available: boolean; conflictReason?: string }[] = [];

  const todayStr = getKolkataCurrentDate();
  const currentTimeMinutes = timeToMinutes(getKolkataCurrentTime());
  const isToday = date === todayStr;

  // Filter existing appointments for that date that are active
  const dayAppointments = existingAppointments.filter(
    (app) =>
      app.appointment_date === date &&
      app.status !== "REJECTED" &&
      app.status !== "CANCELLED" &&
      (beauticianId === "any" || app.beautician_id === "any" || app.beautician_id === beauticianId)
  );

  for (
    let slotStart = startDayMinutes;
    slotStart + durationMinutes <= endDayMinutes;
    slotStart += slotIntervalMinutes
  ) {
    const slotEnd = slotStart + durationMinutes;
    const timeString = minutesToTime(slotStart);

    // If it's today and the time is already past (with 15 min grace)
    if (isToday && slotStart <= currentTimeMinutes + 15) {
      slots.push({
        time: timeString,
        available: false,
        conflictReason: "Time has passed today",
      });
      continue;
    }

    // Check overlap with any active appointment
    let hasConflict = false;
    let conflictName = "";

    for (const app of dayAppointments) {
      const appStart = timeToMinutes(app.appointment_time);
      const appEnd = appStart + (app.duration_minutes || 45);

      if (doIntervalsOverlap(slotStart, slotEnd, appStart, appEnd)) {
        hasConflict = true;
        conflictName = app.service_name;
        break;
      }
    }

    slots.push({
      time: timeString,
      available: !hasConflict,
      conflictReason: hasConflict ? `Booked for ${conflictName}` : undefined,
    });
  }

  return slots;
}

/**
 * Server-side / backend conflict validator
 */
export function validateBookingConflict({
  date,
  time,
  durationMinutes,
  beauticianId,
  existingAppointments,
  openTime = "10:00",
  closeTime = "20:30",
  excludeAppointmentId,
}: {
  date: string;
  time: string;
  durationMinutes: number;
  beauticianId: string;
  existingAppointments: AppointmentItem[];
  openTime?: string;
  closeTime?: string;
  excludeAppointmentId?: string;
}): { valid: boolean; error?: string } {
  const reqStart = timeToMinutes(time);
  const reqEnd = reqStart + durationMinutes;
  const dayStart = timeToMinutes(openTime);
  const dayEnd = timeToMinutes(closeTime);

  // Check business hours
  if (reqStart < dayStart || reqEnd > dayEnd) {
    return {
      valid: false,
      error: `Appointment is outside salon business hours (${openTime} - ${closeTime}).`,
    };
  }

  // Check if date is in the past in Asia/Kolkata timezone
  const todayStr = getKolkataCurrentDate();
  if (date < todayStr) {
    return {
      valid: false,
      error: "Cannot book appointments on past dates.",
    };
  }

  // Check today past time
  if (date === todayStr) {
    const currentMins = timeToMinutes(getKolkataCurrentTime());
    if (reqStart <= currentMins) {
      return {
        valid: false,
        error: "Selected appointment time has already passed for today.",
      };
    }
  }

  // Overlap check
  for (const app of existingAppointments) {
    if (excludeAppointmentId && app.id === excludeAppointmentId) continue;
    if (app.status === "REJECTED" || app.status === "CANCELLED") continue;
    if (app.appointment_date !== date) continue;

    const matchesBeautician =
      beauticianId === "any" || app.beautician_id === "any" || app.beautician_id === beauticianId;

    if (!matchesBeautician) continue;

    const appStart = timeToMinutes(app.appointment_time);
    const appEnd = appStart + (app.duration_minutes || 45);

    if (doIntervalsOverlap(reqStart, reqEnd, appStart, appEnd)) {
      return {
        valid: false,
        error: `Time conflict: This slot conflicts with an existing booking for ${app.service_name} (${formatTime12Hour(app.appointment_time)} - ${formatTime12Hour(minutesToTime(appEnd))}).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Generate a luxury booking reference number
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `YOG-${year}-${random}`;
}

