/*
  Warnings:

  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "country",
ADD COLUMN     "countryId" TEXT;

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "alpha2" TEXT NOT NULL,
    "alpha3" TEXT NOT NULL,
    "countryCallingCodes" TEXT[],
    "currencies" TEXT[],
    "emoji" TEXT,
    "ioc" TEXT NOT NULL,
    "languages" TEXT[],
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_userId_key" ON "country"("userId");

-- AddForeignKey
ALTER TABLE "country" ADD CONSTRAINT "country_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
