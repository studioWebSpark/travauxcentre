-- Enable Row Level Security on every table in the public schema.
-- The app talks to Postgres exclusively through Prisma using the "postgres" role
-- (see DATABASE_URL/DIRECT_URL), which has BYPASSRLS, so this is a no-op for the app.
-- It only blocks Supabase's auto-generated PostgREST API (anon/authenticated roles),
-- which currently exposes every row -- including User.password and Account OAuth
-- tokens -- with zero protection. No policies are added on purpose: nothing should
-- be reading these tables through the REST API at all.

ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ClientProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ArtisanProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Projet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Devis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Avis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Chantier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Tache" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Rapport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Specialite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NoteLead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Planning" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ChantierCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DepenseChantier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."RapportJournalier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EtapeChantierCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PhotoChantierCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NoteChantierCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DevisCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LigneDevisCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EtapePaiementDevis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."FactureCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LigneFactureCrm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VeilleAnnonce" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."XpEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."RendezVous" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CrmUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
