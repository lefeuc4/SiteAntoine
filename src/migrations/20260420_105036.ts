import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "accueil" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre_onglet" varchar DEFAULT 'Antoine Profit — Coach Bien-Etre',
  	"hero_titre" varchar NOT NULL,
  	"hero_description" varchar NOT NULL,
  	"hero_image_id" integer,
  	"presentation" varchar NOT NULL,
  	"cta_titre" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "accueil_id" integer;
  ALTER TABLE "accueil" ADD CONSTRAINT "accueil_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "accueil_hero_image_idx" ON "accueil" USING btree ("hero_image_id");
  CREATE INDEX "accueil_updated_at_idx" ON "accueil" USING btree ("updated_at");
  CREATE INDEX "accueil_created_at_idx" ON "accueil" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accueil_fk" FOREIGN KEY ("accueil_id") REFERENCES "public"."accueil"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_accueil_id_idx" ON "payload_locked_documents_rels" USING btree ("accueil_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "accueil" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "accueil" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_accueil_fk";
  
  DROP INDEX "payload_locked_documents_rels_accueil_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "accueil_id";`)
}
