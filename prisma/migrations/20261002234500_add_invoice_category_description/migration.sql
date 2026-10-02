ALTER TABLE "invoices"
ADD COLUMN "invoice_category_description" TEXT;

UPDATE "invoices" AS invoice
SET "invoice_category_description" = category."description"
FROM "invoice_categories" AS category
WHERE invoice."invoice_category_id" = category."id"
  AND invoice."invoice_category_description" IS NULL;
