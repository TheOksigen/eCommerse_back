/*
  Warnings:

  - You are about to drop the column `colorsId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Size` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,slug]` on the table `Brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,phone,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Brands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Colors` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_colorsId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sizeId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phone_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Brands" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "colorsId",
DROP COLUMN "sizeId",
ADD COLUMN     "Colors" "eColors" NOT NULL,
ADD COLUMN     "Size" "eSize" NOT NULL;

-- DropTable
DROP TABLE "Colors";

-- DropTable
DROP TABLE "Size";

-- CreateIndex
CREATE UNIQUE INDEX "Brands_name_slug_key" ON "Brands"("name", "slug");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Product_name_description_idx" ON "Product"("name", "description");

-- CreateIndex
CREATE INDEX "Subcategory_name_idx" ON "Subcategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_phone_email_key" ON "User"("username", "phone", "email");
