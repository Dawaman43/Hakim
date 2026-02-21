CREATE TABLE "departments" (
	"id" text PRIMARY KEY NOT NULL,
	"hospital_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"average_service_time_min" integer DEFAULT 15 NOT NULL,
	"daily_capacity" integer DEFAULT 50 NOT NULL,
	"current_queue_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hospitals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"city" text,
	"address" text NOT NULL,
	"latitude" real,
	"longitude" real,
	"emergency_contact_number" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"facility_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE cascade ON UPDATE no action;