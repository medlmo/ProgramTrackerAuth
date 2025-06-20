CREATE TABLE "users" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    "username" text NOT NULL UNIQUE,
    "password_hash" text NOT NULL,
    "role" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
); 