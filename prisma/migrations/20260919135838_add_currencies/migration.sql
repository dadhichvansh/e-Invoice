-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "currencies_user_id_idx" ON "currencies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_user_id_code_key" ON "currencies"("user_id", "code");

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
