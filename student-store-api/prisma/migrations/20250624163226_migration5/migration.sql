/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customer_id" DROP DEFAULT;
DROP SEQUENCE "Order_customer_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Order_customer_id_key" ON "Order"("customer_id");
