import type {
  User,
  ClientProfile,
  ArtisanProfile,
  Projet,
  Devis,
  Chantier,
  Tache,
  Rapport,
  Document,
  Message,
  Avis,
  Specialite,
} from "@/generated/prisma"

export type {
  User,
  ClientProfile,
  ArtisanProfile,
  Projet,
  Devis,
  Chantier,
  Tache,
  Rapport,
  Document,
  Message,
  Avis,
  Specialite,
}

export type ArtisanAvecProfil = ArtisanProfile & {
  user: Pick<User, "name" | "image">
  specialites: Specialite[]
  _count: { devis: number; chantiers: number; avis: number }
}

export type ProjetAvecDetails = Projet & {
  client: ClientProfile & { user: Pick<User, "name" | "image"> }
  _count: { devis: number }
}

export type ChantierComplet = Chantier & {
  projet: Projet & { client: ClientProfile & { user: Pick<User, "name" | "image"> } }
  artisan: ArtisanProfile & { user: Pick<User, "name" | "image">; specialites: Specialite[] }
  devis: Devis
  taches: Tache[]
  rapports: Rapport[]
  documents: Document[]
  avis: Avis | null
}
