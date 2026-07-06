-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "facebookUrl" TEXT;

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "corpsHtml" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampagneMarketing" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "corpsHtml" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampagneMarketing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvoiCampagne" (
    "id" TEXT NOT NULL,
    "campagneId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ENVOYE',
    "erreur" TEXT,
    "envoyeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvoiCampagne_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnvoiCampagne" ADD CONSTRAINT "EnvoiCampagne_campagneId_fkey" FOREIGN KEY ("campagneId") REFERENCES "CampagneMarketing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvoiCampagne" ADD CONSTRAINT "EnvoiCampagne_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

