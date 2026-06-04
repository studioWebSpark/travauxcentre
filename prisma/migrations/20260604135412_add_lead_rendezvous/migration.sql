-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "typeTravaux" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "surface" DOUBLE PRECISION,
    "budget" TEXT,
    "dateSouhaitee" TEXT,
    "source" TEXT,
    "hubspotContactId" TEXT,
    "hubspotDealId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "typeRdv" TEXT NOT NULL,
    "message" TEXT,
    "creneau" TEXT,
    "hubspotTaskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("id")
);
