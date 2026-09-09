-- CreateTable
CREATE TABLE "invoicing_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "invoice_prefix" TEXT,
    "default_currency" TEXT,
    "default_payment_terms" INTEGER,
    "default_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoicing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_categories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoicing_settings_user_id_key" ON "invoicing_settings"("user_id");

-- CreateIndex
CREATE INDEX "invoice_categories_user_id_idx" ON "invoice_categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_categories_user_id_code_key" ON "invoice_categories"("user_id", "code");

-- AddForeignKey
ALTER TABLE "invoicing_settings" ADD CONSTRAINT "invoicing_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_categories" ADD CONSTRAINT "invoice_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
