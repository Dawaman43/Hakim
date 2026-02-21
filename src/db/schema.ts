import { pgTable, text, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";

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
