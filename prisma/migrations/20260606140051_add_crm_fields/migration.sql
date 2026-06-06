/*
  Warnings:

  - Added the required column `updatedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatutLead" AS ENUM ('NOUVEAU', 'CONTACTE', 'DEVIS_ENVOYE', 'GAGNE', 'PERDU', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "PrioriteLead" AS ENUM ('HAUTE', 'NORMALE', 'BASSE');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "commentaireInterne" TEXT,
ADD COLUMN     "dateContact" TIMESTAMP(3),
ADD COLUMN     "dateRdv" TIMESTAMP(3),
ADD COLUMN     "montantDevis" DOUBLE PRECISION,
ADD COLUMN     "priorite" "PrioriteLead" NOT NULL DEFAULT 'NORMALE',
ADD COLUMN     "statut" "StatutLead" NOT NULL DEFAULT 'NOUVEAU',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- CreateTable
CREATE TABLE "NoteLead" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "auteur" TEXT NOT NULL DEFAULT 'Équipe',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoteLead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NoteLead" ADD CONSTRAINT "NoteLead_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
