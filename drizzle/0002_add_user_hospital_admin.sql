ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "email" text,
  ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'PATIENT' NOT NULL,
  ADD COLUMN IF NOT EXISTS "is_verified" boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS "password_hash" text;

ALTER TABLE "hospitals"
  ADD COLUMN IF NOT EXISTS "admin_id" text;

DO $$ BEGIN
  ALTER TABLE "hospitals"
    ADD CONSTRAINT "hospitals_admin_id_users_id_fk"
    FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
