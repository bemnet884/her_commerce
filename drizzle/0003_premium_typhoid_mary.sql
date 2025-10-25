ALTER TABLE "user" ALTER COLUMN "phone" SET DEFAULT 'N/A';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "location" SET DEFAULT 'Unknown';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "confirm_password";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "deleted_at";