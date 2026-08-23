-- CreateTable
CREATE TABLE "email_change_verifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "new_email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_change_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_change_verifications_user_id_idx" ON "email_change_verifications"("user_id");

-- CreateIndex
CREATE INDEX "email_change_verifications_expires_at_idx" ON "email_change_verifications"("expires_at");

-- AddForeignKey
ALTER TABLE "email_change_verifications" ADD CONSTRAINT "email_change_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
