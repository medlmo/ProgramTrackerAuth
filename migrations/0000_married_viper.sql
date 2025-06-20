CREATE TABLE "programmes" (
	"id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	"nom" text NOT NULL,
	"secteur" text NOT NULL,
	"objectif_global" text,
	"partenaires" text,
	"montant_global" numeric(12, 2),
	"participation_region" numeric(12, 2),
	"date_debut" timestamp,
	"duree" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projets" (
	"id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	"nom" text NOT NULL,
	"programme_id" integer NOT NULL,
	"objectifs" text,
	"partenaires" text,
	"montant_global" numeric(12, 2),
	"participation_region" numeric(12, 2),
	"maitre_ouvrage" text,
	"provinces" text,
	"communes" text,
	"indicateurs_qualitatifs" text,
	"indicateurs_quantitatifs" text,
	"etat_avancement" text NOT NULL,
	"remarques" text,
	"date_debut" timestamp,
	"duree" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projets" ADD CONSTRAINT "projets_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE no action ON UPDATE no action;