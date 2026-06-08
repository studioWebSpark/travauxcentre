import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const devis = await prisma.devisCrm.findUnique({
    where:   { token },
    include: {
      lignes:           true,
      etapesPaiement:   { orderBy: { ordre: "asc" } },
      lead:             { select: { nom: true, email: true, telephone: true, ville: true, codePostal: true } },
      chantier:         { select: { titre: true, adresse: true } },
    },
  })
  if (!devis) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
  return NextResponse.json(devis)
}

export async function POST(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const devis = await prisma.devisCrm.findUnique({
    where:   { token },
    include: { lead: { select: { nom: true, email: true } }, chantier: { select: { titre: true } } },
  })
  if (!devis)               return NextResponse.json({ error: "Introuvable" }, { status: 404 })
  if (devis.statut === "ACCEPTE") return NextResponse.json({ alreadyAccepted: true })

  await prisma.devisCrm.update({
    where: { token },
    data:  { statut: "ACCEPTE", dateAccepte: new Date() },
  })

  // Notification artisan
  const nodemailer = (await import("nodemailer")).default
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  await t.sendMail({
    from:    `CRM Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      process.env.EMAIL_TO,
    subject: `✅ Devis ${devis.numero} accepté — ${devis.lead?.nom ?? "Client"}`,
    html: `<p><strong>${devis.lead?.nom}</strong> a accepté le devis <strong>${devis.numero}</strong>. Vous pouvez démarrer le chantier.</p>`,
  })

  return NextResponse.json({ success: true })
}
