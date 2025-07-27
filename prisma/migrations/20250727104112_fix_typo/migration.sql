/*
  Warnings:

  - You are about to drop the column `sessiomCartId` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `sessionCartId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" RENAME COLUMN "sessiomCartId" TO "sessionCartId";

