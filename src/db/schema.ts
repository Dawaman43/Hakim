import { pgTable, text, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  telegramId: text("telegram_id"),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const otpCodes = pgTable("otp_codes", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  purpose: text("purpose").notNull(), // LOGIN or REGISTRATION
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const hospitals = pgTable("hospitals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  city: text("city"),
  address: text("address").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  emergencyContactNumber: text("emergency_contact_number"),
  isActive: boolean("is_active").notNull().default(true),
  facilityType: text("facility_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const departments = pgTable("departments", {
  id: text("id").primaryKey(),
  hospitalId: text("hospital_id").notNull().references(() => hospitals.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  averageServiceTimeMin: integer("average_service_time_min").notNull().default(15),
  dailyCapacity: integer("daily_capacity").notNull().default(50),
  currentQueueCount: integer("current_queue_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hospitalId: text("hospital_id").notNull().references(() => hospitals.id, { onDelete: "cascade" }),
  departmentId: text("department_id").notNull().references(() => departments.id, { onDelete: "cascade" }),
  tokenNumber: integer("token_number").notNull(),
  status: text("status", { enum: ["WAITING", "SERVING", "COMPLETED", "CANCELLED", "SKIPPED", "EMERGENCY"] }).notNull().default("WAITING"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  servedAt: timestamp("served_at", { withTimezone: true }),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  appointmentId: text("appointment_id").references(() => appointments.id, { onDelete: "set null" }),
  type: text("type").notNull(), // e.g., TOKEN_BOOKED, YOUR_TURN
  channel: text("channel").notNull(), // SMS, PUSH, EMAIL
  recipient: text("recipient").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("PENDING"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
