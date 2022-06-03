-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
