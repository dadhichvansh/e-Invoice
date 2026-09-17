/*
  Add slug to existing clients.

  Existing clients are assigned a temporary slug before
  the column is made required and unique.
*/

-- Add the column as nullable first
ALTER TABLE "clients"
ADD COLUMN "slug" TEXT;

-- Generate a slug for existing clients
UPDATE "clients"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRIM("name"),
      '[^a-zA-Z0-9\s-]',
      '',
      'g'
    ),
    '\s+',
    '-',
    'g'
  )
) || '-' || SUBSTRING(REPLACE("id"::text, '-', ''), 1, 8);

-- Make the column required
ALTER TABLE "clients"
ALTER COLUMN "slug" SET NOT NULL;

-- Create the unique constraint
CREATE UNIQUE INDEX "clients_user_id_slug_key"
ON "clients"("user_id", "slug");
