import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp_number" varchar DEFAULT '33600000000' NOT NULL,
  	"whatsapp_message" varchar DEFAULT 'Bonjour Antoine, je suis interesse par vos services...' NOT NULL,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "mentions_legales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contenu" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_full_sizes_full_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_full_url";
  ALTER TABLE "media" DROP COLUMN "sizes_full_width";
  ALTER TABLE "media" DROP COLUMN "sizes_full_height";
  ALTER TABLE "media" DROP COLUMN "sizes_full_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_full_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_full_filename";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mentions_legales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_settings" CASCADE;
  DROP TABLE "mentions_legales" CASCADE;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_full_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_full_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_full_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_full_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_full_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_full_filename" varchar;
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");`)
}
