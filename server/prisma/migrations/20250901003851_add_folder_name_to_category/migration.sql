/*
  Warnings:

  - A unique constraint covering the columns `[folderName]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `folderName` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "folderName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_folderName_key" ON "public"."Category"("folderName");
